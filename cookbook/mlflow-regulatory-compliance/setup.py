"""Setup script for mlflow-regulatory-compliance."""

from setuptools import find_packages, setup

setup(
    name="mlflow-regulatory-compliance",
    version="0.1.0",
    packages=find_packages(include=["mlflow_regulatory_compliance*"]),
    entry_points={
        "mlflow.model_evaluator": [
            "regulatory-compliance=mlflow_regulatory_compliance.evaluators.compliance_evaluator:RegulatoryComplianceEvaluator",
        ],
    },
)
