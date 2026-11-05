"""
Tests for Zapier Webhook Dispatcher and Callback Handler.
Validates serialization of suspension notifications, payload validation,
asynchronous callback processing, and error handling.
"""

import pytest
import uuid
from subguard.integrations.zapier import (
    ZapierRelayClient,
    ZapierSuspensionMessage,
    ZapierCallbackPayload,
    ZapierCallbackResult
)


@pytest.fixture
def zapier_relay():
    return ZapierRelayClient(webhook_url="https://hooks.zapier.com/hooks/catch/12345/mock/")


def test_serialize_suspension_dispatch_payload(zapier_relay):
    """
    Assert valid JSON serialization of the suspension dispatch payload
    matching the schema in workflow/contracts/API_CONTRACTS.md.
    """
    tx_ref = str(uuid.uuid4())
    agent_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    message = ZapierSuspensionMessage(
        transaction_ref=tx_ref,
        agent_id=agent_id,
        user_id=user_id,
        merchant_name="DataDog APM",
        amount=75.00,
        currency="USD",
        violation_reason="Single transaction exceeds autonomous limit of $50.00",
        slack_channel="#procurement-approvals",
        callback_endpoint="https://subguard-core.onrender.com/v1/webhooks/zapier/approval-callback"
    )

    payload_dict = message.to_webhook_dict()

    assert payload_dict["event_type"] == "MANDATE_SUSPENSION_TRIGGERED"
    assert payload_dict["transaction_ref"] == tx_ref
    assert payload_dict["amount"] == 75.00
    assert payload_dict["currency"] == "USD"
    assert payload_dict["merchant_name"] == "DataDog APM"
    assert "Slack" in payload_dict["violation_reason"] or "50.00" in payload_dict["violation_reason"]


def test_process_valid_approval_callback(zapier_relay):
    """Assert successful parsing and state transition for APPROVED callback."""
    tx_ref = str(uuid.uuid4())
    raw_payload = {
        "transaction_ref": tx_ref,
        "user_decision": "APPROVED",
        "channel": "slack_interactive_button",
        "approver_id": "usr_founder_001",
        "signed_mandate_signature": "mock_ed25519_signature_hex_data_string"
    }

    result: ZapierCallbackResult = zapier_relay.process_incoming_callback(raw_payload)

    assert result.is_valid is True
    assert result.transaction_ref == tx_ref
    assert result.decision == "APPROVED"
    assert result.error_message is None


def test_process_valid_rejection_callback(zapier_relay):
    """Assert successful parsing and state transition for REJECTED callback."""
    tx_ref = str(uuid.uuid4())
    raw_payload = {
        "transaction_ref": tx_ref,
        "user_decision": "REJECTED",
        "channel": "slack_interactive_button"
    }

    result: ZapierCallbackResult = zapier_relay.process_incoming_callback(raw_payload)

    assert result.is_valid is True
    assert result.transaction_ref == tx_ref
    assert result.decision == "REJECTED"


def test_reject_malformed_callback_payload(zapier_relay):
    """Assert invalid payload without required fields raises or returns validation error."""
    invalid_payload = {
        "some_random_key": "some_value"
    }

    result: ZapierCallbackResult = zapier_relay.process_incoming_callback(invalid_payload)

    assert result.is_valid is False
    assert result.error_message is not None
