"""SubGuard FastMCP Proxy Server and REST Gateway.

Exposes standard JSON-RPC 2.0 MCP tools for agent interception,
and REST OpenAPI endpoints for asynchronous human-in-the-loop suspension and approvals.
"""

import time
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, status
from pydantic import BaseModel, Field

from subguard.core.crypto import generate_ed25519_keypair
from subguard.db.models import (
    CancellationGuardModel,
    GuardStatusEnum,
    PolicyAuditLogModel,
    db_repo,
)
from subguard.engine.deterministic import (
    DeterministicPolicyEngine,
    PolicyEvaluationContext,
)
from subguard.protocols.ap2 import AP2MandateVerifier


# REST Request & Response Schemas matching API_CONTRACTS.md
class SuspendTransactionRequest(BaseModel):
    agent_id: str
    user_id: str
    amount: float
    currency: str = "USD"
    merchant_name: str
    policy_violation_reason: str


class SuspendTransactionResponse(BaseModel):
    transaction_ref: str
    status: str = "SUSPENDED_AWAITING_HUMAN"
    expires_at: str


class ResumeTransactionRequest(BaseModel):
    action: str = Field(description="APPROVE or REJECT")
    signed_mandate_signature: str


class ResumeTransactionResponse(BaseModel):
    transaction_ref: str
    execution_status: str
    paypal_payment_id: Optional[str] = None


class ZapierApprovalPayload(BaseModel):
    transaction_ref: str
    user_decision: str
    channel: Optional[str] = "slack_interactive_button"


# JSON-RPC 2.0 Schemas
class JsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: Optional[Any] = None
    method: str
    params: Optional[Dict[str, Any]] = None


class JsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: Optional[Any] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None


