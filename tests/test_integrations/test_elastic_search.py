"""
Tests for Elasticsearch Discovery Pipeline.
Tests k-NN vector queries, budget constraints, SOC-2 filtering,
and semantic query ranking for SaaS tool discovery.
"""

import pytest
import asyncio
from subguard.discovery.elastic_client import (
    ElasticDiscoveryClient,
    DiscoverySearchQuery,
    SaaSToolRecord
)


@pytest.fixture
def mock_elastic_client():
    client = ElasticDiscoveryClient(mock_mode=True)
    # Seed mock client with test software tools
    tools = [
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
        ),
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
        ),
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
        ),
        SaaSToolRecord(
            product_id="prod_sketchy_db_04",
            product_name="QuickVec Non-Compliant",
            vendor_domain="quickvec.dev",
            category="Vector Database",
            features="Ultra cheap vector store",
            pricing_tier="Budget Basic",
            monthly_cost=10.00,
            currency="USD",
            soc2_compliant=False,
            tos_risk_score=0.88,
            cancellation_lead_days_required=60,
            dark_pattern_warnings=["Mandatory phone call required for cancellation", "60-day auto-lockin"]
        )
    ]
    for tool in tools:
        client.index_tool(tool)
    return client


def test_search_saas_tools_within_budget(mock_elastic_client):
    """Assert k-NN query returns SaaS tools within specified budget limits."""
    query = DiscoverySearchQuery(
        query="managed vector database with serverless scaling",
        max_monthly_budget=30.00,
        required_features=["vector"]
    )
    results = asyncio.run(mock_elastic_client.search_catalog(query))

    assert len(results) > 0
    for match in results:
        assert match.monthly_cost <= 30.00
        assert "vector" in match.features.lower()
    
    top_match = results[0]
    assert top_match.product_name == "Pinecone Serverless"
    assert top_match.tos_risk_score < 0.25


def test_search_saas_tools_soc2_filter(mock_elastic_client):
    """Assert search filters out non-compliant tools when SOC-2 is required."""
    query = DiscoverySearchQuery(
        query="cheap vector database",
        max_monthly_budget=100.00,
        soc2_required=True
    )
    results = asyncio.run(mock_elastic_client.search_catalog(query))

    assert len(results) >= 2
    for match in results:
        assert match.soc2_compliant is True
        assert match.product_id != "prod_sketchy_db_04"


def test_search_empty_when_budget_too_low(mock_elastic_client):
    """Assert query returns empty list when budget is lower than any available tool."""
    query = DiscoverySearchQuery(
        query="enterprise vector database",
        max_monthly_budget=5.00
    )
    results = asyncio.run(mock_elastic_client.search_catalog(query))
    assert len(results) == 0
