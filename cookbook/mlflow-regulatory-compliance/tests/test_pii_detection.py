"""Tests for PII detection metric."""

from mlflow.metrics import MetricValue

from mlflow_regulatory_compliance.metrics.pii_detection import (
    _detect_pii_in_text,
    pii_detection_eval_fn,
    pii_detection_metric,
)
from mlflow_regulatory_compliance.utils.patterns import luhn_check


class TestLuhnCheck:
    """Tests for Luhn algorithm validation."""

    def test_valid_visa(self):
        assert luhn_check("4111111111111111") is True

    def test_valid_mastercard(self):
        assert luhn_check("5500000000000004") is True

    def test_valid_amex(self):
        assert luhn_check("378282246310005") is True

    def test_invalid_number(self):
        assert luhn_check("1234567890123456") is False

    def test_too_short(self):
        assert luhn_check("123456") is False

    def test_non_numeric(self):
        assert luhn_check("abcdefghijklmnop") is False


class TestPIIDetection:
    """Tests for PII detection in individual texts."""

    def test_email_detection(self):
        result = _detect_pii_in_text("Contact john.doe@example.com for details.")
        assert result["pii_detected"] is True
        assert "email" in result["pii_categories"]
        assert result["pii_count"] >= 1

    def test_multiple_emails(self):
        text = "Email alice@test.com or bob@test.org for help."
        result = _detect_pii_in_text(text)
        assert result["pii_count"] >= 2

    def test_us_phone(self):
        result = _detect_pii_in_text("Call us at (555) 123-4567.")
        assert result["pii_detected"] is True
        assert "phone" in result["pii_categories"]

    def test_uk_phone(self):
        result = _detect_pii_in_text("Ring +44 20 7946 0958 for support.")
        assert result["pii_detected"] is True
        assert "phone" in result["pii_categories"]

    def test_international_phone(self):
        result = _detect_pii_in_text("Call +1-555-123-4567 now.")
        assert result["pii_detected"] is True

    def test_ssn_detection(self):
        result = _detect_pii_in_text("SSN: 123-45-6789")
        assert result["pii_detected"] is True
        assert "ssn_nin" in result["pii_categories"]

    def test_ssn_invalid_area(self):
        # 000 area is invalid
        result = _detect_pii_in_text("Number: 000-45-6789")
        assert "ssn_nin" not in result.get("pii_categories", [])

    def test_ssn_666_area(self):
        # 666 area is invalid
        result = _detect_pii_in_text("ID: 666-45-6789")
        assert "ssn_nin" not in result.get("pii_categories", [])

    def test_nin_detection(self):
        result = _detect_pii_in_text("NI number: AB 12 34 56 C")
        assert result["pii_detected"] is True
        assert "ssn_nin" in result["pii_categories"]

    def test_credit_card_valid(self):
        # 4111111111111111 passes Luhn
        result = _detect_pii_in_text("Card: 4111-1111-1111-1111")
        assert result["pii_detected"] is True
        assert "credit_card" in result["pii_categories"]

    def test_credit_card_invalid_luhn(self):
        # Random number that fails Luhn
        result = _detect_pii_in_text("Card: 1234-5678-9012-3456")
        assert "credit_card" not in result.get("pii_categories", [])

    def test_address_detection(self):
        result = _detect_pii_in_text("Lives at 123 Main Street, Springfield.")
        assert result["pii_detected"] is True
        assert "address" in result["pii_categories"]

    def test_address_avenue(self):
        result = _detect_pii_in_text("Office at 456 Oak Avenue")
        assert "address" in result["pii_categories"]

    def test_name_in_context(self):
        result = _detect_pii_in_text("patient John Smith was admitted.")
        assert result["pii_detected"] is True
        assert "name_in_context" in result["pii_categories"]

    def test_name_in_context_applicant(self):
        result = _detect_pii_in_text("applicant Jane Doe submitted the form.")
        assert "name_in_context" in result["pii_categories"]

    def test_dob_detection(self):
        result = _detect_pii_in_text("Date of birth: 01/15/1990")
        assert result["pii_detected"] is True
        assert "date_of_birth" in result["pii_categories"]

    def test_dob_text_format(self):
        result = _detect_pii_in_text("born on January 15, 1990")
        assert "date_of_birth" in result["pii_categories"]

    def test_ip_address(self):
        result = _detect_pii_in_text("Connected from 192.168.1.100")
        assert result["pii_detected"] is True
        assert "ip_address" in result["pii_categories"]

    def test_ip_address_localhost_excluded(self):
        result = _detect_pii_in_text("Listening on 127.0.0.1")
        assert "ip_address" not in result.get("pii_categories", [])

    def test_passport_detection(self):
        result = _detect_pii_in_text("Passport number: AB1234567")
        assert result["pii_detected"] is True
        assert "passport" in result["pii_categories"]

    def test_driving_licence(self):
        result = _detect_pii_in_text("Driver's license number: DL12345678")
        assert result["pii_detected"] is True
        assert "driving_licence" in result["pii_categories"]

    def test_no_pii(self):
        result = _detect_pii_in_text("The weather today is sunny and warm.")
        assert result["pii_detected"] is False
        assert result["pii_count"] == 0
        assert result["pii_score"] == 0.0

    def test_multiple_categories(self):
        text = (
            "patient John Smith, email john@test.com, "
            "SSN 123-45-6789, born on March 5, 1985"
        )
        result = _detect_pii_in_text(text)
        assert result["pii_count"] >= 3
        assert len(result["pii_categories"]) >= 3
        assert result["pii_score"] > 0.5

    def test_empty_input(self):
        result = _detect_pii_in_text("")
        assert result["pii_detected"] is False
        assert result["pii_score"] == 0.0

    def test_none_input(self):
        result = _detect_pii_in_text(None)
        assert result["pii_detected"] is False

    def test_score_range(self):
        result = _detect_pii_in_text("Email: a@b.com, SSN: 123-45-6789")
        assert 0.0 <= result["pii_score"] <= 1.0

    def test_redaction_in_details(self):
        result = _detect_pii_in_text("Email: test@example.com")
        for detail in result["pii_details"]:
            assert "***" in detail["redacted"] or len(detail["redacted"]) > 0


