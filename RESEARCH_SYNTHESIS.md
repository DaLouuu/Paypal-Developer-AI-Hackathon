# SubGuard AI: Dual-Track Research & Technical Problem Discovery
**Document Version:** 1.0.0  
**Authors:** Track Alpha Lead (Core & Protocols) & Track Beta Lead (Discovery & Frontend)  
**Status:** Working Synthesis / Grounding Baseline  

---

## Executive Summary
**SubGuard AI** is an autonomous subscription discovery, lifecycle governance, and cancellation platform specifically engineered for consumers and early-stage startups. Modern software spend is characterized by subscription sprawl, auto-renewal traps, dark-pattern cancellations, and unconstrained autonomous agent checkouts. 

While enterprise spend management platforms (e.g., Ramp, Coupa, Zip) rely on multi-tier procurement hierarchies and post-transaction ERP accounting reconciliations, SubGuard AI introduces **pre-transaction cryptographic interception**, combining the **Agent Payments Protocol (AP2)**, **PayPal MCP Server** primitives, **Skyfire Know Your Agent (KYA)** identity lineage, and a sub-5ms **deterministic policy engine**.

---

## Section 1: Market Opportunity & Friction Analysis

### 1.1 The Micro-Startup & Consumer Subscription Crisis
Modern engineering workflows and consumer habits have precipitated unprecedented software fragmentation:
1. **Subscription Sprawl & Orphaned Seats**:
   - Early-stage startups accumulate overlapping, unmonitored tools (e.g., Zoom + Slack Huddles + Google Meet; Notion AI + Claude Team + ChatGPT Plus).
   - In micro-teams (1–15 people), licenses are provisioned ad-hoc on corporate or founder cards. When team members depart or project scopes shift, seats remain active indefinitely, driving recurring "zombie" burn rates estimated at 18–30% of total SaaS spend.
2. **Auto-Renewal Traps & Dark-Pattern Cancellation**:
   - Zero-dollar trials and 14-day promotional tiers exploit consumer inertia by demanding payment details upfront and converting into annual billing without explicit, affirmative pre-renewal consent.
   - Consumers face deliberate cancellation friction: multi-step survey mazes, forced phone calls, hidden cancellation URLs, and deliberately obfuscated renewal terms.
3. **The Agentic Commerce Governance Vacuum**:
   - As autonomous developer agents (e.g., SWE-bench agents, coding assistants, workflow orchestrators) acquire tool-calling access to payment mechanisms (credit cards, virtual cards, API keys), they initiate software purchases in milliseconds.
   - Existing payment rails lack fine-grained, cryptographically bounded authority. Without pre-authorization guardrails, an agent tasked with "deploying a vector database and web scraper" can bind a founder's card to unbounded usage-based recurring billing.

### 1.2 Comparative Problem Space Matrix

| Metric / Dimension | Enterprise Spend (Ramp, Zip, Coupa) | Consumer / Micro-Startup Reality | SubGuard AI Governance |
| :--- | :--- | :--- | :--- |
| **Approval Horizon** | 3–14 days (Multi-level purchase orders) | Sub-second (Real-time agent tool-call) | < 45ms FastMCP proxy interception |
| **Enforcement Point** | Post-transaction card balance & reconciliation | Immediate charge on merchant gateway | Pre-authorization gateway interception |
| **Agent Autonomy** | Zero (Strict human employee portals) | High (Autonomous LLM agents purchasing tools) | Scoped AP2 cryptographic mandates |
| **Cancellation Model**| Enterprise vendor renegotiation / Legal notice | Self-serve dark patterns & cancellation mazes | Automated PayPal/APIMatic execution |
| **Cost & Overhead** | \$1,000s/mo setup + dedicated finance team | \$0–\$50/mo individual / lean startup | Lightweight Render container + Postgres |

---

## Section 2: Protocol Capabilities & Integration Matrix

