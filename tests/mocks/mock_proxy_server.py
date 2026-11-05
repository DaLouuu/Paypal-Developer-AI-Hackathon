"""
Mock Proxy Server for Track Beta development.
Implements the exact JSON responses defined in workflow/contracts/API_CONTRACTS.md
allowing Track Beta to build and test discovery, frontend, and Zapier callbacks
without blocking on Track Alpha's backend.
"""

from typing import Any, Dict, List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

mock_app = FastAPI(
    title="SubGuard Mock Core Orchestration Gateway",
    version="1.0.0"
)

# In-memory mock store
MOCK_SUSPENDED_TRANSACTIONS: Dict[str, Dict[str, Any]] = {}
MOCK_SUBSCRIPTIONS: List[Dict[str, Any]] = [
    {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "merchant_name": "Notion",
        "merchant_domain": "notion.so",
        "product_name": "Notion Team Plus",
        "product_tier": "Team Plus",
        "active_seats": 8,
        "recurring_amount": 80.00,
        "currency": "USD",
        "billing_cycle": "MONTHLY",
        "status": "ACTIVE_RECURRING",
        "is_trial": False,
        "trial_end_date": None,
        "next_billing_date": (datetime.now(timezone.utc) + timedelta(days=12)).isoformat(),
        "tos_risk_score": 0.12
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "merchant_name": "Cursor",
        "merchant_domain": "cursor.sh",
        "product_name": "Cursor Pro",
        "product_tier": "Pro",
        "active_seats": 4,
        "recurring_amount": 80.00,
        "currency": "USD",
        "billing_cycle": "MONTHLY",
        "status": "TRIAL_ACTIVE",
        "is_trial": True,
        "trial_end_date": (datetime.now(timezone.utc) + timedelta(days=4)).isoformat(),
        "next_billing_date": (datetime.now(timezone.utc) + timedelta(days=4)).isoformat(),
        "tos_risk_score": 0.82
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "merchant_name": "DataDog",
        "merchant_domain": "datadoghq.com",
        "product_name": "DataDog APM",
        "product_tier": "Pro Infra",
        "active_seats": 2,
        "recurring_amount": 75.00,
        "currency": "USD",
        "billing_cycle": "MONTHLY",
        "status": "SUSPENDED_AWAITING_HUMAN",
        "is_trial": False,
        "trial_end_date": None,
        "next_billing_date": (datetime.now(timezone.utc) + timedelta(days=20)).isoformat(),
        "tos_risk_score": 0.45
    }
]


class InterceptCheckoutRequest(BaseModel):
    agent_id: str
    merchant_id: str
    product_name: str
    billing_cadence: str
    amount: float
    currency: str = "USD"
    is_trial: bool = False
    trial_days: Optional[int] = None
    auto_cancellation_lead_days: int = 2
    ap2_intent_mandate: Optional[str] = None


class InterceptCheckoutResponse(BaseModel):
    decision: str
    transaction_ref: str
    rejection_reason: Optional[str] = None
    approval_channel: Optional[str] = None
    delegated_token: Optional[str] = None


class SuspendTransactionRequest(BaseModel):
    agent_id: str
    user_id: str
    amount: float
    currency: str = "USD"
    merchant_name: str
    policy_violation_reason: str


class SuspendTransactionResponse(BaseModel):
    transaction_ref: str
    status: str
    expires_at: str


class ResumeTransactionRequest(BaseModel):
    action: str
    signed_mandate_signature: str


class ResumeTransactionResponse(BaseModel):
    transaction_ref: str
    execution_status: str
    paypal_payment_id: Optional[str] = None


@mock_app.post("/mcp/tools/intercept_subscription_checkout", response_model=InterceptCheckoutResponse)
def mock_intercept_subscription_checkout(req: InterceptCheckoutRequest):
    tx_ref = str(uuid.uuid4())
    if req.amount > 50.0:
        return InterceptCheckoutResponse(
            decision="SUSPENDED_AWAITING_HUMAN",
            transaction_ref=tx_ref,
            approval_channel="zapier_slack_interactive",
            rejection_reason=f"Single transaction amount (${req.amount:.2f}) exceeds autonomous limit ($50.00)"
        )
    return InterceptCheckoutResponse(
        decision="APPROVED",
        transaction_ref=tx_ref,
        delegated_token=f"skyfire_token_{uuid.uuid4().hex[:12]}"
    )


@mock_app.post("/v1/mandates/suspend", response_model=SuspendTransactionResponse, status_code=status.HTTP_202_ACCEPTED)
def mock_suspend_mandate(req: SuspendTransactionRequest):
    tx_ref = str(uuid.uuid4())
    expires = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    record = {
        "transaction_ref": tx_ref,
        "agent_id": req.agent_id,
        "user_id": req.user_id,
        "amount": req.amount,
        "currency": req.currency,
        "merchant_name": req.merchant_name,
        "policy_violation_reason": req.policy_violation_reason,
        "status": "SUSPENDED_AWAITING_HUMAN",
        "expires_at": expires
    }
    MOCK_SUSPENDED_TRANSACTIONS[tx_ref] = record
    return SuspendTransactionResponse(
        transaction_ref=tx_ref,
        status="SUSPENDED_AWAITING_HUMAN",
        expires_at=expires
    )


@mock_app.post("/v1/mandates/{transaction_ref}/resume", response_model=ResumeTransactionResponse)
def mock_resume_mandate(transaction_ref: str, req: ResumeTransactionRequest):
    if req.action == "APPROVE":
        if transaction_ref in MOCK_SUSPENDED_TRANSACTIONS:
            MOCK_SUSPENDED_TRANSACTIONS[transaction_ref]["status"] = "APPROVED"
        return ResumeTransactionResponse(
            transaction_ref=transaction_ref,
            execution_status="SUCCESSFUL_CHARGE",
            paypal_payment_id=f"PAYID-{uuid.uuid4().hex[:16].upper()}"
        )
    else:
        if transaction_ref in MOCK_SUSPENDED_TRANSACTIONS:
            MOCK_SUSPENDED_TRANSACTIONS[transaction_ref]["status"] = "REJECTED"
        return ResumeTransactionResponse(
            transaction_ref=transaction_ref,
            execution_status="REJECTED"
        )


@mock_app.get("/v1/subscriptions")
def mock_list_subscriptions():
    return {"subscriptions": MOCK_SUBSCRIPTIONS}
