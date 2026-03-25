"""Tests for NIST compliance report generator."""

import pandas as pd

from mlflow_regulatory_compliance.reporting.nist_report import NISTComplianceReport


class TestNISTComplianceReport:
    """Tests for the NIST report generator."""

    def test_generate_from_texts_basic(self):
        report_gen = NISTComplianceReport()
        predictions = [
            "The quarterly revenue was $10 million.",
            "The company plans to expand operations.",
        ]
        contexts = [
            "Annual report shows $10 million in quarterly revenue.",
            "Strategic plan includes operational expansion.",
        ]
        report = report_gen.generate_from_texts(predictions, contexts)
        assert isinstance(report, pd.DataFrame)
        assert len(report) == 4
        assert list(report.columns) == [
            "nist_function", "metric_name", "score", "status",
            "recommendation", "evidence",
        ]

    def test_report_functions(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["Clean text."])
        functions = report["nist_function"].tolist()
        assert functions == ["GOVERN", "MAP", "MEASURE", "MANAGE"]

    def test_report_metric_names(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["Test."])
        names = report["metric_name"].tolist()
        assert "Governance Readiness" in names
        assert "Factual Grounding" in names
        assert "PII + Bias Detection" in names
        assert "Legal Privilege Protection" in names

    def test_status_pass(self):
        report_gen = NISTComplianceReport(pass_threshold=0.5)
        report = report_gen.generate_from_texts(
            ["Revenue grew 10%."],
            ["Revenue grew 10% in Q3."],
        )
        # GOVERN should always pass
        govern_row = report[report["nist_function"] == "GOVERN"].iloc[0]
        assert govern_row["status"] == "PASS"

    def test_status_thresholds(self):
        report_gen = NISTComplianceReport(
            pass_threshold=0.9, warn_threshold=0.5
        )
        # GOVERN always 1.0, should pass
        report = report_gen.generate_from_texts(["Test text."])
        govern_row = report[report["nist_function"] == "GOVERN"].iloc[0]
        assert govern_row["status"] == "PASS"

    def test_generate_from_scores(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_scores(
            pii_score=0.9,
            privilege_score=0.85,
            grounding_score=0.75,
            bias_score=0.8,
        )
        assert isinstance(report, pd.DataFrame)
        assert len(report) == 4

    def test_generate_from_scores_pass(self):
        report_gen = NISTComplianceReport(pass_threshold=0.7)
        report = report_gen.generate_from_scores(
            pii_score=0.9,
            privilege_score=0.85,
            grounding_score=0.8,
            bias_score=0.9,
        )
        # All high scores should pass
        for _, row in report.iterrows():
            assert row["status"] == "PASS"

    def test_generate_from_scores_fail(self):
        report_gen = NISTComplianceReport(pass_threshold=0.7, warn_threshold=0.4)
        report = report_gen.generate_from_scores(
            pii_score=0.1,
            privilege_score=0.2,
            grounding_score=0.1,
            bias_score=0.1,
        )
        # Low scores should fail for non-GOVERN functions
        map_row = report[report["nist_function"] == "MAP"].iloc[0]
        assert map_row["status"] == "FAIL"

    def test_to_dict(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["Test."])
        result = report_gen.to_dict(report)
        assert "nist_ai_rmf_compliance_report" in result
        assert "summary" in result
        assert "overall_status" in result["summary"]
        assert "functions_passing" in result["summary"]
        assert "functions_total" in result["summary"]
        assert result["summary"]["functions_total"] == 4

    def test_to_dict_all_pass(self):
        report_gen = NISTComplianceReport(pass_threshold=0.1)
        report = report_gen.generate_from_scores(
            pii_score=0.9, privilege_score=0.9,
            grounding_score=0.9, bias_score=0.9,
        )
        result = report_gen.to_dict(report)
        assert result["summary"]["overall_status"] == "PASS"
        assert result["summary"]["functions_passing"] == 4

    def test_recommendations_present(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["Test."])
        for _, row in report.iterrows():
            assert len(row["recommendation"]) > 0

    def test_evidence_present(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["Test."])
        for _, row in report.iterrows():
            assert len(row["evidence"]) > 0

    def test_no_context_provided(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts(["A test prediction."])
        assert isinstance(report, pd.DataFrame)
        assert len(report) == 4

    def test_empty_predictions(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_texts([])
        assert isinstance(report, pd.DataFrame)

    def test_score_precision(self):
        report_gen = NISTComplianceReport()
        report = report_gen.generate_from_scores(
            pii_score=0.12345, privilege_score=0.67890,
            grounding_score=0.54321, bias_score=0.98765,
        )
        for _, row in report.iterrows():
            # Should be rounded to 4 decimal places
            score_str = str(row["score"])
            if "." in score_str:
                decimals = len(score_str.split(".")[1])
                assert decimals <= 4
