# Antigravity Prompt: Track Alpha - Phase 4 (TDD Core Implementation)

**Role:** Lead Software Engineer (Core & Protocols) in Antigravity  
**Track:** Track Alpha  
**Objective:** Implement the end-to-end working core backend using strict Test-Driven Development (TDD).

---

### Task Scope & Boundaries:
**You exclusively own:**
- `subguard/core/`
- `subguard/engine/`
- `subguard/protocols/`
- `subguard/mcp_proxy/`
- `subguard/db/`
- `tests/test_core/`
- Root `pyproject.toml` and `uv.lock`

**STRICT PROHIBITION:** Do NOT edit or create files inside `subguard/discovery/`, `subguard/integrations/`, or `frontend/`.

---

### Execution Sequence:

#### Step 1: Environment & Dependency Scaffolding
- Initialize project configuration in `pyproject.toml` using `uv`:
  Dependencies: `fastapi`, `uvicorn`, `pydantic>=2.0`, `mcp`, `httpx`, `asyncpg`, `cryptography`, `pytest`, `pytest-asyncio`, `ruff`.

#### Step 2: Test Harness Construction (Write Tests FIRST)
1. `tests/test_core/test_deterministic_limits.py`:
   - Test hard monthly spending limits.
   - Test single-transaction spending ceiling.
   - Test merchant blacklist and unapproved domain blocking.
   - Test trial duration clamping (e.g. enforce cancellation 48h before renewal).
2. `tests/test_core/test_ap2_mandates.py`:
   - Test Ed25519 cryptographic signature creation and verification.
   - Test mandate expiration timestamps and consumed balance tracking.
   - Test multi-agent delegation depth check.
3. `tests/test_core/test_mcp_proxy.py`:
   - Mock client calling `intercept_subscription_checkout`.
   - Assert that over-limit calls return `SUSPENDED_AWAITING_HUMAN` and emit a webhook event.
   - Assert that approved calls return `decision: APPROVED` with a delegated token.

#### Step 3: Core Implementation
1. `subguard/engine/deterministic.py`:
   - High-speed rule evaluation logic (<5ms) enforcing hard financial constraints.
2. `subguard/protocols/ap2.py`:
   - AP2 JWT parser, Ed25519 validator, and Skyfire KYA child token down-scoping.
3. `subguard/mcp_proxy/server.py`:
   - FastMCP Server implementing `intercept_subscription_checkout`, `verify_ap2_mandate`, and `schedule_cancellation_guard`.
4. `subguard/db/models.py` & `subguard/db/connection.py`:
   - Async PostgreSQL models and connection pool using `asyncpg`.

#### Step 4: Verification & Linting
Run terminal commands:
```bash
ruff check subguard/engine subguard/mcp_proxy subguard/protocols --fix
pytest tests/test_core/ -v --cov=subguard
```

---

### Quality Gate:
Zero linter errors. 100% test pass rate across `tests/test_core/`. Commit to branch `feat/alpha-core-mcp`.