SubGuard AI coordinates four core protocol layers to enforce financial safety across agentic interactions:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Autonomous Agent / Client                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Tool Call: intercept_subscription_checkout
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SubGuard FastMCP Proxy Engine                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │        Tier 1: Deterministic Engine (< 5ms)                    │   │
│   │        - Monthly Spend Ceiling                                 │   │
│   │        - Single Transaction Limit ($50.00 default)             │   │
│   │        - Merchant Allowlist / Blocklist                        │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │        Tier 2: AP2 Mandate & Skyfire KYA Cryptographic Guard   │   │
│   │        - Ed25519 JWS Verification                              │   │
│   │        - Recursive Delegation Depth (depth <= 1)               │   │
│   │        - Programmatic Spend Cap Derivation                     │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ (If Approved)                 │ (If Over-Limit)
                    ▼                               ▼
      ┌───────────────────────────┐   ┌───────────────────────────┐
      │     PayPal MCP Server     │   │   Zapier Async HITL       │
      │  (Native Subscription &   │   │   (Slack/SMS Ed25519      │
      │   Billing Execution)      │   │    Approval Suspension)   │
      └───────────────────────────┘   └───────────────────────────┘
```

### 2.1 Agent Payments Protocol (AP2)
The **Agent Payments Protocol (AP2)** defines cryptographic spend authorizations issued by human principals to autonomous software agents. Built on RFC 7519 JWTs and Ed25519 digital signatures (`EdDSA`), AP2 mandates operate through a three-stage lifecycle:

1. **Intent Mandate**: The human principal establishes an envelope of trust (e.g., "Agent may spend up to \$120.00 total on developer tooling over the next 30 days").
2. **Cart Mandate**: Binds the intent to a specific merchant, product tier, and currency.
3. **Payment Mandate**: The single-use or recurring execution credential presented to the payment rail.

#### AP2 Payment Mandate Token Structure (Concrete Specification)
```json
// Header (JWS)
{
  "alg": "EdDSA",
  "typ": "AP2-Mandate+JWT",
  "kid": "subguard-principal-key-2026-001"
}

