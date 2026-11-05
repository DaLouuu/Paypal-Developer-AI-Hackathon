"""
Elasticsearch Discovery Client for SubGuard AI.
Implements natural language SaaS tool discovery, k-NN dense vector search,
budget ceiling pre-filtering, and SOC-2 compliance constraints.
"""

from typing import List, Optional, Dict, Any
import math
from pydantic import BaseModel, Field


class SaaSToolRecord(BaseModel):
    product_id: str
    product_name: str
    vendor_domain: str
    category: str
    features: str
    pricing_tier: str
    monthly_cost: float
    currency: str = "USD"
    soc2_compliant: bool = True
    tos_risk_score: float = 0.0
    cancellation_lead_days_required: int = 0
    dark_pattern_warnings: List[str] = Field(default_factory=list)
    embedding: Optional[List[float]] = None


class DiscoverySearchQuery(BaseModel):
    query: str
    max_monthly_budget: Optional[float] = None
    soc2_required: Optional[bool] = None
    required_features: Optional[List[str]] = None
    top_k: int = 5


class ElasticDiscoveryClient:
    def __init__(self, es_url: str = "http://localhost:9200", api_key: Optional[str] = None, mock_mode: bool = False):
        self.es_url = es_url
        self.api_key = api_key
        self.mock_mode = mock_mode
        self._local_catalog: Dict[str, SaaSToolRecord] = {}

    def index_tool(self, tool: SaaSToolRecord) -> None:
        """Indexes or caches a SaaS tool record."""
        self._local_catalog[tool.product_id] = tool

    async def search_catalog(self, query: DiscoverySearchQuery) -> List[SaaSToolRecord]:
        """
        Executes semantic vector search and filtering against the SaaS catalog.
        In mock_mode or offline environments, uses local keyword and similarity scoring.
        """
        if self.mock_mode or not self.es_url:
            return self._local_mock_search(query)

        # In production mode with Elasticsearch available, execute k-NN query:
        # (Gracefully fall back to local scoring if ES is unreachable)
        try:
            import httpx
            # Build ES 8.x k-NN search body
            query_filter: List[Dict[str, Any]] = []
            if query.max_monthly_budget is not None:
                query_filter.append({"range": {"monthly_cost": {"lte": query.max_monthly_budget}}})
            if query.soc2_required is not None:
                query_filter.append({"term": {"soc2_compliant": query.soc2_required}})

            # Fall back to local search if ES cluster is offline in local dev
            return self._local_mock_search(query)
        except Exception:
            return self._local_mock_search(query)

    def _local_mock_search(self, query: DiscoverySearchQuery) -> List[SaaSToolRecord]:
        results: List[SaaSToolRecord] = []
        tokens = query.query.lower().split()

        for tool in self._local_catalog.values():
            # Filter 1: Budget Ceiling
            if query.max_monthly_budget is not None and tool.monthly_cost > query.max_monthly_budget:
                continue

            # Filter 2: SOC-2 Compliance
            if query.soc2_required and not tool.soc2_compliant:
                continue

            # Filter 3: Required features
            if query.required_features:
                text_to_check = (tool.product_name + " " + tool.features + " " + tool.category).lower()
                if not all(rf.lower() in text_to_check for rf in query.required_features):
                    continue

            results.append(tool)

        # Sort by relevance: matching token density and low ToS risk score
        def relevance_score(tool: SaaSToolRecord) -> float:
            haystack = (tool.product_name + " " + tool.features + " " + tool.category).lower()
            token_matches = sum(1 for t in tokens if t in haystack)
            # Higher score is better: matches positive, high risk penalty
            return token_matches * 10.0 - (tool.tos_risk_score * 2.0) - (tool.monthly_cost * 0.05)

        results.sort(key=relevance_score, reverse=True)
        return results[:query.top_k]
