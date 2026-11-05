# Track Beta: Checkpoints & Verification Gates

Each phase must satisfy strict automated and manual quality gates before you proceed or merge code to `main`.

---

## Checkpoint 1: Research & Partner Discovery
- [ ] Deliverable `RESEARCH_SYNTHESIS.md` generated with Track Beta sections (Sections 3 & 4):
  - SaaS catalog data structures and pricing model representations.
  - Legal landscape for auto-renewals (FTC "Click-to-Cancel", EU Consumer Rights Directive).
  - Integration mapping for Elastic, AG Grid, Bryntum, APIMatic, and Zapier.
- [ ] **Verification Command**:
  ```bash
  python -c "assert open('RESEARCH_SYNTHESIS.md').read().count('Elastic') >= 3"
  ```
- [ ] Git commit to `feat/beta-phase1-research`.

---

## Checkpoint 2: Schemas, Indexing & Wireframes
- [ ] Elasticsearch index mapping created for SaaS software discovery (`product_name`, `category`, `features`, `pricing_vector`, `tos_text`).
- [ ] OpenAPI schema for `/discovery/search` and Zapier approval webhook payload verified against `workflow/contracts/API_CONTRACTS.md`.
- [ ] React UI component wireframes documented for:
  - AG Grid subscription inventory table (seats, cost, burn rate, next renewal).
  - Bryntum interactive calendar showing 30-day, 60-day, and 90-day renewal lock-in windows.
- [ ] **Dual Sign-Off Gate**: Both you and Track Alpha lock `workflow/contracts/API_CONTRACTS.md`.

---

## Checkpoint 3: Investor Pitch Deck & UI Walkthrough
- [ ] Deliverable `PITCH_DECK.md` completed (12 slides):
  - Problem: Subscription sprawl, hidden auto-renewals, dark patterns.
  - Solution: Autonomous agentic governance + hybrid MCP proxy.
  - Unit Economics: Free tier for individual consumers, $15/seat/month for startups managing up to $20k monthly spend.
  - Defensibility: Proprietary cancellation graph generated via APIMatic, continuous ToS monitoring via Elastic.
- [ ] UI/UX user journey flows documented for trial detection and one-click cancellation.
- [ ] Git commit to `feat/beta-phase3-deck`.

---

## Checkpoint 4: TDD Integrations & Frontend Implementation
- [ ] **Write Tests First**:
  - `tests/test_integrations/test_elastic_search.py` (k-NN software query recall under budget).
  - `tests/test_integrations/test_tos_parser.py` (Flagging auto-renewal traps in sample ToS contracts).
  - `tests/test_integrations/test_zapier_relay.py` (Webhook payload serialization and response parsing).
- [ ] **Core Code Implemented**:
  - `subguard/discovery/elastic_client.py`
  - `subguard/discovery/tos_analyzer.py`
  - `subguard/integrations/apimatic_client.py`
  - `subguard/integrations/zapier.py`
  - `frontend/src/components/SubscriptionTable.jsx` (AG Grid)
  - `frontend/src/components/RenewalTimeline.jsx` (Bryntum Calendar)
- [ ] **Verification Commands**:
  ```bash
  pytest tests/test_integrations/ -v
  cd frontend && npm test -- --watchAll=false
  ```
- [ ] **Quality Gate**:
  - 100% test pass rate.
  - Zero linter errors.
  - No edits made inside `subguard/engine/`, `subguard/mcp_proxy/`, or `subguard/protocols/`.
- [ ] Merge `feat/beta-discovery-ui` into `main` after Track Alpha merges their backend.

---

## Checkpoint 5: Evaluation & Performance Benchmarking
- [ ] Elasticsearch semantic search benchmark:
  - Assert query latency < 120ms (p95).
  - Verify relevance ranking for natural-language queries (e.g. "cheap transcription API under $20/month with SOC-2").
- [ ] Zapier webhook fault tolerance:
  - Test simulated webhook network failures; verify graceful fallback and retry.
- [ ] Frontend performance:
  - AG Grid renders 500+ subscriptions with virtual scrolling at 60 FPS without DOM lag.
- [ ] Record metrics into `BENCHMARK_REPORT.md`.

---

## Checkpoint 6: Production Build & E2E Verification
- [ ] Build static frontend distribution:
  ```bash
  cd frontend && npm run build
  ```
- [ ] Run Postman / Newman integration collection against live backend on `localhost:8000`:
  ```bash
  newman run tests/postman/SubGuard_Integration.json
  ```
- [ ] Confirm all end-to-end flows pass: discovery search -> checkout interception -> Zapier approval loop -> dashboard refresh.
