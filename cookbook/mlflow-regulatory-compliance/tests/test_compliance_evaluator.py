"""Tests for the RegulatoryComplianceEvaluator."""


from mlflow_regulatory_compliance.evaluators.compliance_evaluator import (
    RegulatoryComplianceEvaluator,
)


class TestRegulatoryComplianceEvaluator:
    """Tests for the compliance evaluator configuration."""

    def test_default_all_metrics_enabled(self):
        evaluator = RegulatoryComplianceEvaluator()
        metrics = evaluator.metrics
        assert len(metrics) == 5  # 4 individual + 1 composite

    def test_disable_pii(self):
        evaluator = RegulatoryComplianceEvaluator(pii_detection=False)
        metrics = evaluator.metrics
        assert len(metrics) == 4
        names = [m.name for m in metrics]
        assert "pii_detection_score" not in names

    def test_disable_privilege(self):
        evaluator = RegulatoryComplianceEvaluator(legal_privilege=False)
        metrics = evaluator.metrics
        assert len(metrics) == 4
        names = [m.name for m in metrics]
        assert "legal_privilege_score" not in names

    def test_disable_grounding(self):
        evaluator = RegulatoryComplianceEvaluator(factual_grounding=False)
        metrics = evaluator.metrics
        assert len(metrics) == 4
        names = [m.name for m in metrics]
        assert "factual_grounding_score" not in names

    def test_disable_bias(self):
        evaluator = RegulatoryComplianceEvaluator(bias_detection=False)
        metrics = evaluator.metrics
        assert len(metrics) == 4
        names = [m.name for m in metrics]
        assert "bias_detection_score" not in names

    def test_disable_all(self):
        evaluator = RegulatoryComplianceEvaluator(
            pii_detection=False,
            legal_privilege=False,
            factual_grounding=False,
            bias_detection=False,
        )
        metrics = evaluator.metrics
        assert len(metrics) == 0

    def test_only_pii(self):
        evaluator = RegulatoryComplianceEvaluator(
            pii_detection=True,
            legal_privilege=False,
            factual_grounding=False,
            bias_detection=False,
        )
        metrics = evaluator.metrics
        assert len(metrics) == 2  # PII + NIST composite
        names = [m.name for m in metrics]
        assert "pii_detection_score" in names
        assert "nist_compliance_score" in names

    def test_evaluator_config(self):
        evaluator = RegulatoryComplianceEvaluator(
            context_column="docs",
            bias_sensitivity="high",
            nist_threshold=0.8,
            bias_dimensions=["gender", "age"],
        )
        config = evaluator.evaluator_config
        assert config["context_column"] == "docs"
        assert config["bias_sensitivity"] == "high"
        assert config["nist_threshold"] == 0.8
        assert config["bias_dimensions"] == ["gender", "age"]

    def test_evaluator_config_defaults(self):
        evaluator = RegulatoryComplianceEvaluator()
        config = evaluator.evaluator_config
        assert config["context_column"] == "context"
        assert config["bias_sensitivity"] == "medium"
        assert config["nist_threshold"] == 0.7

    def test_get_enabled_metrics(self):
        evaluator = RegulatoryComplianceEvaluator()
        names = evaluator.get_enabled_metrics()
        assert "pii_detection_score" in names
        assert "legal_privilege_score" in names
        assert "factual_grounding_score" in names
        assert "bias_detection_score" in names
        assert "nist_compliance_score" in names

    def test_get_enabled_metrics_partial(self):
        evaluator = RegulatoryComplianceEvaluator(
            pii_detection=True,
            legal_privilege=False,
            factual_grounding=False,
            bias_detection=False,
        )
        names = evaluator.get_enabled_metrics()
        assert "pii_detection_score" in names
        assert "legal_privilege_score" not in names
        assert "nist_compliance_score" in names

    def test_custom_nist_weights(self):
        weights = {"pii": 0.4, "privilege": 0.3, "grounding": 0.2, "bias": 0.1}
        evaluator = RegulatoryComplianceEvaluator(nist_weights=weights)
        config = evaluator.evaluator_config
        assert config["nist_weights"] == weights
