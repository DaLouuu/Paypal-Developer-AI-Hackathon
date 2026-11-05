"""Agent Payments Protocol (AP2) Cryptographic Mandate Specification and Verifier."""

import time
from typing import List, Optional

from cryptography.hazmat.primitives.asymmetric import ed25519
from pydantic import BaseModel

from subguard.core.crypto import (
    sign_json_payload,
    verify_jws_compact,
    verify_raw_signature,
)


class AP2AgentClaims(BaseModel):
    agent_id: str
    kya_trust_tier: str = "VERIFIED_BUSINESS_PURCHASER"
    delegation_depth: int = 1


class AP2Constraints(BaseModel):
    currency: str = "USD"
    max_cumulative_amount: float
    max_single_transaction_amount: float
    allowed_merchant_domains: List[str]
    enforce_auto_cancellation: bool = True
    auto_cancellation_buffer_hours: int = 48


class AP2MandateClaims(BaseModel):
    iss: str = "subguard.auth.render.internal"
    sub: str
    aud: str = "paypal.mcp.gateway"
    jti: str
    iat: int
    nbf: int
    exp: int
    mandate_type: str = "PAYMENT"
    agent_claims: AP2AgentClaims
    constraints: AP2Constraints


class AP2VerificationResult(BaseModel):
    is_valid: bool
    mandate_id: Optional[str] = None
    signer_principal_id: Optional[str] = None
    remaining_allowance: Optional[float] = None
    verification_error: Optional[str] = None


def create_signed_ap2_mandate(
    claims: AP2MandateClaims, private_key: ed25519.Ed25519PrivateKey
) -> str:
    """Signs AP2 mandate claims and returns compact serialized JWS string."""
    payload = claims.model_dump()
    return sign_json_payload(payload, private_key)


def verify_ed25519_signature(
    public_key: ed25519.Ed25519PublicKey, message: bytes, signature: bytes
) -> bool:
    """Verify raw Ed25519 digital signature."""
    return verify_raw_signature(public_key, message, signature)


class AP2MandateVerifier:
    def __init__(self, public_key: ed25519.Ed25519PublicKey):
        self.public_key = public_key

    def verify(
        self,
        mandate_jwt: str,
        target_merchant_id: str,
        transaction_amount: float,
        currency: str,
        consumed_prior_amount: float = 0.0,
    ) -> AP2VerificationResult:
        """Verify cryptographic signature and semantic constraints of an AP2 mandate token."""
        is_sig_valid, payload, err = verify_jws_compact(mandate_jwt, self.public_key)
        if not is_sig_valid:
            return AP2VerificationResult(
                is_valid=False,
                verification_error=err,
            )

        try:
            claims = AP2MandateClaims(**payload)
        except Exception as e:
            return AP2VerificationResult(
                is_valid=False,
                verification_error=f"Malformed AP2 mandate claims: {str(e)}",
            )

        now = int(time.time())

        # Check Expiration
        if now > claims.exp:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=f"Mandate has expired (exp: {claims.exp}, now: {now})",
            )

        # Check Not Before
        if now < claims.nbf:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=f"Mandate is not yet valid (nbf: {claims.nbf}, now: {now})",
            )

        # Check Delegation Depth (Must be <= 1)
        if claims.agent_claims.delegation_depth > 1:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=(
                    f"Delegation depth {claims.agent_claims.delegation_depth} exceeds "
                    "maximum allowed delegation depth of 1"
                ),
            )

        # Check Currency
        if claims.constraints.currency.upper() != currency.upper():
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=(
                    f"Currency mismatch: mandate specifies {claims.constraints.currency}, "
                    f"requested {currency}"
                ),
            )

        # Check Merchant Allowlist
        if target_merchant_id not in claims.constraints.allowed_merchant_domains:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=(
                    f"Merchant '{target_merchant_id}' is not permitted under allowed merchant domains: "
                    f"{claims.constraints.allowed_merchant_domains}"
                ),
            )

        # Check Single Transaction Amount Limit
        if transaction_amount > claims.constraints.max_single_transaction_amount:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=(
                    f"Transaction amount ${transaction_amount:.2f} exceeds mandate single transaction limit "
                    f"${claims.constraints.max_single_transaction_amount:.2f}"
                ),
            )

        # Check Cumulative Balance
        projected_spend = consumed_prior_amount + transaction_amount
        if projected_spend > claims.constraints.max_cumulative_amount:
            return AP2VerificationResult(
                is_valid=False,
                mandate_id=claims.jti,
                signer_principal_id=claims.sub,
                verification_error=(
                    f"Cumulative spend ${projected_spend:.2f} exceeds mandate maximum capacity "
                    f"${claims.constraints.max_cumulative_amount:.2f}"
                ),
            )

        remaining = claims.constraints.max_cumulative_amount - projected_spend

        return AP2VerificationResult(
            is_valid=True,
            mandate_id=claims.jti,
            signer_principal_id=claims.sub,
            remaining_allowance=remaining,
        )
