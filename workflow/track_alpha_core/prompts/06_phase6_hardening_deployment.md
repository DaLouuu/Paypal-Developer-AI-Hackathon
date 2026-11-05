# Antigravity Prompt: Track Alpha - Phase 6 (Hardening & Render Deployment)

**Role:** Site Reliability & Performance Engineering Lead  
**Track:** Track Alpha (Core & Protocols)  
**Objective:** Eliminate benchmark bottlenecks, implement mandate caching, harden error recovery, and generate production infrastructure blueprints for Render.

---

### Execution Instructions:

1. **Implement Targeted Performance Optimizations**:
   - Add an in-memory Redis or SQLite cache for active AP2 cryptographic mandates to prevent repeated database lookups during high-frequency micro-transactions.
   - Optimize FastMCP JSON-RPC payload parsing.

2. **Hardening & Error Recovery**:
   - Implement exponential backoff and a dead-letter queue for webhook notifications.
   - Verify Skyfire KYA token lineage checks to prevent sub-agent privilege escalation.

3. **Production Deployment Scaffolding**:
   - Generate production multi-stage `Dockerfile` optimized for Render Web Services.
   - Author `render.yaml` declaring the FastAPI web service, managed PostgreSQL 16 database, and necessary environment secrets.

4. **Run Full Regression Suite**:
   ```bash
   pytest tests/test_core/ -v
   ```

5. **Joint Integration Gate with Track Beta**:
   - Spin up the local FastMCP server on `localhost:8000`.
   - Validate live connection with Track Beta's frontend and Postman collections.

---

### Quality Gate:
All container builds compile cleanly without unpinned dependencies. 100% test pass rate with zero regressions.
