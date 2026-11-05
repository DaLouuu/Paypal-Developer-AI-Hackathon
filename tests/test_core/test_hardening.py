"""Tests for Production Hardening: Mandate Caching and DLQ Error Recovery."""

import time

import pytest

from subguard.core.cache import CachedMandate, MandateCache
from subguard.core.dlq import ResilientWebhookDispatcher


def test_mandate_cache_hit_and_deduction():
    """Validates fast in-memory mandate caching and atomic spend deduction."""
    cache = MandateCache()
    token_hash = "token_hash_abc_123"
    now = int(time.time())

    mandate = CachedMandate(
        mandate_id="mnd_001",
        signer_principal_id="usr_001",
        remaining_allowance=100.0,
        max_single_limit=50.0,
        expires_at_timestamp=now + 3600,
        allowed_domains=["cursor.sh", "render.com"],
    )
    cache.set(token_hash, mandate)

    # 1. Cache Hit
    cached = cache.get(token_hash)
    assert cached is not None
    assert cached.mandate_id == "mnd_001"
    assert cached.remaining_allowance == 100.0

    # 2. Atomic Deduction
    assert cache.deduct(token_hash, 30.0) is True
    assert cache.get(token_hash).remaining_allowance == 70.0

    # 3. Deduction Exceeding Balance Fails
    assert cache.deduct(token_hash, 80.0) is False
    assert cache.get(token_hash).remaining_allowance == 70.0


def test_mandate_cache_expiration():
    """Expired cached mandates automatically return None."""
    cache = MandateCache()
    token_hash = "expired_token_hash"
    now = int(time.time())

    mandate = CachedMandate(
        mandate_id="mnd_expired",
        signer_principal_id="usr_002",
        remaining_allowance=50.0,
        max_single_limit=25.0,
        expires_at_timestamp=now - 10,  # Expired 10s ago
        allowed_domains=["render.com"],
    )
    cache.set(token_hash, mandate)
    assert cache.get(token_hash) is None


@pytest.mark.asyncio
async def test_webhook_dispatcher_dlq_on_failure():
    """Failed webhook calls retry with backoff and forward to Dead-Letter Queue."""
    dispatcher = ResilientWebhookDispatcher(max_retries=2, base_backoff_ms=10.0)

    # Unreachable URL forces failures
    payload = {"transaction_ref": "tx_failed_999", "event": "SUSPENDED"}
    success = await dispatcher.dispatch("http://invalid-dead-host.internal:9999/hook", payload)

    assert success is False
    assert len(dispatcher.dead_letter_queue) == 1
    dlq_record = dispatcher.dead_letter_queue[0]
    assert dlq_record.id == "tx_failed_999"
    assert dlq_record.failed_attempts == 2
