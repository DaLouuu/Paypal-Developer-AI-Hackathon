"""PostgreSQL Relational Schema Models and In-Memory Data Store.

Adheres strictly to API_CONTRACTS.md SQL specifications.
"""

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# Database Enums
class MandateTypeEnum(str, Enum):
    INTENT = "INTENT"
    CART = "CART"
    PAYMENT = "PAYMENT"


class MandateStatusEnum(str, Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    EXHAUSTED = "EXHAUSTED"
    REVOKED = "REVOKED"
    EXPIRED = "EXPIRED"


class SubscriptionStatusEnum(str, Enum):
    TRIAL_ACTIVE = "TRIAL_ACTIVE"
    ACTIVE_RECURRING = "ACTIVE_RECURRING"
    PENDING_CANCELLATION = "PENDING_CANCELLATION"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"


class BillingIntervalEnum(str, Enum):
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    ANNUAL = "ANNUAL"
    USAGE_BASED = "USAGE_BASED"


class GuardStatusEnum(str, Enum):
    ARMED = "ARMED"
    NOTIFICATION_SENT = "NOTIFICATION_SENT"
    EXECUTED = "EXECUTED"
    CANCELLED_BY_USER = "CANCELLED_BY_USER"
    FAILED = "FAILED"


# Relational Models
class UserModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    organization_name: Optional[str] = None
    monthly_budget_ceiling: float = 500.00
    currency: str = "USD"
    public_signing_key: str
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class AgentIdentityModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    agent_name: str
    kya_token_hash: str
    max_single_transaction_limit: float = 50.00
    is_active: bool = True
    created_at: datetime = Field(default_factory=utc_now)


class AP2MandateModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    agent_id: str
    mandate_type: MandateTypeEnum = MandateTypeEnum.PAYMENT
    status: MandateStatusEnum = MandateStatusEnum.PENDING
    raw_jwt: str
    max_chargeable_amount: float
    consumed_amount: float = 0.00
    currency: str = "USD"
    allowed_merchant_patterns: List[str]
    expires_at: datetime
    created_at: datetime = Field(default_factory=utc_now)


class SubscriptionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    agent_id: Optional[str] = None
    active_mandate_id: Optional[str] = None
    merchant_name: str
    merchant_domain: str
    product_tier: str
    billing_cycle: BillingIntervalEnum = BillingIntervalEnum.MONTHLY
    recurring_amount: float
    currency: str = "USD"
    status: SubscriptionStatusEnum = SubscriptionStatusEnum.ACTIVE_RECURRING
    is_trial: bool = False
    trial_end_date: Optional[datetime] = None
    next_billing_date: datetime
    paypal_billing_agreement_id: Optional[str] = None
    external_vendor_id: Optional[str] = None
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class CancellationGuardModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subscription_id: str
    scheduled_execution_time: datetime
    lead_notification_time: datetime
    status: GuardStatusEnum = GuardStatusEnum.ARMED
    execution_handler: str = "PAYPAL_MCP_API"
    error_log: Optional[str] = None
    created_at: datetime = Field(default_factory=utc_now)


class PolicyAuditLogModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: Optional[str] = None
    user_id: Optional[str] = None
    mcp_tool_invoked: str
    decision: str
    requested_amount: Optional[float] = None
    currency: Optional[str] = "USD"
    rejection_clause: Optional[str] = None
    policy_evaluation_latency_ms: Optional[float] = None
    payload_snapshot: dict
    created_at: datetime = Field(default_factory=utc_now)


# Fast In-Memory State Repository for High Performance & Micro-Benchmarks
class InMemoryRepository:
    def __init__(self):
        self.users: Dict[str, UserModel] = {}
        self.agents: Dict[str, AgentIdentityModel] = {}
        self.mandates: Dict[str, AP2MandateModel] = {}
        self.subscriptions: Dict[str, SubscriptionModel] = {}
        self.cancellation_guards: Dict[str, CancellationGuardModel] = {}
        self.audit_logs: List[PolicyAuditLogModel] = []
        self.suspended_transactions: Dict[str, dict] = {}


db_repo = InMemoryRepository()