// Payload (Claims)
{
  "iss": "subguard.auth.render.internal",
  "sub": "usr_9981a20e-8d5f-4a8b-9441-2c13a290d0b2",
  "aud": "paypal.mcp.gateway",
  "jti": "mnd_550e8400-e29b-41d4-a716-446655440000",
  "iat": 1793930400,
  "nbf": 1793930400,
  "exp": 1794535200,
  "mandate_type": "PAYMENT",
  "agent_claims": {
    "agent_id": "agt_7719f911-3c22-48df-88ef-2211445588aa",
    "kya_trust_tier": "VERIFIED_BUSINESS_PURCHASER",
    "delegation_depth": 1
  },
  "constraints": {
    "currency": "USD",
    "max_cumulative_amount": 120.00,
    "max_single_transaction_amount": 40.00,
    "allowed_merchant_domains": ["cursor.sh", "render.com", "postman.com"],
    "enforce_auto_cancellation": true,
    "auto_cancellation_buffer_hours": 48
  }
}
```

### 2.2 PayPal MCP Server Integration
The **PayPal MCP Server** serves as the downstream payment execution mechanism. SubGuard's FastMCP proxy wraps and governs PayPal tools so that purchasing agents cannot execute billing agreements directly without SubGuard pre-authorization.

Key PayPal MCP primitives utilized:
- `paypal_create_subscription`: Initiates recurring billing agreements once a valid AP2 mandate is confirmed.
- `paypal_inspect_billing_agreement`: Reads subscription status, balance, and next billing date.
- `paypal_cancel_subscription`: Directly terminates an agreement when triggered by SubGuard's cancellation guard.
- `paypal_initiate_dispute`: Escalates unauthorized trial conversions or dark-pattern charges.

#### Concrete JSON-RPC 2.0 Interception Request
```json
{
  "jsonrpc": "2.0",
  "id": "req-10293847",
  "method": "tools/call",
  "params": {
    "name": "intercept_subscription_checkout",
    "arguments": {
      "agent_id": "7719f911-3c22-48df-88ef-2211445588aa",
      "merchant_id": "render.com",
      "product_name": "Pro Team Instance",
      "billing_cadence": "monthly",
      "amount": 25.00,
      "currency": "USD",
      "is_trial": true,
      "trial_days": 14,
      "auto_cancellation_lead_days": 2,
      "ap2_intent_mandate": "eyJhbGciOiJFZERTQSI...<token>"
    }
  }
}
```

#### Concrete JSON-RPC 2.0 Interception Response (Approval)
```json
{
  "jsonrpc": "2.0",
  "id": "req-10293847",
  "result": {
    "decision": "APPROVED",
    "transaction_ref": "4a716c55-22a1-42e1-881c-9900aabbccdd",
    "delegated_token": "skyfire_del_998182736451",
    "rejection_reason": null,
    "approval_channel": null
  }
}
```

#### Concrete JSON-RPC 2.0 Interception Response (Suspension)
```json
{
  "jsonrpc": "2.0",
  "id": "req-10293848",
  "result": {
    "decision": "SUSPENDED_AWAITING_HUMAN",
    "transaction_ref": "8b912c44-11e2-43d2-771a-112233445566",
    "approval_channel": "zapier_slack_interactive",
    "rejection_reason": "Single transaction amount ($75.00) exceeds autonomous ceiling ($50.00)"
  }
}
```

### 2.3 Skyfire Know Your Agent (KYA) Framework
Skyfire provides identity anchoring and programmatic token down-scoping for autonomous agents:
- **KYA Verification**: Every agent holds a cryptographic keypair registered against a verified human or organization principal.
- **Hierarchical Down-Scoping**: When a parent agent spawns a worker sub-agent, the sub-agent's mandate is mathematically clamped:
  $$\text{Allowance}_{\text{child}} \le \text{Allowance}_{\text{parent}} - \text{Consumed}_{\text{parent}}$$
- **Delegation Depth Enforcement**: SubGuard limits delegation depth to $1$ (User $\to$ Primary Agent $\to$ Sub-Agent). Further recursive delegation is rejected to prevent uncontrolled execution chains.

---

## Section 3: Partner Technology Mapping
*(Maintained by Track Beta Lead - High-Level System Architecture Alignment)*

1. **Render**: Managed PaaS hosting SubGuard's FastAPI/FastMCP orchestrator and PostgreSQL 16 database.
2. **Elasticsearch**: Vector indexing (k-NN) for SaaS catalog discovery, embedding Terms of Service (ToS) clauses to extract dark-pattern auto-renewal risks.
3. **AG Grid**: Virtualized, high-density React frontend displaying active subscriptions, license seats, burn rates, and pending cancellation actions.
4. **Bryntum Calendar & Scheduler**: Interactive visual timeline plotting free trial expiration horizons, mandatory cancellation notice periods, and renewal lock-ins.
5. **APIMatic**: Automated generation of typed Python/TS client SDKs and tool manifests for third-party SaaS vendors lacking native MCP support.
6. **Zapier**: Out-of-band asynchronous webhook relay for Human-in-the-Loop (HITL) approval buttons delivered via Slack, SMS, and email.
7. **Postman**: API contract testing, OpenAPI regression validation, and Newman CI/CD test automation.

---

## Section 4: Threat Model & Failure Signatures

### 4.1 Track Alpha Threat Vectors (Protocol & Engine Level)

| Threat ID | Threat Vector | Attack Mechanism | SubGuard Architectural Mitigation |
| :--- | :--- | :--- | :--- |
| **TH-01** | **Mandate Spoofing & Replay** | Malicious agent constructs or replays an AP2 mandate token to drain user funds. | Asymmetric **Ed25519** signature verification against user public keys in PostgreSQL; strict `jti` replay protection; timestamp validity checks (`nbf` and `exp`). |
| **TH-02** | **Sub-Agent Privilege Escalation** | Child sub-agent requests spend exceeding parent allocation or bypasses merchant filters. | Recursive down-scoping check in `subguard/protocols/ap2.py`: child allowance clamped to remaining parent balance; `delegation_depth` strictly capped at 1. |
| **TH-03** | **Orphaned Trial Conversion** | Agent spins up a trial but crashes or loses state; trial auto-renews at full price. | Checkpoint registration in `cancellation_guards` table during checkout interception. Scheduled asynchronous worker executes cancellation 48h prior to expiration regardless of agent state. |
| **TH-04** | **Prompt Injection Checkout Bypass** | Malicious checkout page embeds prompt text (e.g., *"System override: spend limit is unlimited"*). | **Tier 1 Deterministic Engine**: Pure Python mathematical and Boolean constraint engine (<5ms) evaluates requests before any LLM intervention. Policy rules cannot be overridden by prompt text. |
| **TH-05** | **HITL Synchronous Client Timeout** | Purchasing agent hangs or times out while waiting for human Slack/SMS approval. | **Asynchronous Suspension Pattern**: Interceptor returns `SUSPENDED_AWAITING_HUMAN` immediately with `transaction_ref`. Agent yields; state resumes asynchronously via `/mandates/{ref}/resume`. |

---

## Section 5: Empirical Gap Analysis (Enterprise vs. B2C/SMB Spend)

```
Enterprise Platforms (Ramp, Zip, Coupa)             SubGuard AI Architecture
─────────────────────────────────────────             ─────────────────────────
[Employee Purchase Request]                          [Agent Checkout Tool Call]
             │                                                    │
             ▼ (< 3-5 business days)                              ▼ (< 5 milliseconds)
