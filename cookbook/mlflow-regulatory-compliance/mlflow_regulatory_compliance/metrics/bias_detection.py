"""Demographic bias detection metric for MLflow evaluation.

Detects bias across five dimensions: gender, racial/ethnic, age,
disability, and socioeconomic. Uses curated indicator lists with
configurable sensitivity levels.
"""

from typing import Dict, List, Optional

from mlflow.metrics import MetricValue, make_metric

from mlflow_regulatory_compliance.utils.patterns import BiasIndicators
from mlflow_regulatory_compliance.utils.scoring import (
    normalize_score,
    standard_aggregations,
)

# Sensitivity thresholds map to which indicator severity levels are checked
_SENSITIVITY_LEVELS = {
    "low": ["high"],
    "medium": ["high", "medium"],
    "high": ["high", "medium", "low"],
}

# Weights for severity levels when computing bias score
_SEVERITY_WEIGHTS = {
    "high": 1.0,
    "medium": 0.6,
    "low": 0.3,
}


def _detect_bias_in_text(
    text: str,
    bias_dimensions: Optional[List[str]] = None,
    sensitivity: str = "medium",
    custom_terms: Optional[Dict[str, List[str]]] = None,
) -> Dict:
    """Detect demographic bias in a single text string.

    Args:
        text: The text to analyze.
        bias_dimensions: List of dimensions to check. Default: all.
        sensitivity: "low", "medium", or "high".
        custom_terms: Additional terms to check, keyed by dimension.

    Returns:
        Dict with keys: bias_detected, bias_score,
        bias_dimensions_triggered, bias_details.
    """
    if not text or not isinstance(text, str):
        return {
            "bias_detected": False,
            "bias_score": 0.0,
            "bias_dimensions_triggered": [],
            "bias_details": [],
        }

    text_lower = text.lower()
    if bias_dimensions is None:
        bias_dimensions = list(BiasIndicators.ALL_DIMENSIONS.keys())

    severity_levels = _SENSITIVITY_LEVELS.get(sensitivity, _SENSITIVITY_LEVELS["medium"])
    findings = []

    for dimension in bias_dimensions:
        indicators = BiasIndicators.ALL_DIMENSIONS.get(dimension, {})

        for level in severity_levels:
            terms = indicators.get(level, [])
            for term in terms:
                if term.lower() in text_lower:
                    findings.append({
                        "dimension": dimension,
                        "indicator": term,
                        "severity": level,
                        "context": _extract_context(text, term),
                    })

        # Check custom terms for this dimension
        if custom_terms and dimension in custom_terms:
            for term in custom_terms[dimension]:
                if term.lower() in text_lower:
                    findings.append({
                        "dimension": dimension,
                        "indicator": term,
                        "severity": "custom",
                        "context": _extract_context(text, term),
                    })

    # Deduplicate by indicator
    seen = set()
    unique_findings = []
    for f in findings:
        key = (f["dimension"], f["indicator"])
        if key not in seen:
            seen.add(key)
            unique_findings.append(f)

    dimensions_triggered = list(set(f["dimension"] for f in unique_findings))

    # Compute bias score
    if not unique_findings:
        bias_score = 0.0
    else:
        weighted_sum = sum(
            _SEVERITY_WEIGHTS.get(f["severity"], 0.5) for f in unique_findings
        )
        # Normalize: more findings and more dimensions -> higher score
        count_factor = min(weighted_sum / 3.0, 1.0)
        dimension_factor = min(len(dimensions_triggered) / 3.0, 1.0)
        bias_score = normalize_score(
            0.6 * count_factor + 0.4 * dimension_factor
        )

    return {
        "bias_detected": len(unique_findings) > 0,
        "bias_score": bias_score,
        "bias_dimensions_triggered": dimensions_triggered,
        "bias_details": unique_findings,
    }


def _extract_context(text: str, term: str, window: int = 50) -> str:
    """Extract a context snippet around a matched term."""
    text_lower = text.lower()
    idx = text_lower.find(term.lower())
    if idx == -1:
        return ""
    start = max(0, idx - window)
    end = min(len(text), idx + len(term) + window)
    snippet = text[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."
    return snippet


def bias_detection_eval_fn(predictions, targets=None, metrics=None, **kwargs):
    """Evaluate bias detection across a batch of predictions.

    Configuration can be passed via evaluator_config:
        evaluator_config={
            "bias_dimensions": ["gender", "racial_ethnic"],
            "sensitivity": "high",
            "custom_terms": {"gender": ["additional_term"]}
        }

    Args:
        predictions: List or Series of model output strings.
        targets: Unused. Present for API compatibility.
        metrics: Unused. Present for API compatibility.
        **kwargs: Optional configuration keys.

    Returns:
        MetricValue with per-row bias scores and aggregate results.
    """
    bias_dimensions = kwargs.get("bias_dimensions", None)
    sensitivity = kwargs.get("sensitivity", "medium")
    custom_terms = kwargs.get("custom_terms", None)

    scores = []
    for prediction in predictions:
        text = str(prediction) if prediction is not None else ""
        result = _detect_bias_in_text(
            text,
            bias_dimensions=bias_dimensions,
            sensitivity=sensitivity,
            custom_terms=custom_terms,
        )
        scores.append(result["bias_score"])

    return MetricValue(
        scores=scores,
        aggregate_results={
            **standard_aggregations(scores),
            "bias_detected_ratio": (
                sum(1 for s in scores if s > 0) / len(scores) if scores else 0.0
            ),
        },
    )


bias_detection_metric = make_metric(
    eval_fn=bias_detection_eval_fn,
    greater_is_better=False,
    name="bias_detection_score",
    long_name="Demographic Bias Detection Score",
    version="v1",
)
