"""Shared regex patterns and keyword lists for compliance detection."""

import re


class PIIPatterns:
    """Regex patterns for detecting personally identifiable information."""

    EMAIL = re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
    )

    PHONE_US = re.compile(
        r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    )
    PHONE_UK = re.compile(
        r"\b(?:\+?44[-.\s]?)?(?:0?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4})\b"
    )
    PHONE_INTL = re.compile(
        r"\b\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b"
    )

    SSN = re.compile(
        r"\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b"
    )
    NIN = re.compile(
        r"\b[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b",
        re.IGNORECASE,
    )

    CREDIT_CARD = re.compile(
        r"\b(?:\d{4}[-\s]?){3}\d{4}\b"
    )

    ADDRESS = re.compile(
        r"\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,3}"
        r"(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|"
        r"Court|Ct|Place|Pl|Way|Circle|Cir|Terrace|Ter)\b",
        re.IGNORECASE,
    )

    NAME_IN_CONTEXT = re.compile(
        r"\b(?:patient|applicant|client|employee|defendant|plaintiff|"
        r"claimant|insured|beneficiary|policyholder|account holder|"
        r"customer|subscriber|member|resident)\s+"
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b"
    )

    DOB = re.compile(
        r"\b(?:date of birth|DOB|born on|birthday)[:\s]*"
        r"(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|"
        r"(?:January|February|March|April|May|June|July|August|September|"
        r"October|November|December)\s+\d{1,2},?\s+\d{4})\b",
        re.IGNORECASE,
    )

    IP_ADDRESS = re.compile(
        r"\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}"
        r"(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b"
    )

    PASSPORT = re.compile(
        r"\b(?:passport\s*(?:number|no|#)?[:\s]*)[A-Z0-9]{6,9}\b",
        re.IGNORECASE,
    )

    DRIVING_LICENCE = re.compile(
        r"\b(?:driver'?s?\s*licen[cs]e\s*(?:number|no|#)?[:\s]*)[A-Z0-9]{5,15}\b",
        re.IGNORECASE,
    )

    ALL_PATTERNS = {
        "email": EMAIL,
        "phone": None,  # handled separately due to multiple patterns
        "ssn_nin": None,  # handled separately
        "credit_card": CREDIT_CARD,
        "address": ADDRESS,
        "name_in_context": NAME_IN_CONTEXT,
        "date_of_birth": DOB,
        "ip_address": IP_ADDRESS,
        "passport": PASSPORT,
        "driving_licence": DRIVING_LICENCE,
    }

    @classmethod
    def get_phone_patterns(cls):
        return [cls.PHONE_US, cls.PHONE_UK, cls.PHONE_INTL]

    @classmethod
    def get_ssn_patterns(cls):
        return [cls.SSN, cls.NIN]


def luhn_check(number_str):
    """Validate a number string using the Luhn algorithm."""
    digits = [int(d) for d in number_str if d.isdigit()]
    if len(digits) < 13 or len(digits) > 19:
        return False
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 1:
            d = d * 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0


class PrivilegePatterns:
    """Keyword and pattern lists for legal privilege detection."""

    ATTORNEY_CLIENT_KEYWORDS = [
        "attorney-client privilege",
        "attorney client privilege",
        "legal advice",
        "privileged communication",
        "confidential legal",
        "legal counsel",
        "seeking legal advice",
        "in confidence to my attorney",
        "in confidence to my lawyer",
        "privileged and confidential",
        "legal opinion",
        "advice of counsel",
        "attorney work product",
        "solicitor-client privilege",
        "solicitor client privilege",
        "legal consultation",
        "instructed my solicitor",
        "instructed my lawyer",
        "between counsel and client",
        "for the purpose of legal advice",
    ]

    WORK_PRODUCT_KEYWORDS = [
        "work product",
        "prepared in anticipation of litigation",
        "litigation preparation",
        "trial preparation",
        "legal memorandum",
        "legal memo",
        "case strategy",
        "litigation strategy",
        "legal analysis for",
        "draft pleading",
        "legal research memo",
        "case assessment",
        "legal brief",
        "prepared by counsel",
        "attorney notes",
        "lawyer notes",
        "mental impressions",
        "legal theories",
    ]

    SETTLEMENT_KEYWORDS = [
        "settlement negotiation",
        "settlement discussion",
        "settlement offer",
        "without prejudice",
        "mediation communication",
        "mediation session",
        "settlement conference",
        "compromise negotiation",
        "settlement proposal",
        "mediation privilege",
        "settlement terms",
        "plea negotiation",
        "plea bargain discussion",
        "offer of compromise",
        "rule 408",
        "fed. r. evid. 408",
        "settlement amount",
        "proposed settlement",
    ]

    FALSE_POSITIVE_TERMS = [
        "attorney general",
        "district attorney",
        "power of attorney",
        "attorney at law",
        "attorney fees",
        "attorney's office",
        "state attorney",
        "public defender",
    ]


