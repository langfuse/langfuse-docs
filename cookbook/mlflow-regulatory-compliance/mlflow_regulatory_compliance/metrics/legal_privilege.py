"""Legal privilege detection metric for MLflow evaluation.

Detects potentially privileged legal content in model outputs across three
categories: attorney-client privilege, work product doctrine, and
settlement/mediation communications.
"""

from typing import Dict, List

from mlflow.metrics import MetricValue, make_metric

from mlflow_regulatory_compliance.utils.patterns import PrivilegePatterns
from mlflow_regulatory_compliance.utils.scoring import (
    normalize_score,
    standard_aggregations,
)


def _detect_privilege_in_text(text: str) -> Dict:
    """Detect privileged legal content in a single text string.

    Returns:
        Dict with keys: privilege_detected, privilege_score,
        privilege_categories, privilege_details.
    """
    if not text or not isinstance(text, str):
        return {
            "privilege_detected": False,
            "privilege_score": 0.0,
            "privilege_categories": [],
            "privilege_details": [],
        }

    text_lower = text.lower()
    findings = []

    # Check for false positives first
    false_positive_present = any(
        term in text_lower for term in PrivilegePatterns.FALSE_POSITIVE_TERMS
    )

    # Attorney-client privilege
    ac_matches = _match_keywords(
        text_lower, PrivilegePatterns.ATTORNEY_CLIENT_KEYWORDS
    )
    for kw in ac_matches:
        # Reduce confidence if a false positive term is also present
        confidence = 0.6 if false_positive_present else 0.85
        findings.append({
            "category": "attorney_client_privilege",
            "confidence": confidence,
            "matched_indicator": kw,
        })

    # Work product doctrine
    wp_matches = _match_keywords(
        text_lower, PrivilegePatterns.WORK_PRODUCT_KEYWORDS
    )
    for kw in wp_matches:
        findings.append({
            "category": "work_product_doctrine",
            "confidence": 0.80,
            "matched_indicator": kw,
        })

    # Settlement/mediation communications
    sm_matches = _match_keywords(
        text_lower, PrivilegePatterns.SETTLEMENT_KEYWORDS
    )
    for kw in sm_matches:
        findings.append({
            "category": "settlement_mediation",
            "confidence": 0.75,
            "matched_indicator": kw,
        })

    categories = list(set(f["category"] for f in findings))
    match_count = len(findings)

    # Privilege score: weighted by confidence and number of matches
    if match_count == 0:
        privilege_score = 0.0
    else:
        avg_confidence = sum(f["confidence"] for f in findings) / match_count
        # Scale: more matches and higher confidence -> higher score
        count_factor = min(match_count / 3.0, 1.0)
        category_factor = min(len(categories) / 2.0, 1.0)
        privilege_score = normalize_score(
            avg_confidence * (0.5 * count_factor + 0.5 * category_factor)
        )

    return {
        "privilege_detected": match_count > 0,
        "privilege_score": privilege_score,
        "privilege_categories": categories,
        "privilege_details": findings,
    }


def _match_keywords(text_lower: str, keywords: List[str]) -> List[str]:
    """Find all matching keywords in lowercased text."""
    return [kw for kw in keywords if kw in text_lower]


def legal_privilege_eval_fn(predictions, targets=None, metrics=None, **kwargs):
    """Evaluate legal privilege detection across a batch of predictions.

    Args:
        predictions: List or Series of model output strings.
        targets: Unused. Present for API compatibility.
        metrics: Unused. Present for API compatibility.

    Returns:
        MetricValue with per-row privilege scores and aggregate results.
    """
    scores = []
    for prediction in predictions:
        text = str(prediction) if prediction is not None else ""
        result = _detect_privilege_in_text(text)
        scores.append(result["privilege_score"])

    return MetricValue(
        scores=scores,
        aggregate_results={
            **standard_aggregations(scores),
            "privilege_detected_ratio": (
                sum(1 for s in scores if s > 0) / len(scores) if scores else 0.0
            ),
        },
    )


legal_privilege_metric = make_metric(
    eval_fn=legal_privilege_eval_fn,
    greater_is_better=False,
    name="legal_privilege_score",
    long_name="Legal Privilege Detection Score",
    version="v1",
)
