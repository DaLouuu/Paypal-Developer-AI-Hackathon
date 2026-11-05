# Antigravity Prompt: Track Beta - Phase 4 (TDD Integrations & Frontend)

**Role:** Lead Frontend & Integrations Software Engineer in Antigravity  
**Track:** Track Beta  
**Objective:** Implement the Elasticsearch discovery pipeline, ToS analyzer, Zapier webhook handlers, and React/AG Grid/Bryntum dashboard using strict Test-Driven Development (TDD).

---

### Task Scope & Boundaries:
**You exclusively own:**
- `subguard/discovery/`
- `subguard/integrations/`
- `frontend/`
- `tests/test_integrations/`
- `tests/mocks/`
- `frontend/package.json` and `frontend/package-lock.json`

**STRICT PROHIBITION:** Do NOT edit or create files inside `subguard/engine/`, `subguard/mcp_proxy/`, `subguard/protocols/`, or `subguard/db/`.

---

### Execution Sequence:

#### Step 1: Mock Server Setup (Build Without Blocking on Alpha)
- In `tests/mocks/mock_proxy_server.py`, construct a lightweight mock handler returning the exact JSON responses defined in `workflow/contracts/API_CONTRACTS.md` for `intercept_subscription_checkout` and `/mandates/suspend`.

#### Step 2: Test Harness Construction (Write Tests FIRST)
1. `tests/test_integrations/test_elastic_search.py`:
   - Unit test asserting k-NN vector queries return SaaS tools within specified budget limits.
2. `tests/test_integrations/test_tos_parser.py`:
   - Unit test asserting that sample contract text containing hidden renewal clauses returns a `tos_risk_score > 0.7`.
3. `tests/test_integrations/test_zapier_relay.py`:
   - Unit test asserting valid serialization of the `ZapierApprovalPayload` and verification of the approval response.
4. `frontend/src/__tests__/SubscriptionTable.test.jsx`:
   - React Testing Library test verifying AG Grid renders mock subscription rows and computes total burn rate.

#### Step 3: Implement Integrations & Frontend
1. `subguard/discovery/elastic_client.py`:
   - Async Elasticsearch client implementing natural language tool discovery.
2. `subguard/discovery/tos_analyzer.py`:
   - Regex and embedding-based ToS risk evaluator flagging renewal traps.
3. `subguard/integrations/zapier.py`:
   - Webhook dispatcher and callback receiver for human Slack/SMS authorizations.
4. `frontend/src/App.jsx`:
   - Main dashboard integrating AG Grid table and Bryntum Calendar timeline.

#### Step 4: Verification & Linting
Run terminal commands:
```bash
pytest tests/test_integrations/ -v
cd frontend && npm test -- --watchAll=false
```

---

### Quality Gate:
Zero linter errors. 100% test pass rate across `tests/test_integrations/` and frontend test suites. Commit to branch `feat/beta-discovery-ui`.
