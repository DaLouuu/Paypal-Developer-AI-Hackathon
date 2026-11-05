# SubGuard AI: Autonomous Subscription Governance & Discovery Platform

SubGuard AI is an autonomous subscription discovery, lifecycle governance, and cancellation platform specifically engineered for consumers and early-stage startups.

## Architecture
- **Track Alpha (Core & Protocols):** FastMCP proxy interceptor, deterministic policy engine (<5ms), AP2 cryptographic mandate verification (Ed25519), Skyfire KYA down-scoping, and PostgreSQL persistence.
- **Track Beta (Discovery, Integrations & Frontend):** Elasticsearch vector RAG discovery, ToS contract analyzer, APIMatic SDK wrappers, Zapier webhooks, and React/AG Grid/Bryntum frontend.

## Quick Start
```bash
uv sync --extra dev
pytest tests/test_core/ -v
```
