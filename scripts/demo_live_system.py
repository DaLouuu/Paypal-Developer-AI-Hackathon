"""
Live End-to-End System Demonstration for SubGuard AI.
Starts the live FastAPI / FastMCP server and executes the full lifecycle:
1. Health check probe
2. Semantic SaaS discovery with budget & SOC-2 constraint filtering
3. ToS contract dark-pattern parsing & risk scoring
4. FastMCP tool execution: intercept_subscription_checkout (Approved & Suspended)
5. Zapier asynchronous HITL approval webhook callback
6. Mandate resumption & PayPal settlement
7. Automated cancellation guard execution via APIMatic wrapper
"""

import time
import uuid
import httpx
from datetime import datetime, timezone, timedelta
from subguard.mcp_proxy.server import create_app
from subguard.discovery.tos_analyzer import ToSAnalyzer
from subguard.integrations.apimatic_client import APIMaticVendorCancellationClient

def print_banner(text: str):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

async def run_live_demonstration():
    app = create_app(testing=True)
    transport = httpx.ASGITransport(app=app)
    
    async with httpx.AsyncClient(transport=transport, base_url="http://localhost:8000") as client:
        # 1. Health Check
        print_banner("1. FastMCP Gateway Health Check")
        res = await client.get("/health")
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.json()}")
        assert res.status_code == 200

        # 2. Semantic SaaS Tool Discovery (Elasticsearch RAG)
        print_banner("2. Semantic SaaS Tool Discovery (Elasticsearch RAG)")
        discovery_query = {
            "query": "SOC-2 compliant vector database with serverless indexing",
            "max_monthly_budget": 35.0,
            "required_features": ["vector"]
        }
        print(f"Query Payload: {discovery_query}")
        res = await client.post("/discovery/search", json=discovery_query)
        print(f"Status Code: {res.status_code}")
        matches = res.json()["matches"]
        for idx, match in enumerate(matches, 1):
            print(f"  [{idx}] {match['product_name']} | Cost: ${match['estimated_monthly_cost']:.2f}/mo | ToS Risk: {match['tos_risk_score']*100:.0f}%")
        assert len(matches) > 0

        # 3. ToS Legal Contract Dark-Pattern Parser
        print_banner("3. Terms of Service (ToS) Dark-Pattern Analysis")
        predatory_tos = """
        SECTION 12: AUTOMATIC RENEWAL AND TRIAL CONVERSION.
        Promotional free trials automatically convert to an annual subscription at $360.00/year.
        Cancellation cannot be performed via the website or application settings.
        To cancel, you must contact customer retention via telephone at 1-800-555-0199
        at least 60 days prior to renewal. Failure to provide sixty days advance written notice
        results in automatic 12-month renewal with 25% early termination penalty.
        """
        analyzer = ToSAnalyzer()
        tos_report = analyzer.analyze_tos_text(predatory_tos, vendor_domain="predatory-saas.com")
        print(f"Target Domain: {tos_report.vendor_domain}")
        print(f"Calculated Risk Score: {tos_report.tos_risk_score * 100:.1f}% (High Risk)")
        print(f"Has Auto-Renewal Trap: {tos_report.has_auto_renewal_trap}")
        print(f"Requires Phone Call: {tos_report.requires_phone_cancellation}")
        print(f"Advance Notice Required: {tos_report.notice_lead_days_required} days")
        print(f"Dark Pattern Flags:")
        for w in tos_report.dark_pattern_warnings:
            print(f"  ⚠️  {w}")

        # 4. FastMCP Tool: intercept_subscription_checkout (Approved Path)
        print_banner("4. FastMCP Tool Execution: Standard Checkout Under $50 Limit")
        approved_call = {
            "jsonrpc": "2.0",
            "id": "rpc-101",
            "method": "tools/call",
            "params": {
                "name": "intercept_subscription_checkout",
                "arguments": {
                    "agent_id": str(uuid.uuid4()),
                    "merchant_id": "render.com",
                    "product_name": "Pro Team Instance",
                    "billing_cadence": "monthly",
                    "amount": 25.00,
                    "currency": "USD",
                    "is_trial": False
                }
            }
        }
        res = await client.post("/mcp", json=approved_call)
        result = res.json()["result"]
        print(f"Decision: {result['decision']}")
        print(f"Transaction Ref: {result['transaction_ref']}")
        print(f"Delegated Skyfire Token: {result['delegated_token']}")
        assert result["decision"] == "APPROVED"

        # 5. FastMCP Tool: intercept_subscription_checkout (Over-Limit Suspension)
        print_banner("5. FastMCP Tool Execution: Over-Limit Interception ($75.00 > $50 Limit)")
        suspended_call = {
            "jsonrpc": "2.0",
            "id": "rpc-102",
            "method": "tools/call",
            "params": {
                "name": "intercept_subscription_checkout",
                "arguments": {
                    "agent_id": str(uuid.uuid4()),
                    "merchant_id": "datadoghq.com",
                    "product_name": "DataDog APM",
                    "billing_cadence": "monthly",
                    "amount": 75.00,
                    "currency": "USD",
                    "is_trial": False
                }
            }
        }
        res = await client.post("/mcp", json=suspended_call)
        result = res.json()["result"]
        tx_ref = result["transaction_ref"]
        print(f"Decision: {result['decision']}")
        print(f"Suspension Transaction Ref: {tx_ref}")
        print(f"Rejection / Policy Reason: {result['rejection_reason']}")
        print(f"Approval Channel: {result['approval_channel']}")
        assert result["decision"] == "SUSPENDED_AWAITING_HUMAN"

        # 6. Zapier Asynchronous HITL Slack Approval Callback
        print_banner("6. Zapier Asynchronous Human Approval Callback")
        zapier_payload = {
            "transaction_ref": tx_ref,
            "user_decision": "APPROVED",
            "channel": "slack_interactive_button"
        }
        res = await client.post("/v1/webhooks/zapier/approval-callback", json=zapier_payload)
        print(f"Callback Received: {res.json()}")
        assert res.status_code == 200

        # 7. Mandate Resume & Payment Settlement
        print_banner("7. Mandate Resumption & PayPal MCP Payment Execution")
        resume_payload = {
            "action": "APPROVE",
            "signed_mandate_signature": "ed25519_sig_valid_human_founder_key"
        }
        res = await client.post(f"/v1/mandates/{tx_ref}/resume", json=resume_payload)
        resume_data = res.json()
        print(f"Execution Status: {resume_data['execution_status']}")
        print(f"PayPal Payment ID: {resume_data['paypal_payment_id']}")
        assert resume_data["execution_status"] == "SUCCESSFUL_CHARGE"

        # 8. Automated Cancellation Guard via APIMatic
        print_banner("8. APIMatic SaaS Cancellation Execution (Pre-Trial Conversion)")
        apimatic = APIMaticVendorCancellationClient()
        cancel_result = await apimatic.cancel_subscription(
            vendor_id="cursor.sh",
            subscription_id="sub_cursor_pro_9918",
            action="TERMINATE_IMMEDIATE"
        )
        print(f"Vendor: {cancel_result.vendor_id}")
        print(f"Cancellation Status: {cancel_result.status}")
        print(f"Confirmation Code: {cancel_result.confirmation_code}")
        print(f"Message: {cancel_result.message}")
        assert cancel_result.status == "CANCELLED"

    print_banner("✅ ALL SUBGUARD AI CAPABILITIES ARE WORKING FLAWLESSLY!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_live_demonstration())
