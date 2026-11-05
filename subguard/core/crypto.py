"""Cryptographic utilities for Ed25519 signing and verification (AP2 Standard)."""

import base64
import json
from typing import Tuple

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ed25519


def generate_ed25519_keypair() -> Tuple[ed25519.Ed25519PrivateKey, ed25519.Ed25519PublicKey]:
    """Generate a new Ed25519 private/public keypair."""
    priv = ed25519.Ed25519PrivateKey.generate()
    return priv, priv.public_key()


def public_key_to_pem(public_key: ed25519.Ed25519PublicKey) -> str:
    """Serialize an Ed25519 public key to PEM format."""
    return public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("utf-8")


def public_key_from_pem(pem_str: str) -> ed25519.Ed25519PublicKey:
    """Load an Ed25519 public key from PEM string."""
    loaded = serialization.load_pem_public_key(pem_str.encode("utf-8"))
    if not isinstance(loaded, ed25519.Ed25519PublicKey):
        raise ValueError("Key is not an Ed25519 public key")
    return loaded


def b64url_encode(data: bytes) -> str:
    """Base64 URL-safe encode without padding."""
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def b64url_decode(data_str: str) -> bytes:
    """Base64 URL-safe decode with padding restoration."""
    rem = len(data_str) % 4
    if rem > 0:
        data_str += "=" * (4 - rem)
    return base64.urlsafe_b64decode(data_str)


def sign_json_payload(payload: dict, private_key: ed25519.Ed25519PrivateKey) -> str:
    """Sign a JSON dict and return compact serialized JWS (header.payload.signature)."""
    header = {"alg": "EdDSA", "typ": "AP2-Mandate+JWT", "kid": "subguard-principal-key-2026-001"}
    header_bytes = json.dumps(header, separators=(",", ":")).encode("utf-8")
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")

    header_b64 = b64url_encode(header_bytes)
    payload_b64 = b64url_encode(payload_bytes)

    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    sig_bytes = private_key.sign(signing_input)
    sig_b64 = b64url_encode(sig_bytes)

    return f"{header_b64}.{payload_b64}.{sig_b64}"


def verify_jws_compact(jws_str: str, public_key: ed25519.Ed25519PublicKey) -> Tuple[bool, dict, str]:
    """Verify a compact JWS token with an Ed25519 public key."""
    parts = jws_str.split(".")
    if len(parts) != 3:
        return False, {}, "Malformed JWS token: expected 3 dot-separated parts"

    header_b64, payload_b64, sig_b64 = parts
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")

    try:
        sig_bytes = b64url_decode(sig_b64)
        payload_bytes = b64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))
    except Exception as e:
        return False, {}, f"Invalid token encoding or JSON payload: {str(e)}"

    try:
        public_key.verify(sig_bytes, signing_input)
        return True, payload, ""
    except InvalidSignature:
        return False, payload, "Cryptographic signature mismatch: Ed25519 verification failed"
    except Exception as e:
        return False, payload, f"Verification failed: {str(e)}"


def verify_raw_signature(public_key: ed25519.Ed25519PublicKey, message: bytes, signature: bytes) -> bool:
    """Verify raw message bytes against an Ed25519 signature."""
    try:
        public_key.verify(signature, message)
        return True
    except Exception:
        return False
