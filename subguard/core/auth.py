"""Authentication, Password Hashing, and Session Token Utilities for SubGuard."""

import hashlib
import hmac
import json
import secrets
import time
from typing import Optional, Tuple

from subguard.core.crypto import generate_ed25519_keypair, public_key_to_pem

AUTH_SECRET_KEY = "subguard-ap2-auth-secret-key-prod-2026"
TOKEN_VALIDITY_SECONDS = 7 * 24 * 3600  # 7 days


def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """Hash a password using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    if not salt:
        salt = secrets.token_hex(16)
    hashed_bytes = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    )
    return hashed_bytes.hex(), salt


def verify_password(password: str, hashed_password: str, salt: str) -> bool:
    """Verify password against stored hash."""
    test_hash, _ = hash_password(password, salt)
    return hmac.compare_digest(test_hash, hashed_password)


def create_token(payload: dict) -> str:
    """Generate a tamper-evident signed session token."""
    payload["exp"] = int(time.time()) + TOKEN_VALIDITY_SECONDS
    payload_json = json.dumps(payload, separators=(",", ":"))
    payload_hex = payload_json.encode("utf-8").hex()

    signature = hmac.new(
        AUTH_SECRET_KEY.encode("utf-8"),
        payload_hex.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    return f"{payload_hex}.{signature}"


def verify_token(token: str) -> Optional[dict]:
    """Verify session token signature and expiration."""
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_hex, sig = parts

        expected_sig = hmac.new(
            AUTH_SECRET_KEY.encode("utf-8"),
            payload_hex.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(sig, expected_sig):
            return None

        payload_bytes = bytes.fromhex(payload_hex)
        payload = json.loads(payload_bytes.decode("utf-8"))

        if payload.get("exp", 0) < time.time():
            return None

        return payload
    except Exception:
        return None


def generate_user_keys() -> Tuple[str, str]:
    """Generate Ed25519 keypair for user AP2 signing and return PEM strings."""
    priv, pub = generate_ed25519_keypair()
    pub_pem = public_key_to_pem(pub)
    from cryptography.hazmat.primitives import serialization
    priv_pem = priv.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode("utf-8")
    return pub_pem, priv_pem
