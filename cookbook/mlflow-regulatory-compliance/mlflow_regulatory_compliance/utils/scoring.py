"""Shared scoring utilities for regulatory compliance metrics."""

import math
from typing import Dict, List, Optional


def standard_aggregations(scores: List[float]) -> Dict[str, float]:
    """Compute standard aggregations (mean, variance, p90) for a list of scores."""
    if not scores:
        return {"mean": 0.0, "variance": 0.0, "p90": 0.0}

    n = len(scores)
    mean = sum(scores) / n
    variance = sum((x - mean) ** 2 for x in scores) / n if n > 1 else 0.0

    sorted_scores = sorted(scores)
    p90_index = math.ceil(0.9 * n) - 1
    p90 = sorted_scores[min(p90_index, n - 1)]

    return {"mean": mean, "variance": variance, "p90": p90}


def normalize_score(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    """Clamp a value to [min_val, max_val]."""
    return max(min_val, min(max_val, value))


def compute_weighted_average(
    scores: Dict[str, float],
    weights: Optional[Dict[str, float]] = None,
) -> float:
    """Compute a weighted average of named scores.

    Args:
        scores: Dict mapping metric names to score values.
        weights: Optional dict mapping metric names to weights.
            If None, equal weights are used.

    Returns:
        Weighted average as a float.
    """
    if not scores:
        return 0.0

    if weights is None:
        weights = {k: 1.0 / len(scores) for k in scores}

    total_weight = sum(weights.get(k, 0.0) for k in scores)
    if total_weight == 0.0:
        return 0.0

    weighted_sum = sum(scores[k] * weights.get(k, 0.0) for k in scores)
    return weighted_sum / total_weight
