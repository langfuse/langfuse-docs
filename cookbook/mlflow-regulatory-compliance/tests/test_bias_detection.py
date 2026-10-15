"""Tests for bias detection metric."""

from mlflow.metrics import MetricValue

from mlflow_regulatory_compliance.metrics.bias_detection import (
    _detect_bias_in_text,
    bias_detection_eval_fn,
    bias_detection_metric,
)


class TestBiasDetection:
    """Tests for bias detection in individual texts."""

    # Gender bias
    def test_gender_high_severity(self):
        text = "She's being hysterical about the project deadline."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True
        assert "gender" in result["bias_dimensions_triggered"]

    def test_gender_medium_severity(self):
        text = "As a female doctor, she brings a nurturing approach."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True

    def test_gender_low_severity(self):
        text = "The chairman announced the new policy."
        # Low sensitivity should not catch this
        result_low = _detect_bias_in_text(text, sensitivity="low")
        assert result_low["bias_detected"] is False
        # High sensitivity should
        result_high = _detect_bias_in_text(text, sensitivity="high")
        assert result_high["bias_detected"] is True

    # Racial/ethnic bias
    def test_racial_high_severity(self):
        text = "Those people are uncivilized and primitive."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True
        assert "racial_ethnic" in result["bias_dimensions_triggered"]

    def test_racial_medium_severity(self):
        text = "She was described as a model minority student."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True

    # Age bias
    def test_age_high_severity(self):
        text = "The applicant is past their prime for this role."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True
        assert "age" in result["bias_dimensions_triggered"]

    def test_age_medium_severity(self):
        text = "Older workers are too old to learn new technologies."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True

    # Disability bias
    def test_disability_high_severity(self):
        text = "The team thought the idea was completely retarded."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True
        assert "disability" in result["bias_dimensions_triggered"]

    def test_disability_medium_severity(self):
        text = "She's a bit crazy about organizing everything."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True

    # Socioeconomic bias
    def test_socioeconomic_high_severity(self):
        text = "They're just white trash from the trailer park."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is True
        assert "socioeconomic" in result["bias_dimensions_triggered"]

    # Sensitivity levels
    def test_low_sensitivity(self):
        text = "The chairman made a decision."
        result = _detect_bias_in_text(text, sensitivity="low")
        assert result["bias_detected"] is False

    def test_medium_sensitivity(self):
        text = "The chairman made a decision."
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert result["bias_detected"] is False  # "chairman" is low severity

    def test_high_sensitivity(self):
        text = "The chairman made a decision."
        result = _detect_bias_in_text(text, sensitivity="high")
        assert result["bias_detected"] is True

    # Dimension filtering
    def test_filter_dimensions(self):
        text = "She's hysterical. Those people are uncivilized."
        result = _detect_bias_in_text(
            text, bias_dimensions=["gender"], sensitivity="medium"
        )
        assert "gender" in result["bias_dimensions_triggered"]
        assert "racial_ethnic" not in result["bias_dimensions_triggered"]

    # Custom terms
    def test_custom_terms(self):
        text = "The candidate is a code monkey."
        result = _detect_bias_in_text(
            text,
            custom_terms={"socioeconomic": ["code monkey"]},
        )
        assert result["bias_detected"] is True

    # No bias
    def test_no_bias(self):
        text = "The team delivered the project on time and within budget."
        result = _detect_bias_in_text(text)
        assert result["bias_detected"] is False
        assert result["bias_score"] == 0.0

    # Multiple dimensions
    def test_multiple_dimensions(self):
        text = (
            "She's hysterical and those elderly people "
            "are past their prime."
        )
        result = _detect_bias_in_text(text, sensitivity="medium")
        assert len(result["bias_dimensions_triggered"]) >= 2

    # Edge cases
    def test_empty_input(self):
        result = _detect_bias_in_text("")
        assert result["bias_detected"] is False
        assert result["bias_score"] == 0.0

    def test_none_input(self):
        result = _detect_bias_in_text(None)
        assert result["bias_detected"] is False

    def test_score_range(self):
        text = "She's hysterical and those savages are uncivilized."
        result = _detect_bias_in_text(text)
        assert 0.0 <= result["bias_score"] <= 1.0

    def test_context_in_details(self):
        text = "The applicant is past their prime for this position."
        result = _detect_bias_in_text(text, sensitivity="medium")
        for detail in result["bias_details"]:
            assert "context" in detail
            assert "dimension" in detail
            assert "indicator" in detail


class TestBiasEvalFn:
    """Tests for the MLflow eval_fn interface."""

    def test_batch_evaluation(self):
        predictions = [
            "She's being hysterical about the deadline.",
            "The team completed the project successfully.",
            "Those people are uncivilized.",
        ]
        result = bias_detection_eval_fn(predictions)
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 3
        assert result.scores[0] > 0
        assert result.scores[1] == 0
        assert result.scores[2] > 0

    def test_with_sensitivity_kwarg(self):
        predictions = ["The chairman approved the budget."]
        result_low = bias_detection_eval_fn(predictions, sensitivity="low")
        result_high = bias_detection_eval_fn(predictions, sensitivity="high")
        assert result_low.scores[0] <= result_high.scores[0]

    def test_aggregate_results(self):
        predictions = ["Some biased text with savages.", "Clean text."]
        result = bias_detection_eval_fn(predictions)
        assert "mean" in result.aggregate_results
        assert "bias_detected_ratio" in result.aggregate_results

    def test_empty_predictions(self):
        result = bias_detection_eval_fn([])
        assert result.scores == []


class TestBiasMetricObject:
    """Tests for the make_metric() output object."""

    def test_metric_name(self):
        assert bias_detection_metric.name == "bias_detection_score"

    def test_greater_is_better(self):
        assert bias_detection_metric.greater_is_better is False
