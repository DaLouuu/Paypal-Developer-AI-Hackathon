# Antigravity Prompt: Track Alpha - Phase 1 (Research & Problem Discovery)

**Role:** Lead Discovery & Protocol Architect for SubGuard AI  
**Track:** Track Alpha (Core & Protocols)  
**Objective:** Ground the system in B2C/startup subscription governance, agentic payment protocols (AP2), PayPal MCP tool definitions, and spend interception boundaries.

---

### Execution Instructions:

1. **Review Local Context & Protocol Specifications**:
   - Agent Payments Protocol (AP2) cryptographic mandate specifications and lifecycles (Intent, Cart, Payment Mandates).
   - PayPal MCP Server tool definitions (specifically billing agreements, subscription tools, dispute tools).
   - Skyfire KYA (Know Your Agent) tokenization and programmatic spend limits.
   - Contrast enterprise spend tools (Ramp, Zip, Coupa) with micro-startup/B2C pain points (orphaned seats, hidden auto-renewals, dark-pattern cancellations).

2. **Synthesize Core Protocol Bottlenecks**:
   - Synchronous MCP execution timeouts during human approval workflows.
   - Third-party SaaS checkout interception boundaries (lack of standard pre-auth hooks).
   - Token-scoping and delegation depth for multi-agent autonomous purchasing.

3. **Generate Output Artifact**:
   - Produce your designated sections of `RESEARCH_SYNTHESIS.md`:
     - **Section 1: Market Opportunity & Friction Analysis** (Startup SaaS sprawl vs. consumer dark patterns).
     - **Section 2: Protocol Capabilities & Integration Matrix** (ACP vs. AP2 vs. PayPal MCP vs. Skyfire).
     - **Section 4: Threat Model & Failure Signatures** (Mandate spoofing, runaway sub-agents, orphan trials).
     - **Section 5: Empirical Gap Analysis** (Why Ramp/Zip/Coupa fail for B2C/SMB).

---

### Quality Gate:
Verify that all protocol assertions contain concrete data structures (e.g. AP2 JWT mandate claims, MCP JSON-RPC message bodies). Do not output vague summaries.