class TestPIIEvalFn:
    """Tests for the MLflow eval_fn interface."""

    def test_batch_evaluation(self):
        predictions = [
            "Contact john@test.com for info.",
            "The weather is nice today.",
            "SSN: 123-45-6789",
        ]
        result = pii_detection_eval_fn(predictions)
        assert isinstance(result, MetricValue)
        assert len(result.scores) == 3
        assert result.scores[0] > 0  # has PII
        assert result.scores[1] == 0  # no PII
        assert result.scores[2] > 0  # has PII

    def test_aggregate_results(self):
        predictions = ["john@test.com", "hello world"]
        result = pii_detection_eval_fn(predictions)
        assert "mean" in result.aggregate_results
        assert "pii_detected_ratio" in result.aggregate_results
        assert result.aggregate_results["pii_detected_ratio"] == 0.5

    def test_empty_predictions(self):
        result = pii_detection_eval_fn([])
        assert result.scores == []

    def test_none_predictions(self):
        result = pii_detection_eval_fn([None, None])
        assert all(s == 0.0 for s in result.scores)

    def test_unicode_handling(self):
        result = pii_detection_eval_fn(["Sch\u00f6ne Gr\u00fc\u00dfe aus M\u00fcnchen"])
        assert isinstance(result, MetricValue)


class TestPIIMetricObject:
    """Tests for the make_metric() output object."""

    def test_metric_name(self):
        assert pii_detection_metric.name == "pii_detection_score"

    def test_greater_is_better(self):
        assert pii_detection_metric.greater_is_better is False
