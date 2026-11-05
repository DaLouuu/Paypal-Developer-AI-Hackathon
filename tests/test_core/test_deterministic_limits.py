"""Tests for SubGuard deterministic policy engine."""

import time

import pytest

from subguard.engine.deterministic import (
    DecisionEnum,
    DeterministicPolicyEngine,
    PolicyEvaluationContext,
)


@pytest.fixture
def engine():
    return DeterministicPolicyEngine(
        monthly_budget_ceiling=500.0,
        autonomous_single_limit=50.0,
        allowed_merchant_domains=["cursor.sh", "render.com", "postman.com", "github.com"],
        blocked_merchant_domains=["malicious-saas.com", "crypto-miner.io"],
        default_auto_cancellation_lead_days=2,
    )


def test_hard_monthly_spending_limit_rejection(engine):
    """Transactions that cause total monthly spend to exceed the budget ceiling are rejected."""
    ctx = PolicyEvaluationContext(
        amount=150.0,
        currency="USD",
        merchant_domain="cursor.sh",
        current_monthly_spend=400.0,  # 400 + 150 = 550 > 500
        is_trial=False,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.REJECTED_POLICY_VIOLATION
    assert "Monthly budget ceiling exceeded" in result.reason


def test_single_transaction_exceeds_autonomous_ceiling_suspension(engine):
    """Transactions exceeding autonomous threshold of $50 are suspended for human review."""
    ctx = PolicyEvaluationContext(
        amount=75.0,  # > 50.0 autonomous limit
        currency="USD",
        merchant_domain="render.com",
        current_monthly_spend=100.0,
        is_trial=False,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.SUSPENDED_AWAITING_HUMAN
    assert "Single transaction amount ($75.00) exceeds autonomous ceiling" in result.reason
    assert result.approval_channel == "zapier_slack_interactive"


def test_blacklisted_merchant_rejection(engine):
    """Transactions targeting blacklisted merchant domains are immediately rejected."""
    ctx = PolicyEvaluationContext(
        amount=10.0,
        currency="USD",
        merchant_domain="malicious-saas.com",
        current_monthly_spend=0.0,
        is_trial=False,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.REJECTED_POLICY_VIOLATION
    assert "Merchant domain is blacklisted" in result.reason


def test_unapproved_merchant_domain_suspension(engine):
    """Transactions targeting unfamiliar merchant domains outside the allowlist are suspended."""
    ctx = PolicyEvaluationContext(
        amount=20.0,
        currency="USD",
        merchant_domain="unknown-ai-startup.io",
        current_monthly_spend=0.0,
        is_trial=False,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.SUSPENDED_AWAITING_HUMAN
    assert "Merchant domain is not in approved allowlist" in result.reason


def test_approved_transaction_within_limits(engine):
    """Transactions within all bounds and targeting approved merchants are immediately approved."""
    ctx = PolicyEvaluationContext(
        amount=30.0,
        currency="USD",
        merchant_domain="cursor.sh",
        current_monthly_spend=100.0,
        is_trial=False,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.APPROVED
    assert result.delegated_token is not None


def test_trial_duration_and_cancellation_clamping(engine):
    """Trial subscriptions must calculate and clamp cancellation lead time correctly."""
    ctx = PolicyEvaluationContext(
        amount=0.0,
        currency="USD",
        merchant_domain="render.com",
        current_monthly_spend=50.0,
        is_trial=True,
        trial_days=14,
        auto_cancellation_lead_days=2,
    )
    result = engine.evaluate(ctx)
    assert result.decision == DecisionEnum.APPROVED
    assert result.calculated_cancellation_lead_days == 2
    assert result.effective_trial_coverage_days == 12  # 14 - 2 days


def test_deterministic_latency_slo(engine):
    """Deterministic evaluation must complete in < 5ms p95."""
    ctx = PolicyEvaluationContext(
        amount=25.0,
        currency="USD",
        merchant_domain="github.com",
        current_monthly_spend=50.0,
        is_trial=False,
    )
    latencies = []
    for _ in range(100):
        t0 = time.perf_counter()
        engine.evaluate(ctx)
        latencies.append((time.perf_counter() - t0) * 1000)

    p95 = sorted(latencies)[95]
    assert p95 < 5.0, f"p95 latency {p95:.3f}ms exceeded 5.0ms SLO"
