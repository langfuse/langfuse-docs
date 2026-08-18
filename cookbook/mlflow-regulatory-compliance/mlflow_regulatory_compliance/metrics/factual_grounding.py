"""Factual grounding metric for MLflow evaluation.

Measures how well model outputs are grounded in provided context,
designed for evaluating RAG (Retrieval Augmented Generation) systems.
Uses token overlap by default to avoid heavy ML dependencies.
"""

import re
from collections import Counter
from typing import Dict, List

from mlflow.metrics import MetricValue, make_metric

from mlflow_regulatory_compliance.utils.scoring import (
    standard_aggregations,
)

# Common stop words to exclude from token overlap calculations
_STOP_WORDS = frozenset({
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "don", "now", "and", "but", "or", "if", "while", "that", "this",
    "it", "its", "i", "me", "my", "we", "our", "you", "your", "he",
    "him", "his", "she", "her", "they", "them", "their", "what", "which",
    "who", "whom",
})


def _tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase words, removing punctuation."""
    return re.findall(r"\b[a-z0-9]+(?:'[a-z]+)?\b", text.lower())


def _extract_claims(text: str, method: str = "sentence") -> List[str]:
    """Extract factual claims from text.

    Args:
        text: The text to extract claims from.
        method: "sentence" splits by sentence boundaries,
                "noun_phrase" extracts noun phrase chunks.

    Returns:
        List of claim strings.
    """
    if not text or not isinstance(text, str):
        return []

    if method == "sentence":
        # Split on sentence boundaries
        sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        # Filter out very short fragments (< 4 words) that aren't real claims
        claims = [s.strip() for s in sentences if len(s.split()) >= 4]
        return claims if claims else [text.strip()] if text.strip() else []
    elif method == "noun_phrase":
        # Simple noun phrase extraction using POS-like heuristics
        # Extract phrases that look like factual statements
        phrases = re.findall(
            r"(?:[A-Z][a-z]+(?:\s+[a-z]+)*\s+(?:is|are|was|were|has|have|had)\s+[^.!?]+)",
            text,
        )
        return phrases if phrases else _extract_claims(text, method="sentence")
    else:
        return _extract_claims(text, method="sentence")


def _compute_token_overlap(claim: str, context: str) -> float:
    """Compute token overlap between a claim and context.

    Returns a score between 0.0 and 1.0 indicating how much of the
    claim's content tokens appear in the context.
    """
    claim_tokens = [t for t in _tokenize(claim) if t not in _STOP_WORDS]
    context_tokens = set(t for t in _tokenize(context) if t not in _STOP_WORDS)

    if not claim_tokens:
        return 1.0  # Empty claim is trivially grounded

    overlap = sum(1 for t in claim_tokens if t in context_tokens)
    return overlap / len(claim_tokens)


def _compute_ngram_overlap(claim: str, context: str, n: int = 3) -> float:
    """Compute n-gram overlap between claim and context for better phrase matching."""
    claim_tokens = [t for t in _tokenize(claim) if t not in _STOP_WORDS]
    context_tokens = [t for t in _tokenize(context) if t not in _STOP_WORDS]

    if len(claim_tokens) < n:
        return _compute_token_overlap(claim, context)

    claim_ngrams = Counter(
        tuple(claim_tokens[i : i + n]) for i in range(len(claim_tokens) - n + 1)
    )
    context_ngrams = set(
        tuple(context_tokens[i : i + n]) for i in range(len(context_tokens) - n + 1)
    )

    if not claim_ngrams:
        return 1.0

    matched = sum(1 for ng in claim_ngrams if ng in context_ngrams)
    return matched / len(claim_ngrams)


def _evaluate_grounding(
    prediction: str,
    context: str,
    claim_extraction_method: str = "sentence",
    similarity_threshold: float = 0.7,
) -> Dict:
    """Evaluate factual grounding of a prediction against context.

    Returns:
        Dict with keys: grounding_score, grounded_claims, ungrounded_claims,
        total_claims, grounding_details.
    """
    if not prediction or not isinstance(prediction, str):
        return {
            "grounding_score": 0.0,
            "grounded_claims": 0,
            "ungrounded_claims": 0,
            "total_claims": 0,
            "grounding_details": [],
        }

    if not context or not isinstance(context, str):
        claims = _extract_claims(prediction, method=claim_extraction_method)
        return {
            "grounding_score": 0.0,
            "grounded_claims": 0,
            "ungrounded_claims": len(claims),
            "total_claims": len(claims),
            "grounding_details": [
                {"claim": c, "grounded": False, "score": 0.0} for c in claims
            ],
        }

    claims = _extract_claims(prediction, method=claim_extraction_method)
    if not claims:
        return {
            "grounding_score": 1.0,
            "grounded_claims": 0,
            "ungrounded_claims": 0,
            "total_claims": 0,
            "grounding_details": [],
        }

    details = []
    grounded_count = 0

    for claim in claims:
        # Use combination of unigram and trigram overlap
        token_score = _compute_token_overlap(claim, context)
        ngram_score = _compute_ngram_overlap(claim, context, n=3)
        combined_score = 0.5 * token_score + 0.5 * ngram_score

        is_grounded = combined_score >= similarity_threshold
        if is_grounded:
            grounded_count += 1

        details.append({
            "claim": claim,
            "grounded": is_grounded,
            "score": round(combined_score, 4),
        })

    total = len(claims)
    grounding_score = grounded_count / total if total > 0 else 0.0

    return {
        "grounding_score": grounding_score,
        "grounded_claims": grounded_count,
        "ungrounded_claims": total - grounded_count,
        "total_claims": total,
        "grounding_details": details,
    }


def factual_grounding_eval_fn(predictions, targets=None, metrics=None, **kwargs):
    """Evaluate factual grounding across a batch of predictions.

    This metric requires a context column in the evaluation data. Pass
    the column name via evaluator_config:
        evaluator_config={"context_column": "source_documents"}

    Or provide context directly in kwargs if using a custom pipeline.

    Args:
        predictions: List or Series of model output strings.
        targets: Optional ground truth (unused for grounding).
        metrics: Previously computed metrics (unused).
        **kwargs: Must contain context data. Looks for keys:
            - context_column values from evaluator_config
            - "context" or "source_documents" columns from input data

    Returns:
        MetricValue with per-row grounding scores and aggregate results.
    """
    # Extract configuration
    context_col = kwargs.get("context_column", "context")
    claim_method = kwargs.get("claim_extraction_method", "sentence")
    threshold = kwargs.get("similarity_threshold", 0.7)

    # Try to get context from kwargs
    contexts = kwargs.get(context_col, kwargs.get("context", kwargs.get("source_documents")))

    scores = []
    for i, prediction in enumerate(predictions):
        text = str(prediction) if prediction is not None else ""

        # Get context for this row
        context = ""
        if contexts is not None:
            try:
                ctx = contexts.iloc[i] if hasattr(contexts, "iloc") else contexts[i]
                context = str(ctx) if ctx is not None else ""
            except (IndexError, KeyError):
                context = ""

        result = _evaluate_grounding(
            text, context,
            claim_extraction_method=claim_method,
            similarity_threshold=threshold,
        )
        scores.append(result["grounding_score"])

    return MetricValue(
        scores=scores,
        aggregate_results={
            **standard_aggregations(scores),
            "fully_grounded_ratio": (
                sum(1 for s in scores if s >= 1.0) / len(scores) if scores else 0.0
            ),
        },
    )


factual_grounding_metric = make_metric(
    eval_fn=factual_grounding_eval_fn,
    greater_is_better=True,
    name="factual_grounding_score",
    long_name="Factual Grounding Score",
    version="v1",
)
