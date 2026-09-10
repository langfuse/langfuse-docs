"""NIST AI RMF compliance report generator.

Generates structured compliance reports mapping evaluation results to
NIST AI RMF functions (GOVERN, MAP, MEASURE, MANAGE).
"""

from typing import Dict, List, Optional

import pandas as pd

from mlflow_regulatory_compliance.metrics.nist_composite import (
    DEFAULT_WEIGHTS,
    _compute_nist_composite,
)

# Threshold definitions for status determination
_DEFAULT_THRESHOLDS = {
    "pass": 0.7,
    "warn": 0.4,
}

# Remediation recommendation templates
_RECOMMENDATIONS = {
    "GOVERN": {
        "PASS": "Governance controls are operational. Continue monitoring all compliance dimensions.",
        "WARN": "Some governance evaluators may need attention. Review evaluator coverage.",
        "FAIL": "Governance framework needs strengthening. Ensure all compliance evaluators are active and configured.",
    },
    "MAP": {
        "PASS": "Model outputs are well-grounded in provided context. Hallucination risk is low.",
        "WARN": "Some model outputs contain ungrounded claims. Review RAG pipeline retrieval quality and context relevance.",
        "FAIL": "Significant hallucination risk detected. Model outputs are poorly grounded. Improve retrieval pipeline, add source attribution, and consider guardrails.",
    },
    "MEASURE": {
        "PASS": "PII protection and fairness metrics are within acceptable ranges.",
        "WARN": "Minor PII exposure or bias patterns detected. Review flagged outputs and refine model prompts or post-processing.",
        "FAIL": "Significant PII exposure or bias detected. Implement PII scrubbing in post-processing. Review training data for bias. Consider fairness constraints.",
    },
    "MANAGE": {
        "PASS": "No privileged legal content detected in model outputs. Privilege protection controls are effective.",
        "WARN": "Potential privilege indicators found. Review flagged outputs with legal counsel before deployment.",
        "FAIL": "Model outputs contain likely privileged content. Halt deployment for legal review. Implement content filtering for privileged communications.",
    },
}