class BiasIndicators:
    """Curated lists of bias indicators organized by dimension."""

    GENDER_INDICATORS = {
        "high": [
            "hysterical", "bossy", "shrill", "nagging", "catfight",
            "man up", "boys will be boys", "like a girl", "feminazi",
            "mankind",
        ],
        "medium": [
            "emotional", "nurturing", "aggressive", "ambitious",
            "hormonal", "maternal instinct", "breadwinner",
            "career woman", "working mother", "male nurse",
            "female doctor", "lady boss", "girl boss",
        ],
        "low": [
            "chairman", "fireman", "policeman", "stewardess",
            "mailman", "manpower", "man-made", "craftsman",
            "freshman", "spokesman",
        ],
    }

    RACIAL_ETHNIC_INDICATORS = {
        "high": [
            "thug", "savage", "uncivilized", "primitive",
            "exotic", "articulate",  # when used as surprise about minorities
            "ghetto", "urban",  # when used as coded language
            "illegal alien", "anchor baby",
        ],
        "medium": [
            "ethnic food", "ethnic neighborhood", "inner city",
            "culturally deprived", "underprivileged",
            "model minority", "colorblind",
            "all lives matter", "reverse racism",
        ],
        "low": [
            "tribe", "spirit animal", "pow wow", "guru",
            "off the reservation", "Indian giver",
            "peanut gallery", "grandfathered in",
        ],
    }

    AGE_INDICATORS = {
        "high": [
            "senile", "decrepit", "over the hill", "geezer",
            "old fogey", "past their prime", "doddering",
        ],
        "medium": [
            "too old to learn", "set in their ways",
            "not tech-savvy", "digital immigrant",
            "young and naive", "immature", "inexperienced youth",
            "ok boomer", "millennial entitlement",
        ],
        "low": [
            "elderly", "senior moment", "aged",
            "young people these days", "back in my day",
        ],
    }

    DISABILITY_INDICATORS = {
        "high": [
            "retarded", "crippled", "handicapped", "lame",
            "dumb", "deaf to", "blind to", "suffers from",
            "wheelchair-bound", "confined to a wheelchair",
        ],
        "medium": [
            "special needs", "differently abled", "mentally ill",
            "crazy", "insane", "psycho", "bipolar",  # casual usage
            "OCD",  # casual usage
            "on the spectrum",  # casual diagnostic
        ],
        "low": [
            "normal people", "able-bodied",
            "high-functioning", "low-functioning",
            "falling on deaf ears", "turning a blind eye",
        ],
    }

    SOCIOECONOMIC_INDICATORS = {
        "high": [
            "white trash", "trailer trash", "welfare queen",
            "ghetto", "hood rat", "redneck",
        ],
        "medium": [
            "poor people are lazy", "bootstrap mentality",
            "uneducated masses", "low class", "classless",
            "nouveau riche", "blue collar mentality",
        ],
        "low": [
            "underprivileged", "disadvantaged",
            "at-risk youth", "inner city youth",
            "lower class", "upper class",
        ],
    }

    ALL_DIMENSIONS = {
        "gender": GENDER_INDICATORS,
        "racial_ethnic": RACIAL_ETHNIC_INDICATORS,
        "age": AGE_INDICATORS,
        "disability": DISABILITY_INDICATORS,
        "socioeconomic": SOCIOECONOMIC_INDICATORS,
    }