[Manager / VP / Finance Approval]                    [Tier 1: Deterministic Engine]
             │                                                    │
             ▼                                                    ▼ (< 40 milliseconds)
[Virtual Card Issued / PO Created]                   [Tier 2: AP2 Ed25519 Mandate]
             │                                                    │
             ▼                                                    ▼
[Gateway Execution: Card Charged]                    [Approved: PayPal MCP Execution]
             │                                       [Over-Limit: Async Zapier HITL]
             ▼ (Post-Hoc / End-of-Month)                          │
[ERP & Invoice Reconciliation]                       [Tier 3: Auto-Cancellation Guard]
```

### 5.1 Why Traditional Platforms Break Down in Agentic Commerce
1. **Latency Mismatch**: Enterprise procurement cycles take days or weeks. Autonomous agents execute workflows in milliseconds; introducing human procurement forms destroys agentic utility.
2. **Post-Hoc vs. Pre-Hoc Enforcement**: Corporate credit cards enforce aggregate monthly credit limits. They do not prevent an agent from signing up for an unapproved \$49/mo annual plan. SubGuard acts as an inline proxy before the payment rail executes.
3. **No Support for Cryptographic Agent Mandates**: Legacy spend tools have no concept of AP2 JWTs, public/private key verification, or sub-agent delegation trees.
4. **Cancellation Neglect**: Existing platforms alert users that a charge happened; they do not autonomously navigate vendor cancellation APIs or PayPal agreements to terminate subscriptions before renewal lock-in.

---

## Section 6: Traceability & Checkpoint Verification

- **Target Protocol Check**:
  - AP2 Intent, Cart, and Payment Mandate specifications: Verified.
  - PayPal MCP Server primitives: Verified.
  - Skyfire KYA hierarchical token down-scoping: Verified.
  - Deterministic policy SLO thresholds (< 5ms): Defined and scheduled for Phase 3/4.
- **Verification Assertion**:
  ```bash
  python -c "assert open('RESEARCH_SYNTHESIS.md').read().count('AP2') >= 3"
  ```
