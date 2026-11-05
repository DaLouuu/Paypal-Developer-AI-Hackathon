"""In-Memory and SQLite-backed Mandate Cache for High-Frequency Micro-Transactions.

Caches validated AP2 tokens to eliminate repeated cryptographic deserialization.
"""

import sqlite3
import threading
from datetime import datetime, timezone
from typing import Dict, Optional

from pydantic import BaseModel


class CachedMandate(BaseModel):
    mandate_id: str
    signer_principal_id: str
    remaining_allowance: float
    max_single_limit: float
    expires_at_timestamp: int
    allowed_domains: list[str]


class MandateCache:
    def __init__(self, use_sqlite: bool = False, db_path: str = ":memory:"):
        self._lock = threading.Lock()
        self._memory_cache: Dict[str, CachedMandate] = {}
        self.use_sqlite = use_sqlite
        self.db_path = db_path

        if self.use_sqlite:
            self._init_sqlite()

    def _init_sqlite(self):
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS mandate_cache (
                    jwt_hash TEXT PRIMARY KEY,
                    mandate_id TEXT NOT NULL,
                    signer_id TEXT NOT NULL,
                    remaining_allowance REAL NOT NULL,
                    expires_at INTEGER NOT NULL
                )
                """
            )
            conn.commit()
            conn.close()

    def get(self, token_hash: str) -> Optional[CachedMandate]:
        """Fetch cached mandate if not expired."""
        with self._lock:
            entry = self._memory_cache.get(token_hash)
            if not entry:
                return None

            now = int(datetime.now(timezone.utc).timestamp())
            if now > entry.expires_at_timestamp:
                del self._memory_cache[token_hash]
                return None

            return entry

    def set(self, token_hash: str, mandate: CachedMandate):
        """Store mandate in cache."""
        with self._lock:
            self._memory_cache[token_hash] = mandate

    def deduct(self, token_hash: str, amount: float) -> bool:
        """Atomically deduct spend from cached mandate."""
        with self._lock:
            entry = self._memory_cache.get(token_hash)
            if not entry:
                return False
            if entry.remaining_allowance < amount:
                return False
            entry.remaining_allowance -= amount
            return True

    def invalidate(self, token_hash: str):
        """Invalidate mandate entry."""
        with self._lock:
            self._memory_cache.pop(token_hash, None)

    def clear(self):
        """Clear all cached entries."""
        with self._lock:
            self._memory_cache.clear()


mandate_cache = MandateCache()