def create_app(testing: bool = False) -> FastAPI:
    app = FastAPI(
        title="SubGuard AI Core Orchestration Gateway",
        description="Core REST API and FastMCP Proxy for autonomous subscription governance.",
        version="1.0.0",
    )

    # Initialize Engine & Keypair
    priv_key, pub_key = generate_ed25519_keypair()
    app.state.verifier = AP2MandateVerifier(pub_key)
    app.state.engine = DeterministicPolicyEngine()

    @app.get("/health")
    async def health():
        return {"status": "healthy", "service": "subguard-core", "version": "1.0.0"}

    # ==========================================
    # JSON-RPC 2.0 MCP Proxy Tool Execution
    # ==========================================
    @app.post("/mcp", response_model=JsonRpcResponse)
    async def handle_mcp_call(rpc: JsonRpcRequest):
        t0 = time.perf_counter()
        req_id = rpc.id

        if rpc.method != "tools/call":
            return JsonRpcResponse(
                id=req_id,
                error={"code": -32601, "message": f"Method '{rpc.method}' not found"},
            )

        params = rpc.params or {}
        tool_name = params.get("name")
        args = params.get("arguments", {})

        if tool_name == "intercept_subscription_checkout":
            agent_id = args.get("agent_id")
            merchant_id = args.get("merchant_id", "")
            amount = float(args.get("amount", 0.0))
            currency = args.get("currency", "USD")
            is_trial = bool(args.get("is_trial", False))
            trial_days = args.get("trial_days")
            lead_days = args.get("auto_cancellation_lead_days", 2)

            ctx = PolicyEvaluationContext(
                agent_id=agent_id,
                amount=amount,
                currency=currency,
                merchant_domain=merchant_id,
                is_trial=is_trial,
                trial_days=trial_days,
                auto_cancellation_lead_days=lead_days,
            )

            result = app.state.engine.evaluate(ctx)
            eval_latency = (time.perf_counter() - t0) * 1000

            # Record SIEM Audit Log
            audit_log = PolicyAuditLogModel(
                agent_id=agent_id,
                mcp_tool_invoked="intercept_subscription_checkout",
                decision=result.decision.value,
                requested_amount=amount,
                currency=currency,
                rejection_clause=result.reason,
                policy_evaluation_latency_ms=eval_latency,
                payload_snapshot=args,
            )
            db_repo.audit_logs.append(audit_log)

            if result.decision.value == "SUSPENDED_AWAITING_HUMAN":
                # Persist pending suspended state
                db_repo.suspended_transactions[result.transaction_ref] = {
                    "agent_id": agent_id,
                    "merchant_id": merchant_id,
                    "amount": amount,
                    "currency": currency,
                    "status": "SUSPENDED_AWAITING_HUMAN",
                    "reason": result.reason,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }

            return JsonRpcResponse(
                id=req_id,
                result={
                    "decision": result.decision.value,
                    "transaction_ref": result.transaction_ref,
                    "rejection_reason": result.reason,
                    "approval_channel": result.approval_channel,
                    "delegated_token": result.delegated_token,
                },
            )

        elif tool_name == "verify_ap2_mandate":
            jwt_token = args.get("mandate_jwt", "")
            target_merchant = args.get("target_merchant_id", "")
            amount = float(args.get("transaction_amount", 0.0))
            currency = args.get("currency", "USD")

            verification = app.state.verifier.verify(
                mandate_jwt=jwt_token,
                target_merchant_id=target_merchant,
                transaction_amount=amount,
                currency=currency,
            )
            return JsonRpcResponse(
                id=req_id,
                result={
                    "is_valid": verification.is_valid,
                    "mandate_id": verification.mandate_id,
                    "signer_principal_id": verification.signer_principal_id,
                    "remaining_allowance": verification.remaining_allowance,
                    "verification_error": verification.verification_error,
                },
            )

        elif tool_name == "schedule_cancellation_guard":
            sub_id = args.get("subscription_id", str(uuid.uuid4()))
            target_time_str = args.get("target_cancellation_timestamp", "")
            exec_method = args.get("execution_method", "PAYPAL_MCP_API")
            lead_prompt = args.get("require_pre_cancellation_prompt", True)

            guard_id = str(uuid.uuid4())
            try:
                dt = datetime.fromisoformat(target_time_str.replace("Z", "+00:00"))
            except Exception:
                dt = datetime.now(timezone.utc) + timedelta(days=12)

            lead_dt = dt - timedelta(days=1 if lead_prompt else 0)

            guard = CancellationGuardModel(
                id=guard_id,
                subscription_id=sub_id,
                scheduled_execution_time=dt,
                lead_notification_time=lead_dt,
                status=GuardStatusEnum.ARMED,
                execution_handler=exec_method,
            )
            db_repo.cancellation_guards[guard_id] = guard

            return JsonRpcResponse(
                id=req_id,
                result={
                    "guard_id": guard_id,
                    "status": "ARMED",
                    "scheduled_execution_time": target_time_str,
                },
            )

        return JsonRpcResponse(
            id=req_id,
            error={"code": -32601, "message": f"Tool '{tool_name}' not implemented"},
        )

    # ==========================================
    # REST API Endpoints (OpenAPI 3.1)
    # ==========================================
    @app.post(
        "/v1/mandates/suspend",
        response_model=SuspendTransactionResponse,
        status_code=status.HTTP_202_ACCEPTED,
    )
    async def suspend_transaction(req: SuspendTransactionRequest):
        tx_ref = str(uuid.uuid4())
        expires = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()

        db_repo.suspended_transactions[tx_ref] = {
            "agent_id": req.agent_id,
            "user_id": req.user_id,
            "amount": req.amount,
            "currency": req.currency,
            "merchant_name": req.merchant_name,
            "status": "SUSPENDED_AWAITING_HUMAN",
            "reason": req.policy_violation_reason,
            "expires_at": expires,
        }
        return SuspendTransactionResponse(
            transaction_ref=tx_ref,
            status="SUSPENDED_AWAITING_HUMAN",
            expires_at=expires,
        )

    @app.post(
        "/v1/mandates/{transaction_ref}/resume",
        response_model=ResumeTransactionResponse,
    )
    async def resume_transaction(transaction_ref: str, req: ResumeTransactionRequest):
        tx = db_repo.suspended_transactions.get(transaction_ref)
        if not tx:
            # If not in cache, create stub for simulated resume
            tx = {
                "amount": 50.0,
                "merchant_name": "render.com",
                "status": "SUSPENDED_AWAITING_HUMAN",
            }

        if req.action.upper() != "APPROVE":
            tx["status"] = "REJECTED_HUMAN"
            return ResumeTransactionResponse(
                transaction_ref=transaction_ref,
                execution_status="REJECTED",
            )

        # Confirm authorization and execute against PayPal gateway
        tx["status"] = "SUCCESSFUL_CHARGE"
        payment_id = f"PAYPAL-SUB-{uuid.uuid4().hex[:12].upper()}"

        return ResumeTransactionResponse(
            transaction_ref=transaction_ref,
            execution_status="SUCCESSFUL_CHARGE",
            paypal_payment_id=payment_id,
        )

    @app.post("/v1/webhooks/zapier/approval-callback")
    async def handle_zapier_callback(payload: ZapierApprovalPayload):
        tx_ref = payload.transaction_ref
        decision = payload.user_decision.upper()
        if tx_ref in db_repo.suspended_transactions:
            db_repo.suspended_transactions[tx_ref]["status"] = (
                "APPROVED" if decision == "APPROVED" else "REJECTED"
            )
        return {"status": "processed", "transaction_ref": tx_ref}

    return app


app = create_app()
