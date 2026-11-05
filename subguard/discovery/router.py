"""
Discovery REST API Router for SubGuard AI.
Exposes /discovery/search matching workflow/contracts/API_CONTRACTS.md.
"""

from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from subguard.discovery.elastic_client import (
    ElasticDiscoveryClient,
    DiscoverySearchQuery,
    SaaSToolRecord
)

discovery_router = APIRouter(tags=["Discovery"])

# Initialize default discovery client with seed data
default_discovery_client = ElasticDiscoveryClient(mock_mode=True)
default_discovery_client.index_tool(
    SaaSToolRecord(
        product_id="prod_pinecone_01",
        product_name="Pinecone Serverless",
        vendor_domain="pinecone.io",
        category="Vector Database",
        features="Managed vector database with metadata filtering and serverless indexing",
        pricing_tier="Serverless Developer",
        monthly_cost=25.00,
        currency="USD",
        soc2_compliant=True,
        tos_risk_score=0.15,
        cancellation_lead_days_required=0,
        dark_pattern_warnings=[]
    )
)
default_discovery_client.index_tool(
    SaaSToolRecord(
        product_id="prod_weaviate_02",
        product_name="Weaviate Cloud",
        vendor_domain="weaviate.io",
        category="Vector Database",
        features="Open-source and managed vector search engine with hybrid search",
        pricing_tier="Standard",
        monthly_cost=45.00,
        currency="USD",
        soc2_compliant=True,
        tos_risk_score=0.20,
        cancellation_lead_days_required=1,
        dark_pattern_warnings=[]
    )
)
default_discovery_client.index_tool(
    SaaSToolRecord(
        product_id="prod_datadog_03",
        product_name="DataDog APM Enterprise",
        vendor_domain="datadoghq.com",
        category="Observability",
        features="Full-stack APM, tracing, and metric collection for microservices",
        pricing_tier="Enterprise Pro",
        monthly_cost=150.00,
        currency="USD",
        soc2_compliant=True,
        tos_risk_score=0.65,
        cancellation_lead_days_required=30,
        dark_pattern_warnings=["30-day notice required to prevent auto-renewal"]
    )
)


class DiscoverySearchMatch(BaseModel):
    product_name: str
    estimated_monthly_cost: float
    tos_risk_score: float
    dark_pattern_warnings: List[str] = Field(default_factory=list)


class DiscoverySearchRequest(BaseModel):
    query: str
    max_monthly_budget: Optional[float] = None
    required_features: Optional[List[str]] = None


class DiscoverySearchResponse(BaseModel):
    matches: List[DiscoverySearchMatch]


@discovery_router.post("/discovery/search", response_model=DiscoverySearchResponse)
@discovery_router.post("/v1/discovery/search", response_model=DiscoverySearchResponse)
async def search_software_catalog(req: DiscoverySearchRequest):
    q = DiscoverySearchQuery(
        query=req.query,
        max_monthly_budget=req.max_monthly_budget,
        required_features=req.required_features,
        top_k=5
    )
    results = await default_discovery_client.search_catalog(q)
    matches = [
        DiscoverySearchMatch(
            product_name=r.product_name,
            estimated_monthly_cost=r.monthly_cost,
            tos_risk_score=r.tos_risk_score,
            dark_pattern_warnings=r.dark_pattern_warnings
        )
        for r in results
    ]
    return DiscoverySearchResponse(matches=matches)