class NISTComplianceReport:
    """Generates NIST AI RMF-aligned compliance reports from evaluation results.

    Args:
        pass_threshold: Minimum score for PASS status. Default 0.7.
        warn_threshold: Minimum score for WARN status (below this is FAIL).
            Default 0.4.
        weights: Custom weights for composite score calculation.
    """

    def __init__(
        self,
        pass_threshold: float = 0.7,
        warn_threshold: float = 0.4,
        weights: Optional[Dict[str, float]] = None,
    ):
        self.pass_threshold = pass_threshold
        self.warn_threshold = warn_threshold
        self.weights = weights or DEFAULT_WEIGHTS.copy()

    def generate_from_texts(
        self,
        predictions: List[str],
        contexts: Optional[List[str]] = None,
        bias_sensitivity: str = "medium",
    ) -> pd.DataFrame:
        """Generate a compliance report from raw text predictions.

        Args:
            predictions: List of model output strings.
            contexts: Optional list of source context strings (for grounding).
            bias_sensitivity: Sensitivity for bias detection.

        Returns:
            DataFrame with NIST compliance report.
        """
        if contexts is None:
            contexts = [""] * len(predictions)

        # Compute NIST results for each prediction
        all_results = []
        for pred, ctx in zip(predictions, contexts):
            text = str(pred) if pred is not None else ""
            context = str(ctx) if ctx is not None else ""
            result = _compute_nist_composite(
                text, context,
                weights=self.weights,
                nist_threshold=self.pass_threshold,
                bias_sensitivity=bias_sensitivity,
            )
            all_results.append(result)

        # Aggregate function scores across all predictions
        function_scores = {"GOVERN": [], "MAP": [], "MEASURE": [], "MANAGE": []}
        for result in all_results:
            for func, score in result["nist_function_scores"].items():
                function_scores[func].append(score)

        avg_scores = {
            func: sum(scores) / len(scores) if scores else 0.0
            for func, scores in function_scores.items()
        }

        return self._build_report(avg_scores, all_results)

    def generate_from_scores(
        self,
        pii_score: float,
        privilege_score: float,
        grounding_score: float,
        bias_score: float,
    ) -> pd.DataFrame:
        """Generate a compliance report from pre-computed metric scores.

        All scores should be compliance-oriented (higher = better, 0-1 range).
        For PII, privilege, and bias: pass (1 - raw_score) since raw scores
        are "lower is better".

        Args:
            pii_score: PII compliance score (1 - pii_detection_score).
            privilege_score: Privilege compliance score (1 - privilege_score).
            grounding_score: Factual grounding score (already higher = better).
            bias_score: Bias compliance score (1 - bias_detection_score).

        Returns:
            DataFrame with NIST compliance report.
        """
        function_scores = {
            "GOVERN": 1.0,  # All evaluators running
            "MAP": grounding_score,
            "MEASURE": (pii_score + bias_score) / 2.0,
            "MANAGE": privilege_score,
        }
        return self._build_report(function_scores)

    def _build_report(
        self,
        function_scores: Dict[str, float],
        all_results: Optional[List[Dict]] = None,
    ) -> pd.DataFrame:
        """Build the NIST compliance report DataFrame."""
        rows = []

        metric_names = {
            "GOVERN": "Governance Readiness",
            "MAP": "Factual Grounding",
            "MEASURE": "PII + Bias Detection",
            "MANAGE": "Legal Privilege Protection",
        }

        for func in ["GOVERN", "MAP", "MEASURE", "MANAGE"]:
            score = function_scores.get(func, 0.0)
            status = self._determine_status(score)
            recommendation = _RECOMMENDATIONS[func][status]

            evidence = self._gather_evidence(func, all_results)

            rows.append({
                "nist_function": func,
                "metric_name": metric_names[func],
                "score": round(score, 4),
                "status": status,
                "recommendation": recommendation,
                "evidence": evidence,
            })

        return pd.DataFrame(rows)

    def _determine_status(self, score: float) -> str:
        """Determine PASS/WARN/FAIL status from a score."""
        if score >= self.pass_threshold:
            return "PASS"
        elif score >= self.warn_threshold:
            return "WARN"
        else:
            return "FAIL"

    def _gather_evidence(
        self, function: str, all_results: Optional[List[Dict]]
    ) -> str:
        """Gather supporting evidence for a NIST function assessment."""
        if not all_results:
            return "Score-based assessment (no detailed evidence available)"

        n = len(all_results)

        if function == "GOVERN":
            return f"All 4 compliance evaluators executed across {n} samples"

        elif function == "MAP":
            grounded = sum(
                r["nist_details"]["grounding"]["grounded_claims"]
                for r in all_results
            )
            total = sum(
                r["nist_details"]["grounding"]["total_claims"]
                for r in all_results
            )
            return f"{grounded}/{total} claims grounded across {n} samples"

        elif function == "MEASURE":
            pii_count = sum(
                r["nist_details"]["pii"]["pii_count"] for r in all_results
            )
            bias_count = sum(
                len(r["nist_details"]["bias"]["bias_details"])
                for r in all_results
            )
            return (
                f"{pii_count} PII instances and {bias_count} bias indicators "
                f"detected across {n} samples"
            )

        elif function == "MANAGE":
            priv_count = sum(
                len(r["nist_details"]["privilege"]["privilege_details"])
                for r in all_results
            )
            return (
                f"{priv_count} privilege indicators detected across {n} samples"
            )

        return ""

    def to_dict(self, report_df: pd.DataFrame) -> Dict:
        """Convert a report DataFrame to a dict suitable for mlflow.log_dict().

        Args:
            report_df: DataFrame generated by generate_from_texts or
                generate_from_scores.

        Returns:
            Dict with report data, suitable for JSON serialization.
        """
        return {
            "nist_ai_rmf_compliance_report": report_df.to_dict(orient="records"),
            "summary": {
                "overall_status": (
                    "PASS"
                    if all(
                        row["status"] == "PASS"
                        for row in report_df.to_dict(orient="records")
                    )
                    else "FAIL"
                ),
                "functions_passing": sum(
                    1
                    for row in report_df.to_dict(orient="records")
                    if row["status"] == "PASS"
                ),
                "functions_total": len(report_df),
            },
        }
