# Antigravity Prompt: Track Beta - Phase 6 (Frontend Build & E2E Verification)

**Role:** Production Release & Frontend Deployment Engineer  
**Track:** Track Beta (Discovery, Integrations & Frontend)  
**Objective:** Create production frontend builds, run automated Postman / Newman test collections, and verify end-to-end integration with Track Alpha's live backend.

---

### Execution Instructions:

1. **Frontend Production Packaging**:
   - Optimize frontend assets and generate the production bundle:
     ```bash
     cd frontend && npm run build
     ```
   - Verify that bundle size is optimized with tree-shaking and vendor chunking.

2. **Automated Postman / Newman Integration Suite**:
   - Create and run `tests/postman/SubGuard_Integration.json` targeting the live FastAPI / FastMCP server on `localhost:8000`:
     - Test 1: `POST /discovery/search` returns valid matched SaaS tools.
     - Test 2: `POST /mandates/suspend` successfully records a pending authorization.
     - Test 3: `POST /webhooks/zapier/approval-callback` triggers resumption.
     - Test 4: `POST /mandates/{ref}/resume` executes successfully.
   - Run via Newman:
     ```bash
     newman run tests/postman/SubGuard_Integration.json --environment tests/postman/local_env.json
     ```

3. **Joint End-to-End System Validation**:
   - Connect the React frontend to Track Alpha's live FastMCP proxy server.
   - Execute a complete simulated user flow:
     1. Search for a SaaS tool in the UI.
     2. Attempt an over-limit checkout via the MCP client.
     3. Verify the transaction shows as "SUSPENDED" in AG Grid and triggers a Slack alert.
     4. Click "Approve" and verify the status flips to "ACTIVE_RECURRING" on the dashboard.
     5. Check that the cancellation guard appears on the Bryntum calendar.

---

### Quality Gate:
100% of Newman integration tests must pass against the live server. Clean static bundle build with zero errors.
