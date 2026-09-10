"""MLflow Regulatory Compliance Evaluation Plugin.

Provides NIST AI RMF-aligned evaluation metrics for MLflow model evaluation,
enabling organisations in regulated industries to assess ML/LLM models against
governance and compliance criteria.
"""

from mlflow_regulatory_compliance.evaluators.compliance_evaluator import (
    RegulatoryComplianceEvaluator,
)
from mlflow_regulatory_compliance.metrics.bias_detection import (
    bias_detection_eval_fn,
    bias_detection_metric,
)
from mlflow_regulatory_compliance.metrics.factual_grounding import (
    factual_grounding_eval_fn,
    factual_grounding_metric,
)
from mlflow_regulatory_compliance.metrics.legal_privilege import (
    legal_privilege_eval_fn,
    legal_privilege_metric,
)
from mlflow_regulatory_compliance.metrics.nist_composite import (
    nist_composite_eval_fn,
    nist_composite_metric,
)
from mlflow_regulatory_compliance.metrics.pii_detection import (
    pii_detection_eval_fn,
    pii_detection_metric,
)
from mlflow_regulatory_compliance.reporting.nist_report import (
    NISTComplianceReport,
)

__version__ = "0.1.0"

__all__ = [
    "pii_detection_metric",
    "pii_detection_eval_fn",
    "legal_privilege_metric",
    "legal_privilege_eval_fn",
    "factual_grounding_metric",
    "factual_grounding_eval_fn",
    "bias_detection_metric",
    "bias_detection_eval_fn",
    "nist_composite_metric",
    "nist_composite_eval_fn",
    "RegulatoryComplianceEvaluator",
    "NISTComplianceReport",
]
