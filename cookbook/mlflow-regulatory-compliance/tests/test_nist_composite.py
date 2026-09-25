"""Tests for NIST AI RMF composite compliance score."""

import pytest
from mlflow.metrics import MetricValue

from mlflow_regulatory_compliance.metrics.nist_composite import (
    DEFAULT_WEIGHTS,
    _compute_nist_composite,
    nist_composite_eval_fn,
    nist_composite_metric,
)


class TestNISTComposite:
    """Tests for NIST composite score computation."""

    def test_clean_text_high_score(self):
        text = "The quarterly results showed 12% growth in revenue."
        context = "The company reported 12% revenue growth in the quarterly report."
        result = _compute_nist_composite(text, context)
        assert result["nist_compliance_score"] > 0.5

    def test_problematic_text_low_score(self):
        text = (
            "patient John Smith, email john@example.com, "
            "this is privileged and confidential legal advice. "
            "She's hysterical about the settlement negotiation."
        )
        result = _compute_nist_composite(text, "")
        assert result["nist_compliance_score"] < 0.8

    def test_function_scores_structure(self):
        result = _compute_nist_composite("Some text.", "Some context.")
        assert "GOVERN" in result["nist_function_scores"]
        assert "MAP" in result["nist_function_scores"]
        assert "MEASURE" in result["nist_function_scores"]
        assert "MANAGE" in result["nist_function_scores"]

    def test_govern_always_1(self):
        result = _compute_nist_composite("Any text.", "")
        assert result["nist_function_scores"]["GOVERN"] == 1.0

    def test_nist_pass_above_threshold(self):
        text = "Revenue grew 10%."
        context = "Revenue grew 10% in Q3."
        result = _compute_nist_composite(text, context, nist_threshold=0.5)
        assert result["nist_pass"] is True

    def test_nist_fail_below_threshold(self):
        text = (
            "patient John Smith, SSN 123-45-6789, "
            "privileged legal advice, she's hysterical"
        )
        result = _compute_nist_composite(text, "", nist_threshold=0.99)
        assert result["nist_pass"] is False

    def test_custom_weights(self):
        text = "Some text with email john@test.com"
        weights_pii_heavy = {"pii": 0.7, "privilege": 0.1, "grounding": 0.1, "bias": 0.1}
        weights_equal = {"pii": 0.25, "privilege": 0.25, "grounding": 0.25, "bias": 0.25}

        result_pii = _compute_nist_composite(text, "", weights=weights_pii_heavy)
        result_equal = _compute_nist_composite(text, "", weights=weights_equal)
        # Different weights should produce different scores
        assert result_pii["nist_compliance_score"] != result_equal["nist_compliance_score"]

    def test_score_range(self):
        result = _compute_nist_composite("Some text.", "Context.")
        assert 0.0 <= result["nist_compliance_score"] <= 1.0
        for score in result["nist_function_scores"].values():
            assert 0.0 <= score <= 1.0

    def test_details_contain_all_metrics(self):
        result = _compute_nist_composite("Text.", "Context.")
        details = result["nist_details"]
        assert "pii" in details
        assert "privilege" in details
        assert "grounding" in details
        assert "bias" in details
        assert "weights" in details
        assert "threshold" in details

    def test_default_weights(self):
        assert sum(DEFAULT_WEIGHTS.values()) == pytest.approx(1.0)
        assert all(v == 0.25 for v in DEFAULT_WEIGHTS.values())


class TestNISTCompositeEvalFn:
    """Tests for the MLflow eval_fn interface."""

    def test_batch_evaluation(self):
        predictions = [
            "Clean financial summary with 10% growth.",
            "patient John Smith, privileged legal advice.",
        ]
        result = nist_composite_eval_fn(predictions)
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 2

    def test_aggregate_results(self):
        predictions = ["Some text."]
        result = nist_composite_eval_fn(predictions)
        assert "mean" in result.aggregate_results
        assert "nist_pass_ratio" in result.aggregate_results

    def test_empty_predictions(self):
        result = nist_composite_eval_fn([])
        assert result.scores == []

    def test_with_context(self):
        import pandas as pd

        predictions = ["Revenue was $10M."]
        contexts = pd.Series(["The company earned $10M in revenue."])
        result = nist_composite_eval_fn(predictions, context=contexts)
        assert len(result.scores) == 1


class TestNISTMetricObject:
    """Tests for the make_metric() output object."""

    def test_metric_name(self):
        assert nist_composite_metric.name == "nist_compliance_score"

    def test_greater_is_better(self):
        assert nist_composite_metric.greater_is_better is True
