# Track Alpha: Checkpoints & Verification Gates

Each phase must satisfy strict automated and manual quality gates before you proceed or merge code to `main`.

---

## Checkpoint 1: Research & Problem Discovery
- [ ] Deliverable `RESEARCH_SYNTHESIS.md` generated with Track Alpha sections (Sections 1 & 2):
  - Agent Payments Protocol (AP2) mandate lifecycle (Intent, Cart, Payment Mandates).
  - PayPal MCP Server tool definitions (`paypal_create_subscription`, disputes).
  - Skyfire KYA programmatic spend caps and token lineage.
- [ ] **Verification Command**:
  ```bash
  python -c "assert open('RESEARCH_SYNTHESIS.md').read().count('AP2') >= 3"
  ```
- [ ] Git commit to `feat/alpha-phase1-research`.

---

## Checkpoint 2: Architecture & Contracts Sign-off
- [ ] Verify that `workflow/contracts/API_CONTRACTS.md` is locked and agreed upon with Track Beta.
- [ ] FastMCP proxy tool schemas validated:
  - `intercept_subscription_checkout`
  - `verify_ap2_mandate`
  - `schedule_cancellation_guard`
- [ ] PostgreSQL DDL syntax validated against Postgres 15+:
  - Schema tables: `users`, `agent_identities`, `ap2_mandates`, `subscriptions`, `cancellation_guards`, `policy_audit_logs`.
- [ ] Mermaid diagrams in `ARCHITECTURE_SPEC.md` render with zero syntax errors.
- [ ] **Dual Sign-Off Gate**: Both you and Track Beta agree no changes will be made to JSON-RPC or REST paths without joint sign-off.

---

## Checkpoint 3: Product RFC & Technical Spec
- [ ] Deliverable `PRODUCT_RFC.md` drafted and verified:
  - Formal Service Level Objectives (SLOs): MCP proxy interception latency < 45ms; deterministic limit check < 5ms.
  - Asynchronous mandate suspension state machine clearly specified.
  - Threat model detailing protection against mandate spoofing, orphan trials, and runaway sub-agents.
- [ ] Git commit to `feat/alpha-phase3-rfc`.

---

## Checkpoint 4: TDD Core Implementation
- [ ] **Write Tests First**:
  - `tests/test_core/test_deterministic_limits.py`
  - `tests/test_core/test_ap2_verifier.py`
  - `tests/test_core/test_mcp_proxy.py`
- [ ] **Core Code Implemented**:
  - `subguard/engine/deterministic.py`
  - `subguard/protocols/ap2.py`
  - `subguard/mcp_proxy/server.py`
  - `subguard/db/models.py`
- [ ] **Verification Commands**:
  ```bash
  ruff check subguard/ tests/test_core/ --fix
  pytest tests/test_core/ -v --cov=subguard/engine --cov=subguard/protocols --cov=subguard/mcp_proxy
  ```
- [ ] **Quality Gate**:
  - 100% test pass rate.
  - Zero linter/formatting errors.
  - No edits made inside `subguard/discovery/` or `frontend/`.
- [ ] Merge `feat/alpha-core-mcp` to `main` via non-fast-forward merge:
  ```bash
  git checkout main
  git pull origin main
  git merge feat/alpha-core-mcp --no-ff -m "Merge Track Alpha: Core MCP Proxy & AP2 Engine"
  ```

---

## Checkpoint 5: Evaluation & Empirical Benchmarking
- [ ] Run benchmark load tests:
  - Measure deterministic policy evaluation latency (must be < 5ms p95).
  - Measure FastMCP proxy overhead (must be < 45ms p95).
  - Simulate 50 concurrent suspended sessions awaiting approval without memory leaks or dropped state.
- [ ] Run security test suite:
  - 100% block rate on transactions exceeding spend limits or targeting unapproved merchants.
- [ ] Feed results into `BENCHMARK_REPORT.md`.

---

## Checkpoint 6: Production Hardening & Deployment
- [ ] In-memory Redis/SQLite cache added for active AP2 cryptographic mandates.
- [ ] Production-ready `Dockerfile` created for Render Web Services.
- [ ] Full regression suite executed:
  ```bash
  pytest tests/ -v
  ```
- [ ] Final sign-off with Track Beta: End-to-end integration test passes with live frontend connecting to FastMCP gateway on `localhost:8000`.
