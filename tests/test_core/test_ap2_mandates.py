"""Tests for AP2 cryptographic mandate verification and Skyfire KYA delegation."""

import time

import pytest
from cryptography.hazmat.primitives.asymmetric import ed25519

from subguard.protocols.ap2 import (
    AP2AgentClaims,
    AP2Constraints,
    AP2MandateClaims,
    AP2MandateVerifier,
    create_signed_ap2_mandate,
    verify_ed25519_signature,
)


@pytest.fixture
def keypair():
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    return private_key, public_key


def test_ed25519_mandate_creation_and_verification(keypair):
    """Generates an AP2 JWT signed with Ed25519 and verifies its cryptographic integrity."""
    private_key, public_key = keypair
    now = int(time.time())

    claims = AP2MandateClaims(
        iss="subguard.auth.render.internal",
        sub="usr_9981a20e-8d5f-4a8b-9441-2c13a290d0b2",
        aud="paypal.mcp.gateway",
        jti="mnd_550e8400-e29b-41d4-a716-446655440000",
        iat=now,
        nbf=now - 10,
        exp=now + 3600,
        mandate_type="PAYMENT",
        agent_claims=AP2AgentClaims(
            agent_id="agt_7719f911-3c22-48df-88ef-2211445588aa",
            kya_trust_tier="VERIFIED_BUSINESS_PURCHASER",
            delegation_depth=1,
        ),
        constraints=AP2Constraints(
            currency="USD",
            max_cumulative_amount=120.0,
            max_single_transaction_amount=40.0,
            allowed_merchant_domains=["cursor.sh", "render.com", "postman.com"],
            enforce_auto_cancellation=True,
            auto_cancellation_buffer_hours=48,
        ),
    )

    token = create_signed_ap2_mandate(claims, private_key)
    verifier = AP2MandateVerifier(public_key)

    result = verifier.verify(
        mandate_jwt=token,
        target_merchant_id="cursor.sh",
        transaction_amount=30.0,
        currency="USD",
    )

    assert result.is_valid is True
    assert result.mandate_id == claims.jti
    assert result.signer_principal_id == claims.sub
    assert result.remaining_allowance == 90.0  # 120.0 - 30.0
    assert result.verification_error is None


def test_mandate_tampering_fails_verification(keypair):
    """Tampering with claims or payload invalidates the Ed25519 signature."""
    private_key, public_key = keypair
    now = int(time.time())

    claims = AP2MandateClaims(
        iss="subguard.auth.render.internal",
        sub="usr_12345",
        aud="paypal.mcp.gateway",
        jti="mnd_0001",
        iat=now,
        nbf=now - 5,
        exp=now + 1000,
        mandate_type="PAYMENT",
        agent_claims=AP2AgentClaims(
            agent_id="agt_0001",
            kya_trust_tier="VERIFIED_BUSINESS_PURCHASER",
            delegation_depth=1,
        ),
        constraints=AP2Constraints(
            currency="USD",
            max_cumulative_amount=100.0,
            max_single_transaction_amount=50.0,
            allowed_merchant_domains=["render.com"],
        ),
    )
    token = create_signed_ap2_mandate(claims, private_key)

    # Tamper with the token string
    parts = token.split(".")
    tampered_token = f"{parts[0]}.eyJob2d1cyI6ICJwb2d1cyJ9.{parts[2]}"

    verifier = AP2MandateVerifier(public_key)
    result = verifier.verify(
        mandate_jwt=tampered_token,
        target_merchant_id="render.com",
        transaction_amount=20.0,
        currency="USD",
    )
    assert result.is_valid is False
    assert "signature mismatch" in result.verification_error.lower() or "invalid" in result.verification_error.lower()


