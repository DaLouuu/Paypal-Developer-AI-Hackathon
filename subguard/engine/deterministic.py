"""SubGuard Tier 1 Deterministic Policy Engine.

Evaluates pure mathematical, Boolean, and structural rules in < 5ms.
100% immune to prompt injection attacks embedded in merchant checkout flows.
"""

import uuid
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class DecisionEnum(str, Enum):
    APPROVED = "APPROVED"
    SUSPENDED_AWAITING_HUMAN = "SUSPENDED_AWAITING_HUMAN"
    REJECTED_POLICY_VIOLATION = "REJECTED_POLICY_VIOLATION"


class PolicyEvaluationContext(BaseModel):
    amount: float = Field(ge=0.0, description="Proposed charge amount")
    currency: str = Field(default="USD", min_length=3, max_length=3)
    merchant_domain: str = Field(description="Normalized vendor domain, e.g. 'cursor.sh'")
    current_monthly_spend: float = Field(default=0.0, ge=0.0)
    is_trial: bool = Field(default=False)
    trial_days: Optional[int] = Field(default=None, ge=1)
    auto_cancellation_lead_days: Optional[int] = Field(default=2, ge=1)
    agent_id: Optional[str] = Field(default=None)


class PolicyEvaluationResult(BaseModel):
    decision: DecisionEnum
    reason: Optional[str] = None
    approval_channel: Optional[str] = None
    delegated_token: Optional[str] = None
    transaction_ref: str = Field(default_factory=lambda: str(uuid.uuid4()))
    calculated_cancellation_lead_days: Optional[int] = None
    effective_trial_coverage_days: Optional[int] = None


class DeterministicPolicyEngine:
    def __init__(
        self,
        monthly_budget_ceiling: float = 500.0,
        autonomous_single_limit: float = 50.0,
        allowed_merchant_domains: Optional[List[str]] = None,
        blocked_merchant_domains: Optional[List[str]] = None,
        default_auto_cancellation_lead_days: int = 2,
    ):
        self.monthly_budget_ceiling = monthly_budget_ceiling
        self.autonomous_single_limit = autonomous_single_limit
        self.allowed_merchant_domains = set(
            allowed_merchant_domains or ["cursor.sh", "render.com", "postman.com", "github.com"]
        )
        self.blocked_merchant_domains = set(
            blocked_merchant_domains
            or ["malicious-saas.com", "crypto-miner.io", "dark-pattern-vendor.com"]
        )
        self.default_auto_cancellation_lead_days = default_auto_cancellation_lead_days

    def evaluate(self, ctx: PolicyEvaluationContext) -> PolicyEvaluationResult:
        """Run sub-5ms deterministic rule cascading."""
        ref = str(uuid.uuid4())

        # Rule 1: Check Blacklisted Merchants (Instant Drop)
        if ctx.merchant_domain in self.blocked_merchant_domains:
            return PolicyEvaluationResult(
                decision=DecisionEnum.REJECTED_POLICY_VIOLATION,
                reason=f"Merchant domain is blacklisted: {ctx.merchant_domain}",
                transaction_ref=ref,
            )

        # Rule 2: Hard Monthly Budget Ceiling Check
        projected_spend = ctx.current_monthly_spend + ctx.amount
        if projected_spend > self.monthly_budget_ceiling:
            return PolicyEvaluationResult(
                decision=DecisionEnum.REJECTED_POLICY_VIOLATION,
                reason=(
                    f"Monthly budget ceiling exceeded. Current spend: ${ctx.current_monthly_spend:.2f}, "
                    f"attempted: ${ctx.amount:.2f}, ceiling: ${self.monthly_budget_ceiling:.2f}"
                ),
                transaction_ref=ref,
            )

        # Rule 3: Single-Transaction Autonomous Limit Check
        if ctx.amount > self.autonomous_single_limit:
            return PolicyEvaluationResult(
                decision=DecisionEnum.SUSPENDED_AWAITING_HUMAN,
                reason=(
                    f"Single transaction amount (${ctx.amount:.2f}) exceeds autonomous ceiling "
                    f"(${self.autonomous_single_limit:.2f})"
                ),
                approval_channel="zapier_slack_interactive",
                transaction_ref=ref,
            )

        # Rule 4: Domain Allowlist Check
        if ctx.merchant_domain not in self.allowed_merchant_domains:
            return PolicyEvaluationResult(
                decision=DecisionEnum.SUSPENDED_AWAITING_HUMAN,
                reason=f"Merchant domain is not in approved allowlist: {ctx.merchant_domain}",
                approval_channel="zapier_slack_interactive",
                transaction_ref=ref,
            )

        # Rule 5: Trial Calculation & Cancellation Lead Clamping
        lead_days = ctx.auto_cancellation_lead_days or self.default_auto_cancellation_lead_days
        effective_coverage = None
        if ctx.is_trial and ctx.trial_days:
            effective_coverage = max(1, ctx.trial_days - lead_days)

        # All deterministic rules passed
        delegated_token = f"subguard_del_{uuid.uuid4().hex[:16]}"
        return PolicyEvaluationResult(
            decision=DecisionEnum.APPROVED,
            delegated_token=delegated_token,
            transaction_ref=ref,
            calculated_cancellation_lead_days=lead_days if ctx.is_trial else None,
            effective_trial_coverage_days=effective_coverage,
        )
