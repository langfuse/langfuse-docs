"""Unified regulatory compliance evaluator for MLflow.

Combines all compliance metrics into a single evaluator that can be
used with mlflow.evaluate() via the extra_metrics parameter.
"""

from typing import Dict, List, Optional

from mlflow_regulatory_compliance.metrics.bias_detection import bias_detection_metric
from mlflow_regulatory_compliance.metrics.factual_grounding import (
    factual_grounding_metric,
)
from mlflow_regulatory_compliance.metrics.legal_privilege import legal_privilege_metric
from mlflow_regulatory_compliance.metrics.nist_composite import nist_composite_metric
from mlflow_regulatory_compliance.metrics.pii_detection import pii_detection_metric


class RegulatoryComplianceEvaluator:
    """Configurable regulatory compliance evaluator for MLflow.

    Produces a list of MLflow evaluation metrics based on which compliance
    dimensions are enabled. Use the `metrics` property to get the metric
    list for mlflow.evaluate(extra_metrics=...).

    Example::

        evaluator = RegulatoryComplianceEvaluator(
            pii_detection=True,
            legal_privilege=True,
            factual_grounding=True,
            bias_detection=True,
            nist_threshold=0.7,
        )
        results = mlflow.evaluate(
            data=eval_df,
            predictions="output",
            extra_metrics=evaluator.metrics,
        )

    Args:
        pii_detection: Enable PII detection metric. Default True.
        legal_privilege: Enable legal privilege detection metric. Default True.
        factual_grounding: Enable factual grounding metric. Default True.
        bias_detection: Enable bias detection metric. Default True.
        nist_threshold: Threshold for NIST composite pass/fail. Default 0.7.
        context_column: Column name containing source context for grounding.
            Default "context".
        bias_sensitivity: Sensitivity level for bias detection.
            One of "low", "medium", "high". Default "medium".
        bias_dimensions: List of bias dimensions to check.
            Default: all dimensions.
        custom_bias_terms: Additional bias terms keyed by dimension.
        nist_weights: Custom weights for NIST composite score.
    """

    def __init__(
        self,
        pii_detection: bool = True,
        legal_privilege: bool = True,
        factual_grounding: bool = True,
        bias_detection: bool = True,
        nist_threshold: float = 0.7,
        context_column: str = "context",
        bias_sensitivity: str = "medium",
        bias_dimensions: Optional[List[str]] = None,
        custom_bias_terms: Optional[Dict[str, List[str]]] = None,
        nist_weights: Optional[Dict[str, float]] = None,
    ):
        self.pii_detection = pii_detection
        self.legal_privilege = legal_privilege
        self.factual_grounding = factual_grounding
        self.bias_detection = bias_detection
        self.nist_threshold = nist_threshold
        self.context_column = context_column
        self.bias_sensitivity = bias_sensitivity
        self.bias_dimensions = bias_dimensions
        self.custom_bias_terms = custom_bias_terms
        self.nist_weights = nist_weights

    @property
    def metrics(self) -> List:
        """Return list of enabled MLflow evaluation metrics."""
        metric_list = []

        if self.pii_detection:
            metric_list.append(pii_detection_metric)
        if self.legal_privilege:
            metric_list.append(legal_privilege_metric)
        if self.factual_grounding:
            metric_list.append(factual_grounding_metric)
        if self.bias_detection:
            metric_list.append(bias_detection_metric)

        # Always include NIST composite if any individual metric is enabled
        if any([
            self.pii_detection,
            self.legal_privilege,
            self.factual_grounding,
            self.bias_detection,
        ]):
            metric_list.append(nist_composite_metric)

        return metric_list

    @property
    def evaluator_config(self) -> Dict:
        """Return evaluator configuration dict for mlflow.evaluate().

        Pass this as evaluator_config to mlflow.evaluate() to configure
        the compliance metrics.
        """
        config = {
            "context_column": self.context_column,
            "bias_sensitivity": self.bias_sensitivity,
            "nist_threshold": self.nist_threshold,
        }
        if self.bias_dimensions is not None:
            config["bias_dimensions"] = self.bias_dimensions
        if self.custom_bias_terms is not None:
            config["custom_bias_terms"] = self.custom_bias_terms
        if self.nist_weights is not None:
            config["nist_weights"] = self.nist_weights
        return config

    def get_enabled_metrics(self) -> List[str]:
        """Return names of enabled metrics."""
        names = []
        if self.pii_detection:
            names.append("pii_detection_score")
        if self.legal_privilege:
            names.append("legal_privilege_score")
        if self.factual_grounding:
            names.append("factual_grounding_score")
        if self.bias_detection:
            names.append("bias_detection_score")
        if names:
            names.append("nist_compliance_score")
        return names
