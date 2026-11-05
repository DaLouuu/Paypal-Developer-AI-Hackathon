"""Resilient Webhook Dispatcher with Exponential Backoff and Dead-Letter Queue (DLQ)."""

import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import httpx
from pydantic import BaseModel, Field

logger = logging.getLogger("subguard.dlq")


class DeadLetterRecord(BaseModel):
    id: str
    target_url: str
    payload: Dict[str, Any]
    failed_attempts: int
    last_error: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ResilientWebhookDispatcher:
    def __init__(self, max_retries: int = 3, base_backoff_ms: float = 50.0):
        self.max_retries = max_retries
        self.base_backoff_ms = base_backoff_ms
        self.dead_letter_queue: List[DeadLetterRecord] = []

    async def dispatch(
        self,
        url: str,
        payload: Dict[str, Any],
        client: Optional[httpx.AsyncClient] = None,
    ) -> bool:
        """Dispatch webhook with exponential backoff; forward to DLQ upon exhaustion."""
        attempts = 0
        last_err = ""

        # Use ephemeral client if none provided
        own_client = client is None
        http = client or httpx.AsyncClient(timeout=3.0)

        try:
            while attempts < self.max_retries:
                attempts += 1
                try:
                    resp = await http.post(url, json=payload)
                    if resp.status_code in (200, 201, 202, 204):
                        return True
                    last_err = f"HTTP {resp.status_code}: {resp.text}"
                except Exception as ex:
                    last_err = str(ex)

                # Exponential backoff
                backoff_s = (self.base_backoff_ms * (2 ** (attempts - 1))) / 1000.0
                await asyncio.sleep(backoff_s)

            # Route to Dead Letter Queue
            dlq_item = DeadLetterRecord(
                id=payload.get("transaction_ref", "unknown"),
                target_url=url,
                payload=payload,
                failed_attempts=attempts,
                last_error=last_err,
            )
            self.dead_letter_queue.append(dlq_item)
            logger.warning(
                "Webhook dispatch failed after %d attempts. Forwarded to DLQ: %s",
                attempts,
                last_err,
            )
            return False
        finally:
            if own_client:
                await http.aclose()


webhook_dispatcher = ResilientWebhookDispatcher()