def test_mandate_expired_rejection(keypair):
    """Expired mandates are rejected."""
    private_key, public_key = keypair
    now = int(time.time())

    claims = AP2MandateClaims(
        iss="subguard.auth.render.internal",
        sub="usr_12345",
        aud="paypal.mcp.gateway",
        jti="mnd_0002",
        iat=now - 7200,
        nbf=now - 7200,
        exp=now - 3600,  # Expired 1 hour ago
        mandate_type="PAYMENT",
        agent_claims=AP2AgentClaims(
            agent_id="agt_0001",
            kya_trust_tier="VERIFIED_BUSINESS_PURCHASER",
            delegation_depth=1,
        ),
        constraints=AP2Constraints(
            currency="USD",
            max_cumulative_amount=100.0,
            max_single_transaction_amount=50.0,
            allowed_merchant_domains=["render.com"],
        ),
    )
    token = create_signed_ap2_mandate(claims, private_key)
    verifier = AP2MandateVerifier(public_key)

    result = verifier.verify(
        mandate_jwt=token,
        target_merchant_id="render.com",
        transaction_amount=10.0,
        currency="USD",
    )
    assert result.is_valid is False
    assert "expired" in result.verification_error.lower()


def test_mandate_unapproved_merchant_domain_rejection(keypair):
    """Mandates targeting a merchant not in allowed_merchant_domains fail verification."""
    private_key, public_key = keypair
    now = int(time.time())

    claims = AP2MandateClaims(
        iss="subguard.auth.render.internal",
        sub="usr_12345",
        aud="paypal.mcp.gateway",
        jti="mnd_0003",
        iat=now,
        nbf=now - 10,
        exp=now + 1000,
        mandate_type="PAYMENT",
        agent_claims=AP2AgentClaims(
            agent_id="agt_0001",
            kya_trust_tier="VERIFIED_BUSINESS_PURCHASER",
            delegation_depth=1,
        ),
        constraints=AP2Constraints(
            currency="USD",
            max_cumulative_amount=100.0,
            max_single_transaction_amount=50.0,
            allowed_merchant_domains=["render.com", "cursor.sh"],
        ),
    )
    token = create_signed_ap2_mandate(claims, private_key)
    verifier = AP2MandateVerifier(public_key)

    result = verifier.verify(
        mandate_jwt=token,
        target_merchant_id="unapproved-merchant.com",
        transaction_amount=10.0,
        currency="USD",
    )
    assert result.is_valid is False
    assert "merchant" in result.verification_error.lower()


def test_multi_agent_delegation_depth_check(keypair):
    """Delegation depth exceeding 1 is rejected by the verifier."""
    private_key, public_key = keypair
    now = int(time.time())

    claims = AP2MandateClaims(
        iss="subguard.auth.render.internal",
        sub="usr_12345",
        aud="paypal.mcp.gateway",
        jti="mnd_0004",
        iat=now,
        nbf=now - 10,
        exp=now + 1000,
        mandate_type="PAYMENT",
        agent_claims=AP2AgentClaims(
            agent_id="agt_worker_sub_sub",
            kya_trust_tier="VERIFIED_BUSINESS_PURCHASER",
            delegation_depth=2,  # Violates depth <= 1 rule
        ),
        constraints=AP2Constraints(
            currency="USD",
            max_cumulative_amount=100.0,
            max_single_transaction_amount=50.0,
            allowed_merchant_domains=["render.com"],
        ),
    )
    token = create_signed_ap2_mandate(claims, private_key)
    verifier = AP2MandateVerifier(public_key)

    result = verifier.verify(
        mandate_jwt=token,
        target_merchant_id="render.com",
        transaction_amount=10.0,
        currency="USD",
    )
    assert result.is_valid is False
    assert "delegation depth" in result.verification_error.lower()


def test_raw_ed25519_signature_verification(keypair):
    """Direct signature verification on arbitrary transaction refs."""
    private_key, public_key = keypair
    message = b"4a716c55-22a1-42e1-881c-9900aabbccdd"
    signature = private_key.sign(message)
    assert verify_ed25519_signature(public_key, message, signature) is True

    bad_signature = b"bad_sig_" * 8
    assert verify_ed25519_signature(public_key, message, bad_signature) is False
