"""Tests for factual grounding metric."""

from mlflow.metrics import MetricValue

from mlflow_regulatory_compliance.metrics.factual_grounding import (
    _compute_token_overlap,
    _evaluate_grounding,
    _extract_claims,
    factual_grounding_eval_fn,
    factual_grounding_metric,
)


class TestClaimExtraction:
    """Tests for claim extraction from text."""

    def test_sentence_extraction(self):
        text = "The cat sat on the mat. The dog barked loudly at the mailman."
        claims = _extract_claims(text, method="sentence")
        assert len(claims) >= 1

    def test_short_fragments_filtered(self):
        text = "Yes. No. Maybe. The treatment was administered on Tuesday morning."
        claims = _extract_claims(text, method="sentence")
        # Short fragments should be filtered, long sentence kept
        assert any("treatment" in c for c in claims)

    def test_empty_text(self):
        claims = _extract_claims("", method="sentence")
        assert claims == []

    def test_none_text(self):
        claims = _extract_claims(None, method="sentence")
        assert claims == []

    def test_single_sentence(self):
        text = "The patient was treated with antibiotics for the infection."
        claims = _extract_claims(text, method="sentence")
        assert len(claims) == 1


class TestTokenOverlap:
    """Tests for token overlap computation."""

    def test_full_overlap(self):
        claim = "The cat sat on the mat."
        context = "The cat sat on the mat in the living room."
        score = _compute_token_overlap(claim, context)
        assert score == 1.0

    def test_no_overlap(self):
        claim = "Jupiter is the largest planet."
        context = "The recipe calls for flour, sugar, and eggs."
        score = _compute_token_overlap(claim, context)
        assert score < 0.3

    def test_partial_overlap(self):
        claim = "The cat sat on the mat."
        context = "A cat was sleeping on the floor."
        score = _compute_token_overlap(claim, context)
        assert 0.0 < score < 1.0

    def test_empty_claim(self):
        score = _compute_token_overlap("", "Some context text here.")
        assert score == 1.0  # Empty claim trivially grounded


class TestGroundingEvaluation:
    """Tests for grounding evaluation of individual texts."""

    def test_fully_grounded(self):
        context = (
            "The patient was admitted on January 5th with chest pain. "
            "An ECG was performed and showed normal sinus rhythm. "
            "Blood tests revealed elevated troponin levels."
        )
        prediction = (
            "The patient was admitted with chest pain. "
            "An ECG showed normal sinus rhythm. "
            "Blood tests showed elevated troponin levels."
        )
        result = _evaluate_grounding(prediction, context, similarity_threshold=0.5)
        assert result["grounding_score"] > 0.5
        assert result["grounded_claims"] >= 1

    def test_completely_ungrounded(self):
        context = "The weather in London was sunny yesterday."
        prediction = (
            "The patient received chemotherapy treatment. "
            "The surgery was scheduled for next Tuesday."
        )
        result = _evaluate_grounding(prediction, context)
        assert result["grounding_score"] < 0.5
        assert result["ungrounded_claims"] >= 1

    def test_partially_grounded(self):
        context = "The company reported revenue of $10 million in Q3."
        prediction = (
            "The company reported revenue of $10 million in Q3. "
            "They also announced plans to expand into European markets."
        )
        result = _evaluate_grounding(prediction, context)
        assert 0.0 < result["grounding_score"] < 1.0

    def test_no_context(self):
        prediction = "The stock price increased by 15% last quarter."
        result = _evaluate_grounding(prediction, "")
        assert result["grounding_score"] == 0.0
        assert result["ungrounded_claims"] > 0

    def test_empty_prediction(self):
        result = _evaluate_grounding("", "Some context here.")
        assert result["grounding_score"] == 0.0

    def test_none_prediction(self):
        result = _evaluate_grounding(None, "Context")
        assert result["grounding_score"] == 0.0

    def test_none_context(self):
        result = _evaluate_grounding("A claim about something.", None)
        assert result["grounding_score"] == 0.0

    def test_details_structure(self):
        context = "The project deadline is March 15th."
        prediction = "The project deadline is March 15th."
        result = _evaluate_grounding(prediction, context)
        for detail in result["grounding_details"]:
            assert "claim" in detail
            assert "grounded" in detail
            assert "score" in detail

    def test_custom_threshold(self):
        context = "Revenue was approximately $5 million."
        prediction = "Revenue reached about $5 million in total earnings."
        # With high threshold, may not be grounded
        result_high = _evaluate_grounding(
            prediction, context, similarity_threshold=0.9
        )
        # With low threshold, should be grounded
        result_low = _evaluate_grounding(
            prediction, context, similarity_threshold=0.3
        )
        assert result_low["grounding_score"] >= result_high["grounding_score"]


class TestGroundingEvalFn:
    """Tests for the MLflow eval_fn interface."""

    def test_batch_evaluation(self):
        predictions = [
            "The company reported $10M revenue.",
            "Aliens landed in the parking lot.",
        ]
        result = factual_grounding_eval_fn(predictions)
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 2

    def test_with_context_kwarg(self):
        predictions = [
            "The patient has a broken arm.",
            "The patient has cancer.",
        ]
        import pandas as pd

        contexts = pd.Series([
            "Patient presents with fractured radius in right arm.",
            "Patient presents with fractured radius in right arm.",
        ])
        result = factual_grounding_eval_fn(
            predictions, context=contexts
        )
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 2

    def test_aggregate_results(self):
        predictions = ["Hello world."]
        result = factual_grounding_eval_fn(predictions)
        assert "mean" in result.aggregate_results
        assert "fully_grounded_ratio" in result.aggregate_results

    def test_empty_predictions(self):
        result = factual_grounding_eval_fn([])
        assert result.scores == []


class TestGroundingMetricObject:
    """Tests for the make_metric() output object."""

    def test_metric_name(self):
        assert factual_grounding_metric.name == "factual_grounding_score"

    def test_greater_is_better(self):
        assert factual_grounding_metric.greater_is_better is True
