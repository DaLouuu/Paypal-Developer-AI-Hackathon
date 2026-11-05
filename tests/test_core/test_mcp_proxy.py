"""Tests for SubGuard FastMCP Proxy Server and REST endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from subguard.mcp_proxy.server import create_app


@pytest.fixture
def app():
    return create_app(testing=True)


@pytest.mark.asyncio
async def test_intercept_subscription_checkout_approved(app):
    """Calling intercept_subscription_checkout within limits returns APPROVED with token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "jsonrpc": "2.0",
            "id": "req-1",
            "method": "tools/call",
            "params": {
                "name": "intercept_subscription_checkout",
                "arguments": {
                    "agent_id": "7719f911-3c22-48df-88ef-2211445588aa",
                    "merchant_id": "cursor.sh",
                    "product_name": "Pro Tier",
                    "billing_cadence": "monthly",
                    "amount": 20.0,
                    "currency": "USD",
                    "is_trial": False,
                },
            },
        }
        response = await client.post("/mcp", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        res = data["result"]
        assert res["decision"] == "APPROVED"
        assert res["transaction_ref"] is not None
        assert res["delegated_token"] is not None


@pytest.mark.asyncio
async def test_intercept_subscription_checkout_suspended(app):
    """Calling checkout exceeding threshold returns SUSPENDED_AWAITING_HUMAN and emits webhook."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "jsonrpc": "2.0",
            "id": "req-2",
            "method": "tools/call",
            "params": {
                "name": "intercept_subscription_checkout",
                "arguments": {
                    "agent_id": "7719f911-3c22-48df-88ef-2211445588aa",
                    "merchant_id": "render.com",
                    "product_name": "Enterprise Cluster",
                    "billing_cadence": "monthly",
                    "amount": 120.0,  # Exceeds $50 ceiling
                    "currency": "USD",
                    "is_trial": False,
                },
            },
        }
        response = await client.post("/mcp", json=payload)
        assert response.status_code == 200
        data = response.json()
        res = data["result"]
        assert res["decision"] == "SUSPENDED_AWAITING_HUMAN"
        assert res["approval_channel"] == "zapier_slack_interactive"
        assert res["rejection_reason"] is not None
        assert res["transaction_ref"] is not None


@pytest.mark.asyncio
async def test_intercept_subscription_checkout_rejected_policy(app):
    """Calling checkout for blacklisted merchant returns REJECTED_POLICY_VIOLATION."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "jsonrpc": "2.0",
            "id": "req-3",
            "method": "tools/call",
            "params": {
                "name": "intercept_subscription_checkout",
                "arguments": {
                    "agent_id": "7719f911-3c22-48df-88ef-2211445588aa",
                    "merchant_id": "malicious-saas.com",
                    "product_name": "Shady Subscription",
                    "billing_cadence": "monthly",
                    "amount": 10.0,
                    "currency": "USD",
                    "is_trial": False,
                },
            },
        }
        response = await client.post("/mcp", json=payload)
        assert response.status_code == 200
        data = response.json()
        res = data["result"]
        assert res["decision"] == "REJECTED_POLICY_VIOLATION"
        assert "blacklisted" in res["rejection_reason"].lower()


@pytest.mark.asyncio
async def test_schedule_cancellation_guard_tool(app):
    """Calling schedule_cancellation_guard registers an ARMED guard."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "jsonrpc": "2.0",
            "id": "req-4",
            "method": "tools/call",
            "params": {
                "name": "schedule_cancellation_guard",
                "arguments": {
                    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
                    "target_cancellation_timestamp": "2026-11-20T12:00:00Z",
                    "execution_method": "PAYPAL_MCP_API",
                    "require_pre_cancellation_prompt": True,
                },
            },
        }
        response = await client.post("/mcp", json=payload)
        assert response.status_code == 200
        data = response.json()
        res = data["result"]
        assert res["status"] == "ARMED"
        assert res["guard_id"] is not None
        assert res["scheduled_execution_time"] == "2026-11-20T12:00:00Z"


@pytest.mark.asyncio
async def test_resume_transaction_flow(app):
    """Suspended transaction can be resumed with user Ed25519 signature."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Suspend a transaction
        suspend_req = {
            "agent_id": "7719f911-3c22-48df-88ef-2211445588aa",
            "user_id": "9981a20e-8d5f-4a8b-9441-2c13a290d0b2",
            "amount": 90.0,
            "currency": "USD",
            "merchant_name": "render.com",
            "policy_violation_reason": "Single transaction exceeds autonomous threshold of $50.00",
        }
        res1 = await client.post("/v1/mandates/suspend", json=suspend_req)
        assert res1.status_code == 202
        suspend_data = res1.json()
        tx_ref = suspend_data["transaction_ref"]

        # 2. Resume transaction with approval
        resume_req = {
            "action": "APPROVE",
            "signed_mandate_signature": "mock_ed25519_valid_signature",
        }
        res2 = await client.post(f"/v1/mandates/{tx_ref}/resume", json=resume_req)
        assert res2.status_code == 200
        resume_data = res2.json()
        assert resume_data["transaction_ref"] == tx_ref
        assert resume_data["execution_status"] == "SUCCESSFUL_CHARGE"
        assert resume_data["paypal_payment_id"] is not None
