# mlflow-regulatory-compliance

NIST AI RMF-aligned regulatory compliance evaluation metrics for [MLflow](https://mlflow.org/).

Evaluate ML and LLM models against governance and compliance criteria directly within your existing MLflow workflows. Designed for organisations in regulated industries — legal services, insurance, financial services, and healthcare — that need to assess models against regulatory frameworks like the NIST AI Risk Management Framework, ISO 42001, and the EU AI Act.

## Installation

```bash
pip install mlflow-regulatory-compliance
```

## Quick Start

```python
import mlflow
import pandas as pd
from mlflow_regulatory_compliance import (
    pii_detection_metric,
    legal_privilege_metric,
    factual_grounding_metric,
    bias_detection_metric,
    nist_composite_metric,
)

# Prepare evaluation data
eval_df = pd.DataFrame({
    "inputs": ["What is the claims process?", "Summarise the policy terms."],
    "predictions": [
        "To file a claim, submit form A-1 with your policy number.",
        "The policy covers property damage up to £500,000.",
    ],
    "context": [
        "Claims are filed using form A-1. Include your policy number.",
        "Coverage includes property damage with a limit of £500,000.",
    ],
})

# Run compliance evaluation
results = mlflow.evaluate(
    data=eval_df,
    predictions="predictions",
    extra_metrics=[
        pii_detection_metric,
        legal_privilege_metric,
        factual_grounding_metric,
        bias_detection_metric,
        nist_composite_metric,
    ],
)

print(f"NIST Compliance Score: {results.metrics['nist_compliance_score/v1/mean']:.2f}")
print(f"PII Score: {results.metrics['pii_detection_score/v1/mean']:.2f}")
```

## Metrics

### PII Detection

Detects 9 categories of personally identifiable information in model outputs:

| Category | Method |
|---|---|
| Email addresses | Regex pattern matching |
| Phone numbers | US, UK, and international format patterns |
| SSN / NIN | Pattern matching with area number validation |
| Credit card numbers | Pattern matching with Luhn algorithm validation |
| Physical addresses | Street address pattern matching |
| Names in context | Identifying context detection (e.g., "patient John Smith") |
| Dates of birth | Date patterns in identifying context |
| IP addresses | IPv4 pattern matching (excludes localhost/broadcast) |
| Passport / driving licence | Document number pattern matching |

**Returns:** `pii_detection_score` — float from 0.0 (no PII) to 1.0 (heavy PII presence). Lower is better.

```python
from mlflow_regulatory_compliance import pii_detection_metric

results = mlflow.evaluate(
    data=eval_df,
    predictions="predictions",
    extra_metrics=[pii_detection_metric],
)
```

### Legal Privilege Detection

Detects potentially privileged legal content across three categories:

- **Attorney-client privilege**: Communications between attorneys and clients seeking legal advice
- **Work product doctrine**: Materials prepared in anticipation of litigation
- **Settlement/mediation**: Confidential settlement negotiations and mediation communications

Includes false positive mitigation for terms like "attorney general" and "power of attorney".

**Returns:** `legal_privilege_score` — float from 0.0 (no privilege indicators) to 1.0 (clear privileged content). Lower is better.

### Factual Grounding

Measures how well model outputs are grounded in provided context (for RAG systems):

1. Extracts factual claims from model output via sentence segmentation
2. Checks each claim against provided context using token and n-gram overlap
3. Scores based on the proportion of grounded claims

**Returns:** `factual_grounding_score` — float from 0.0 (completely ungrounded) to 1.0 (fully grounded). Higher is better.

```python
from mlflow_regulatory_compliance import factual_grounding_metric

# Context column must be provided in the evaluation data
results = mlflow.evaluate(
    data=eval_df,
    predictions="predictions",
    extra_metrics=[factual_grounding_metric],
    evaluator_config={"context_column": "context"},
)
```

### Bias Detection

Detects demographic and stereotypical bias across five dimensions:

| Dimension | Examples |
|---|---|
| Gender | Gendered language, stereotypical role associations |
| Racial/ethnic | Stereotypical associations, coded language |
| Age | Ageist language, capability assumptions |
| Disability | Ableist language, condescending framing |
| Socioeconomic | Classist assumptions, stereotypes |

Configurable sensitivity levels (`low`, `medium`, `high`) control how aggressively patterns are flagged.

**Returns:** `bias_detection_score` — float from 0.0 (no bias) to 1.0 (severe bias). Lower is better.

```python
from mlflow_regulatory_compliance import bias_detection_metric

results = mlflow.evaluate(
    data=eval_df,
    predictions="predictions",
    extra_metrics=[bias_detection_metric],
    evaluator_config={"sensitivity": "high"},
)
```

### NIST AI RMF Composite Score

Combines all four metrics into a single compliance score aligned with the NIST AI Risk Management Framework:

| NIST Function | Metric | What It Measures |
|---|---|---|
| GOVERN | Meta-assessment | Whether all governance evaluators are active |
| MAP | Factual Grounding | Risk of hallucination and ungrounded claims |
| MEASURE | PII + Bias Detection | Compliance with data protection and fairness requirements |
| MANAGE | Legal Privilege | Runtime prevention of privileged information disclosure |

Default weights: PII (0.25), privilege (0.25), grounding (0.25), bias (0.25). Weights are configurable.

**Returns:** `nist_compliance_score` — float from 0.0 to 1.0. Higher is better.

## Compliance Evaluator

The `RegulatoryComplianceEvaluator` provides a convenient way to configure and run all metrics together:

```python
from mlflow_regulatory_compliance import RegulatoryComplianceEvaluator

evaluator = RegulatoryComplianceEvaluator(
    pii_detection=True,
    legal_privilege=True,
    factual_grounding=True,
    bias_detection=True,
    nist_threshold=0.7,
    context_column="source_documents",
    bias_sensitivity="medium",
)

results = mlflow.evaluate(
    data=eval_df,
    predictions="predictions",
    extra_metrics=evaluator.metrics,
    evaluator_config=evaluator.evaluator_config,
)
```

## NIST Compliance Report

Generate structured compliance reports mapping results to NIST AI RMF functions:

```python
from mlflow_regulatory_compliance import NISTComplianceReport

report_gen = NISTComplianceReport(pass_threshold=0.7, warn_threshold=0.4)

# From raw predictions
report = report_gen.generate_from_texts(
    predictions=["Model output text..."],
    contexts=["Source context..."],
)
print(report)
#   nist_function          metric_name  score status  recommendation  evidence
# 0        GOVERN  Governance Readiness   1.0   PASS  ...             ...
# 1           MAP    Factual Grounding   0.85   PASS  ...             ...
# 2       MEASURE  PII + Bias Detection  0.92   PASS  ...             ...
# 3        MANAGE  Legal Privilege Prot.  0.95   PASS  ...             ...

# Log to MLflow
import mlflow
mlflow.log_dict(report_gen.to_dict(report), "nist_compliance_report.json")
```

## Configuration Reference

| Parameter | Default | Description |
|---|---|---|
| `nist_threshold` | `0.7` | Minimum composite score for NIST pass |
| `nist_weights` | Equal (0.25 each) | Dict mapping metric names to weights |
| `context_column` | `"context"` | Column name for grounding context |
| `bias_sensitivity` | `"medium"` | Bias detection sensitivity: `low`, `medium`, `high` |
| `bias_dimensions` | All | List of dimensions to check |
| `custom_bias_terms` | None | Additional terms keyed by dimension |
| `similarity_threshold` | `0.7` | Minimum token overlap for grounded claims |
| `claim_extraction_method` | `"sentence"` | Method for extracting claims: `sentence` or `noun_phrase` |

## Use Cases

### Insurance Claims AI
Evaluate claims processing models for PII exposure (policyholder data), privilege leakage (legal assessments), and factual grounding (claims against policy terms).

### Legal Document Processing
Assess document review AI for privilege detection (attorney-client communications in discovery) and grounding (extracted facts vs. source documents). See *United States v. Heppner* (S.D.N.Y. 2026) on AI-generated content and privilege safeguards.

### Financial Services AI
Evaluate advisory models for PII compliance (client financial data), bias (fair lending requirements), and grounding (recommendations vs. market data).

### Healthcare AI
Assess clinical AI for PII protection (patient health information under HIPAA), bias (demographic fairness in treatment recommendations), and grounding (clinical outputs vs. evidence base).

## Extending with Custom Metrics

Add custom compliance metrics using MLflow's `make_metric` API:

```python
from mlflow.metrics import make_metric, MetricValue

def my_custom_eval_fn(predictions, targets=None, metrics=None, **kwargs):
    scores = []
    for prediction in predictions:
        # Your custom compliance logic here
        score = compute_my_score(str(prediction))
        scores.append(score)
    return MetricValue(scores=scores)

my_metric = make_metric(
    eval_fn=my_custom_eval_fn,
    greater_is_better=False,
    name="my_compliance_score",
)
```

## Compatibility

- MLflow >= 2.10
- Python >= 3.9
- No heavy ML dependencies — uses regex and pattern matching by default

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Write tests for new functionality
4. Ensure all tests pass (`pytest`)
5. Submit a pull request

## License

Apache License 2.0. See [LICENSE](LICENSE) for details.
