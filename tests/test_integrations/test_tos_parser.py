"""
Tests for Terms of Service (ToS) Dark-Pattern Analyzer.
Validates extraction of auto-renewal traps, mandatory cancellation friction,
excessive notice periods, and risk score calculation.
"""

import pytest
from subguard.discovery.tos_analyzer import (
    ToSAnalyzer,
    ToSAnalysisResult
)


@pytest.fixture
def tos_analyzer():
    return ToSAnalyzer()


def test_flag_high_risk_auto_renewal_trap(tos_analyzer):
    """
    Assert sample contract text containing hidden renewal clauses,
    phone-only cancellation, and 60-day notice returns a tos_risk_score > 0.7.
    """
    predatory_contract = """
    TERMS OF SERVICE - SECTION 14: SUBSCRIPTIONS AND AUTOMATIC RENEWALS.
    Your promotional free trial will automatically convert to an annual subscription billed at $499.00/year
    unless cancelled at least sixty (60) days prior to the expiration of the trial period.
    Cancellation cannot be performed via the website or application settings.
    To cancel your subscription, you must contact our customer retention department via telephone at
    1-800-555-0199 between 9:00 AM and 11:00 AM EST on alternating Tuesdays.
    Failure to provide sixty days advance written notice shall constitute irrevocable authorization
    to charge your payment method for the subsequent 12-month renewal term.
    All subscription fees are non-refundable and subject to a 25% early termination penalty.
    """

    result: ToSAnalysisResult = tos_analyzer.analyze_tos_text(predatory_contract, vendor_domain="predatory-saas.com")

    assert result.tos_risk_score > 0.70
    assert result.has_auto_renewal_trap is True
    assert result.requires_phone_cancellation is True
    assert result.notice_lead_days_required >= 60
    assert len(result.dark_pattern_warnings) >= 2
    assert any("phone" in warning.lower() for warning in result.dark_pattern_warnings)
    assert any("60" in warning or "notice" in warning.lower() for warning in result.dark_pattern_warnings)


def test_flag_clean_transparent_contract(tos_analyzer):
    """
    Assert transparent, consumer-friendly contract with 1-click online cancellation
    and no hidden renewal trap returns a tos_risk_score < 0.3.
    """
    transparent_contract = """
    TERMS OF SERVICE - SECTION 8: CANCELLATION AND REFUNDS.
    You may cancel your monthly or annual subscription at any time directly through your account dashboard
    with a single click under 'Billing Settings'.
    If you cancel during a free trial, your card will never be charged.
    No advance notice is required. If cancelled, you will retain access until the end of your current period.
    Full refunds are provided upon request within 14 days of any billing event under our satisfaction guarantee.
    """

    result: ToSAnalysisResult = tos_analyzer.analyze_tos_text(transparent_contract, vendor_domain="transparent-tools.io")

    assert result.tos_risk_score < 0.30
    assert result.has_auto_renewal_trap is False
    assert result.requires_phone_cancellation is False
    assert result.notice_lead_days_required == 0
    assert len(result.dark_pattern_warnings) == 0


def test_moderate_risk_notice_period(tos_analyzer):
    """
    Assert standard B2B contract with 30-day notice requirement returns moderate risk (0.3 <= score <= 0.7).
    """
    moderate_contract = """
    SECTION 5: TERM AND TERMINATION.
    This agreement will automatically renew for successive 1-month periods.
    Either party may terminate by providing written notice thirty (30) days prior to renewal
    via email to billing@vendor.com or via the web portal.
    """
    result: ToSAnalysisResult = tos_analyzer.analyze_tos_text(moderate_contract, vendor_domain="standard-b2b.com")
    assert 0.30 <= result.tos_risk_score <= 0.70
    assert result.notice_lead_days_required == 30
