"""
Automated E2E Integration Suite for SubGuard AI.
Mirrors tests/postman/SubGuard_Integration.json and executes all four core end-to-end flows:
1. POST /discovery/search (SaaS catalog discovery)
2. POST /v1/mandates/suspend (Over-limit interception)
3. POST /v1/webhooks/zapier/approval-callback (HITL Slack response)
4. POST /v1/mandates/{ref}/resume (Payment execution)
"""

import pytest
import uuid
import httpx
from subguard.mcp_proxy.server import create_app


@pytest.fixture
def app():
    return create_app(testing=True)


@pytest.mark.asyncio
async def test_e2e_full_system_flow(app):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Discovery Search
        discovery_payload = {
            "query": "SOC-2 vector database under $30/mo",
            "max_monthly_budget": 30.0,
            "required_features": ["vector"]
        }
        res_disc = await client.post("/discovery/search", json=discovery_payload)
        assert res_disc.status_code == 200, f"Discovery failed: {res_disc.text}"
        data_disc = res_disc.json()
        assert "matches" in data_disc
        assert len(data_disc["matches"]) > 0
        top_tool = data_disc["matches"][0]
        assert top_tool["estimated_monthly_cost"] <= 30.0
        assert top_tool["tos_risk_score"] < 0.30

        # Step 2: Intercept & Suspend Transaction
        suspend_payload = {
            "agent_id": str(uuid.uuid4()),
            "user_id": str(uuid.uuid4()),
            "amount": 75.0,
            "currency": "USD",
            "merchant_name": "datadoghq.com",
            "policy_violation_reason": "Single transaction exceeds autonomous limit of $50.00"
        }
        res_susp = await client.post("/v1/mandates/suspend", json=suspend_payload)
        assert res_susp.status_code == 202, f"Suspension failed: {res_susp.text}"
        data_susp = res_susp.json()
        tx_ref = data_susp["transaction_ref"]
        assert data_susp["status"] == "SUSPENDED_AWAITING_HUMAN"
        assert tx_ref is not None

        # Step 3: Out-of-band Zapier HITL Approval Callback
        zapier_payload = {
            "transaction_ref": tx_ref,
            "user_decision": "APPROVED",
            "channel": "slack_interactive_button"
        }
        res_zap = await client.post("/v1/webhooks/zapier/approval-callback", json=zapier_payload)
        assert res_zap.status_code == 200, f"Zapier callback failed: {res_zap.text}"
        data_zap = res_zap.json()
        assert data_zap["status"] == "processed"
        assert data_zap["transaction_ref"] == tx_ref

        # Step 4: Mandate Resume Execution
        resume_payload = {
            "action": "APPROVE",
            "signed_mandate_signature": "mock_ed25519_human_signature_proof"
        }
        res_res = await client.post(f"/v1/mandates/{tx_ref}/resume", json=resume_payload)
        assert res_res.status_code == 200, f"Resumption failed: {res_res.text}"
        data_res = res_res.json()
        assert data_res["execution_status"] == "SUCCESSFUL_CHARGE"
        assert "PAYPAL" in data_res["paypal_payment_id"]
        assert data_res["transaction_ref"] == tx_ref
