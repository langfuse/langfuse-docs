"""Tests for legal privilege detection metric."""

from mlflow.metrics import MetricValue

from mlflow_regulatory_compliance.metrics.legal_privilege import (
    _detect_privilege_in_text,
    legal_privilege_eval_fn,
    legal_privilege_metric,
)


class TestPrivilegeDetection:
    """Tests for privilege detection in individual texts."""

    # Attorney-client privilege tests
    def test_attorney_client_explicit(self):
        text = "This is an attorney-client privilege communication regarding the case."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True
        assert "attorney_client_privilege" in result["privilege_categories"]

    def test_legal_advice(self):
        text = "I am seeking legal advice regarding my employment contract."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True

    def test_privileged_confidential(self):
        text = "PRIVILEGED AND CONFIDENTIAL: Attorney review of merger documents."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True

    def test_solicitor_client(self):
        text = "This solicitor-client privilege applies to our discussions."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True

    # Work product doctrine tests
    def test_work_product(self):
        text = "This memo is attorney work product prepared in anticipation of litigation."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True
        assert "work_product_doctrine" in result["privilege_categories"]

    def test_litigation_strategy(self):
        text = "Our litigation strategy involves filing a motion to dismiss."
        result = _detect_privilege_in_text(text)
        assert "work_product_doctrine" in result["privilege_categories"]

    def test_legal_memo(self):
        text = "Attached is the legal memorandum on patent infringement risks."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True

    # Settlement/mediation tests
    def test_settlement_negotiation(self):
        text = "The settlement negotiation resulted in a $500,000 offer."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True
        assert "settlement_mediation" in result["privilege_categories"]

    def test_without_prejudice(self):
        text = "This communication is without prejudice to our client's rights."
        result = _detect_privilege_in_text(text)
        assert "settlement_mediation" in result["privilege_categories"]

    def test_mediation_session(self):
        text = "During the mediation session, the parties discussed terms."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is True

    def test_rule_408(self):
        text = "Per Rule 408, this offer of compromise is not admissible."
        result = _detect_privilege_in_text(text)
        assert "settlement_mediation" in result["privilege_categories"]

    # False positive tests
    def test_attorney_general_not_flagged(self):
        text = "The attorney general announced new regulations today."
        result = _detect_privilege_in_text(text)
        # May detect "attorney" related keywords but with lower confidence
        if result["privilege_detected"]:
            for detail in result["privilege_details"]:
                assert detail["confidence"] < 0.85

    def test_power_of_attorney_not_flagged(self):
        text = "She granted power of attorney to her daughter."
        result = _detect_privilege_in_text(text)
        # Should not be high confidence
        if result["privilege_detected"]:
            for detail in result["privilege_details"]:
                assert detail["confidence"] <= 0.6

    def test_non_privileged_legal(self):
        text = "The court ruled in favor of the plaintiff on all counts."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is False

    def test_general_legal_discussion(self):
        text = "Contract law governs agreements between parties."
        result = _detect_privilege_in_text(text)
        assert result["privilege_detected"] is False

    # Multiple categories
    def test_multiple_categories(self):
        text = (
            "PRIVILEGED AND CONFIDENTIAL: This legal memorandum was "
            "prepared in anticipation of litigation. The settlement "
            "negotiation terms are attached."
        )
        result = _detect_privilege_in_text(text)
        assert len(result["privilege_categories"]) >= 2
        assert result["privilege_score"] > 0.5

    # Edge cases
    def test_empty_input(self):
        result = _detect_privilege_in_text("")
        assert result["privilege_detected"] is False
        assert result["privilege_score"] == 0.0

    def test_none_input(self):
        result = _detect_privilege_in_text(None)
        assert result["privilege_detected"] is False

    def test_score_range(self):
        text = "This is attorney-client privilege content with legal advice."
        result = _detect_privilege_in_text(text)
        assert 0.0 <= result["privilege_score"] <= 1.0

    def test_confidence_scoring(self):
        text = "This attorney-client privilege communication contains legal advice."
        result = _detect_privilege_in_text(text)
        for detail in result["privilege_details"]:
            assert 0.0 <= detail["confidence"] <= 1.0


class TestPrivilegeEvalFn:
    """Tests for the MLflow eval_fn interface."""

    def test_batch_evaluation(self):
        predictions = [
            "This is privileged and confidential legal advice.",
            "The sky is blue and the grass is green.",
            "Settlement negotiation terms: $1M offer.",
        ]
        result = legal_privilege_eval_fn(predictions)
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 3
        assert result.scores[0] > 0
        assert result.scores[1] == 0
        assert result.scores[2] > 0

    def test_aggregate_results(self):
        predictions = [
            "Privileged and confidential memo.",
            "Just a normal message.",
        ]
        result = legal_privilege_eval_fn(predictions)
        assert "mean" in result.aggregate_results
        assert "privilege_detected_ratio" in result.aggregate_results
        assert result.aggregate_results["privilege_detected_ratio"] == 0.5

    def test_empty_predictions(self):
        result = legal_privilege_eval_fn([])
        assert result.scores == []


class TestPrivilegeMetricObject:
    """Tests for the make_metric() output object."""

    def test_metric_name(self):
        assert legal_privilege_metric.name == "legal_privilege_score"

    def test_greater_is_better(self):
        assert legal_privilege_metric.greater_is_better is False
