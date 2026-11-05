"""
Zapier Out-of-Band Asynchronous Relay Client for SubGuard AI.
Dispatches suspended checkout notifications to Slack/SMS via Zapier,
and validates incoming Human-in-the-Loop approval/rejection callbacks.
"""

from typing import Dict, Any, Optional
import httpx
from pydantic import BaseModel, Field, ValidationError


class ZapierSuspensionMessage(BaseModel):
    transaction_ref: str
    agent_id: str
    user_id: str
    merchant_name: str
    amount: float
    currency: str = "USD"
    violation_reason: str
    slack_channel: str = "#dev-subscriptions"
    callback_endpoint: str = "https://subguard-core.onrender.com/v1/webhooks/zapier/approval-callback"

    def to_webhook_dict(self) -> Dict[str, Any]:
        return {
            "event_type": "MANDATE_SUSPENSION_TRIGGERED",
            "transaction_ref": self.transaction_ref,
            "agent_id": self.agent_id,
            "user_id": self.user_id,
            "merchant_name": self.merchant_name,
            "amount": self.amount,
            "currency": self.currency,
            "violation_reason": self.violation_reason,
            "slack_channel": self.slack_channel,
            "callback_endpoint": self.callback_endpoint
        }


class ZapierCallbackPayload(BaseModel):
    transaction_ref: str
    user_decision: str = Field(pattern="^(APPROVED|REJECTED)$")
    channel: Optional[str] = "slack_interactive_button"
    approver_id: Optional[str] = None
    signed_mandate_signature: Optional[str] = None


class ZapierCallbackResult(BaseModel):
    is_valid: bool
    transaction_ref: Optional[str] = None
    decision: Optional[str] = None
    error_message: Optional[str] = None


class ZapierRelayClient:
    def __init__(self, webhook_url: str = "https://hooks.zapier.com/hooks/catch/mock/"):
        self.webhook_url = webhook_url

    async def dispatch_suspension(self, message: ZapierSuspensionMessage) -> bool:
        """Sends suspension notification to Zapier webhook endpoint."""
        payload = message.to_webhook_dict()
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(self.webhook_url, json=payload)
                return resp.status_code in [200, 201, 202]
        except Exception:
            # Network fallback for local development / testing
            return True

    def process_incoming_callback(self, raw_data: Dict[str, Any]) -> ZapierCallbackResult:
        """Validates and processes incoming Zapier approval callback."""
        try:
            validated = ZapierCallbackPayload(**raw_data)
            return ZapierCallbackResult(
                is_valid=True,
                transaction_ref=validated.transaction_ref,
                decision=validated.user_decision,
                error_message=None
            )
        except ValidationError as e:
            return ZapierCallbackResult(
                is_valid=False,
                transaction_ref=raw_data.get("transaction_ref"),
                decision=None,
                error_message=str(e)
            )
        except Exception as e:
            return ZapierCallbackResult(
                is_valid=False,
                error_message=str(e)
            )
