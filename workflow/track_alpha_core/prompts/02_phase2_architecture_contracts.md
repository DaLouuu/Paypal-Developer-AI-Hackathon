# Antigravity Prompt: Track Alpha - Phase 2 (Architecture & Contracts)

**Role:** Principal Systems & Protocol Architect for SubGuard AI  
**Track:** Track Alpha (Core & Protocols)  
**Objective:** Formalize the hybrid FastMCP proxy architecture, deterministic rule engine specs, asynchronous mandate suspension mechanics, and PostgreSQL relational schemas.

---

### Execution Instructions:

1. **Design the Hybrid MCP Proxy Gateway**:
   - Architect the FastMCP server hosted on Render that intercepts agent financial tool calls between user agents and PayPal MCP / external APIs.
   - Formulate the **Asynchronous Mandate Suspension Pattern**:
     - When an agent calls a subscription purchase exceeding deterministic thresholds, the proxy intercepts the call.
     - The proxy assigns an idempotent `transaction_ref`, registers `status: SUSPENDED_AWAITING_HUMAN`, and triggers an out-of-band notification via Zapier.
     - Upon receiving an Ed25519 cryptographic signature from the human principal, the transaction resumes and executes via PayPal MCP.

2. **Validate & Lock Core Contracts in `workflow/contracts/API_CONTRACTS.md`**:
   - JSON-RPC 2.0 schemas for custom MCP tools:
     - `intercept_subscription_checkout`
     - `verify_ap2_mandate`
     - `schedule_cancellation_guard`
   - PostgreSQL 15+ relational schema DDL:
     - `users`, `agent_identities`, `ap2_mandates`, `subscriptions`, `cancellation_guards`, `policy_audit_logs`.
   - AP2 JWT JWS header (`EdDSA`, `AP2-Mandate+JWT`) and claims payload (`agent_claims`, `constraints`).

3. **Verify Cross-Track Isolation**:
   - Ensure you do not touch frontend routing or Elasticsearch mapping definitions.
   - Coordinate with Track Beta to freeze `workflow/contracts/API_CONTRACTS.md`.

---

### Quality Gate:
All Mermaid diagrams in architecture documents must be syntactically valid. All JSON-RPC and SQL DDL schemas must be free of syntax errors and adhere strictly to PostgreSQL 15+ standards.
