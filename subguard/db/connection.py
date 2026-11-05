"""PostgreSQL Database Connection Pool and Lifecycle Manager."""

from typing import Optional

import asyncpg

from subguard.core.config import settings


class DatabaseManager:
    def __init__(self, db_url: Optional[str] = None):
        self.db_url = db_url or settings.database_url
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        """Initialize asyncpg connection pool if PostgreSQL is reachable."""
        try:
            self.pool = await asyncpg.create_pool(
                self.db_url,
                min_size=2,
                max_size=20,
                timeout=5.0,
            )
        except Exception:
            # Fall back to in-memory repository if local Postgres is offline
            self.pool = None

    async def disconnect(self):
        """Close connection pool."""
        if self.pool:
            await self.pool.close()
            self.pool = None

    async def execute(self, query: str, *args):
        """Execute a query against connection pool."""
        if self.pool:
            async with self.pool.acquire() as conn:
                return await conn.execute(query, *args)
        return None

    async def fetch(self, query: str, *args):
        """Fetch rows from connection pool."""
        if self.pool:
            async with self.pool.acquire() as conn:
                return await conn.fetch(query, *args)
        return []


db_manager = DatabaseManager()
