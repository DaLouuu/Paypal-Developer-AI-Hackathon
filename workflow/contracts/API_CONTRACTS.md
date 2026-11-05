# API Contracts & Interface Specifications (SubGuard AI)
**Version:** 1.0.0  
**Status:** FROZEN SINGLE SOURCE OF TRUTH (Any schema modification requires dual-engineer sign-off)  
**Target Runtimes:** FastMCP / FastAPI / PostgreSQL 16 / Render  

---

## 1. Custom Model Context Protocol (MCP) Tool Schemas

SubGuard operates as an intermediate MCP server toward purchasing agents and an MCP client toward payment gateways.

### 1.1. `intercept_subscription_checkout`
Evaluates a proposed software purchase, trial activation, or recurring subscription against deterministic budget limits, trial auto-cancellation policies, and agent authorization scopes.

```json
{
  "name": "intercept_subscription_checkout",
  "description": "Intercepts and validates a digital subscription checkout request before financial execution. Evaluates deterministic limits, trial terms, and AP2 cryptographic mandate authorization.",
  "parameters": {
    "type": "object",
    "required": [
      "agent_id",
      "merchant_id",
      "product_name",
      "billing_cadence",
      "amount",
      "currency",
      "is_trial"
    ],
    "properties": {
      "agent_id": {
        "type": "string",
        "format": "uuid",
        "description": "Unique identifier of the agent initiating the transaction, verified against Skyfire KYA credentials."
      },
      "merchant_id": {
        "type": "string",
        "description": "Normalized identifier or domain of the SaaS vendor (e.g., 'notion.so', 'github.com')."
      },
      "product_name": {
        "type": "string",
        "description": "Name or tier of the subscription product (e.g., 'Team Plan', 'Pro Annual')."
      },
      "billing_cadence": {
        "type": "string",
        "enum": ["monthly", "quarterly", "annual", "usage_based", "one_time"],
        "description": "The recurring billing interval."
      },
      "amount": {
        "type": "number",
        "minimum": 0.0,
        "description": "The charge amount for the initial period or recurring interval."
      },
      "currency": {
        "type": "string",
        "minLength": 3,
        "maxLength": 3,
        "description": "ISO 4217 three-letter currency code (e.g., 'USD', 'EUR')."
      },
      "is_trial": {
        "type": "boolean",
        "description": "Indicates whether the purchase starts with a zero-cost or discounted trial period."
      },
      "trial_days": {
        "type": "integer",
        "minimum": 1,
        "description": "Length of the trial period in days. Required if is_trial is true."
      },
      "auto_cancellation_lead_days": {
        "type": "integer",
        "default": 2,
        "description": "Days before trial conversion or contract renewal to trigger automated cancellation or mandate expiration."
      },
      "ap2_intent_mandate": {
        "type": "string",
        "description": "Optional cryptographically signed AP2 Intent Mandate token from the user principal."
      }
    }
  },
  "returns": {
    "type": "object",
    "required": ["decision", "transaction_ref"],
    "properties": {
      "decision": {
        "type": "string",
        "enum": ["APPROVED", "SUSPENDED_AWAITING_HUMAN", "REJECTED_POLICY_VIOLATION"],
        "description": "Validation result."
      },
      "transaction_ref": {
        "type": "string",
        "format": "uuid",
        "description": "Internal reference tracking the lifecycle of this authorization."
      },
      "rejection_reason": {
        "type": "string",
        "description": "Deterministic policy violation details if decision is REJECTED_POLICY_VIOLATION."
      },
      "approval_channel": {
        "type": "string",
        "description": "Webhook or communication channel used if transaction is SUSPENDED_AWAITING_HUMAN."
      },
      "delegated_token": {
        "type": "string",
        "description": "Scoped, single-use payment token (Skyfire/AP2) issued only when decision is APPROVED."
      }
    }
  }
}
```

---

### 1.2. `verify_ap2_mandate`
Validates the cryptographic integrity, spending caps, and authorization scope of an AP2 Payment or Checkout Mandate.

```json
{
  "name": "verify_ap2_mandate",
  "description": "Cryptographically validates an AP2 signed mandate JWT, ensuring signature provenance, validity period, spending cap limits, and merchant domain allowlists.",
  "parameters": {
    "type": "object",
    "required": ["mandate_jwt", "target_merchant_id", "transaction_amount", "currency"],
    "properties": {
      "mandate_jwt": {
        "type": "string",
        "description": "Compact serialized JWS containing AP2 mandate claims."
      },
      "target_merchant_id": {
        "type": "string",
        "description": "The recipient merchant identifier to match against the mandate's allowed merchants."
      },
      "transaction_amount": {
        "type": "number",
        "minimum": 0.0,
        "description": "Amount to be verified against the mandate's maximum spending limit."
      },
      "currency": {
        "type": "string",
        "minLength": 3,
        "maxLength": 3,
        "description": "ISO 4217 currency code."
      }
    }
  },
  "returns": {
    "type": "object",
    "required": ["is_valid", "mandate_id", "signer_principal_id"],
    "properties": {
      "is_valid": {
        "type": "boolean",
        "description": "True if the cryptographic signature is verified and all parameter assertions pass."
      },
      "mandate_id": {
        "type": "string",
        "format": "uuid",
        "description": "Unique identifier of the mandate extracted from the token payload."
      },
      "signer_principal_id": {
        "type": "string",
        "description": "Identity of the human principal or authorized parent agent who signed the mandate."
      },
      "remaining_allowance": {
        "type": "number",
        "description": "Remaining spend capacity permitted under this mandate."
      },
      "verification_error": {
        "type": "string",
        "description": "Specific cryptographic or semantic error if is_valid is false."
      }
    }
  }
}
```

---

### 1.3. `schedule_cancellation_guard`
Registers an automated cancellation or downgrade execution task against a vendor subscription before auto-renewal lock-in occurs.

```json
{
  "name": "schedule_cancellation_guard",
  "description": "Registers a deterministic cron/queue trigger to execute cancellation workflows via APIMatic-generated wrappers or PayPal MCP dispute tools before trial expiration.",
  "parameters": {
    "type": "object",
    "required": [
      "subscription_id",
      "target_cancellation_timestamp",
      "execution_method"
    ],
    "properties": {
      "subscription_id": {
        "type": "string",
        "format": "uuid",
        "description": "SubGuard internal subscription record identifier."
      },
      "target_cancellation_timestamp": {
        "type": "string",
        "format": "date-time",
        "description": "ISO 8601 UTC timestamp indicating when cancellation must execute."
      },
      "execution_method": {
        "type": "string",
        "enum": ["PAYPAL_MCP_API", "APIMATIC_VENDOR_SDK", "BROWSER_AUTOMATION_FALLBACK"],
        "description": "Underlying mechanism used to terminate the subscription."
      },
      "require_pre_cancellation_prompt": {
        "type": "boolean",
        "default": true,
        "description": "If true, sends an alert via Zapier 24 hours prior to cancellation allowing the user to extend."
      }
    }
  },
  "returns": {
    "type": "object",
    "required": ["guard_id", "status", "scheduled_execution_time"],
    "properties": {
      "guard_id": {
        "type": "string",
        "format": "uuid",
        "description": "Identifier for the active cancellation job."
      },
      "status": {
        "type": "string",
        "enum": ["ARMED", "PENDING_NOTIFICATION", "BYPASSED"],
        "description": "Initial lifecycle state of the guard."
      },
      "scheduled_execution_time": {
        "type": "string",
        "format": "date-time",
        "description": "Confirmed UTC execution timestamp."
      }
    }
  }
}
```

---

## 2. PostgreSQL Relational Database Schema

```sql
-- SubGuard Core Relational Schema
-- Target: PostgreSQL 15+
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Principals & User Accounts
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  organization_name VARCHAR(255),
  monthly_budget_ceiling NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  public_signing_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agent Identities (Skyfire KYA Mapping)
CREATE TABLE agent_identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_name VARCHAR(128) NOT NULL,
  kya_token_hash VARCHAR(255) NOT NULL,
  max_single_transaction_limit NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cryptographic Mandates (AP2 Standard)
CREATE TYPE mandate_type AS ENUM ('INTENT', 'CART', 'PAYMENT');
CREATE TYPE mandate_status AS ENUM ('PENDING', 'ACTIVE', 'EXHAUSTED', 'REVOKED', 'EXPIRED');

CREATE TABLE ap2_mandates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  agent_id UUID NOT NULL REFERENCES agent_identities(id) ON DELETE RESTRICT,
  mandate_type mandate_type NOT NULL,
  status mandate_status NOT NULL DEFAULT 'PENDING',
  raw_jwt TEXT NOT NULL,
  max_chargeable_amount NUMERIC(12, 2) NOT NULL,
  consumed_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  allowed_merchant_patterns TEXT[] NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Managed Subscriptions
CREATE TYPE subscription_status AS ENUM ('TRIAL_ACTIVE', 'ACTIVE_RECURRING', 'PENDING_CANCELLATION', 'CANCELLED', 'EXPIRED');
CREATE TYPE billing_interval AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL', 'USAGE_BASED');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agent_identities(id) ON DELETE SET NULL,
  active_mandate_id UUID REFERENCES ap2_mandates(id) ON DELETE SET NULL,
  merchant_name VARCHAR(128) NOT NULL,
  merchant_domain VARCHAR(255) NOT NULL,
  product_tier VARCHAR(128) NOT NULL,
  billing_cycle billing_interval NOT NULL,
  recurring_amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status subscription_status NOT NULL DEFAULT 'ACTIVE_RECURRING',
  is_trial BOOLEAN NOT NULL DEFAULT FALSE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paypal_billing_agreement_id VARCHAR(128),
  external_vendor_id VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Cancellation Guards & Scheduled Actions
CREATE TYPE guard_status AS ENUM ('ARMED', 'NOTIFICATION_SENT', 'EXECUTED', 'CANCELLED_BY_USER', 'FAILED');

CREATE TABLE cancellation_guards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  scheduled_execution_time TIMESTAMP WITH TIME ZONE NOT NULL,
  lead_notification_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status guard_status NOT NULL DEFAULT 'ARMED',
  execution_handler VARCHAR(64) NOT NULL,
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Immutable Financial & Policy Audit Log (SIEM Sync)
CREATE TABLE policy_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agent_identities(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  mcp_tool_invoked VARCHAR(64) NOT NULL,
  decision VARCHAR(32) NOT NULL,
  requested_amount NUMERIC(10, 2),
  currency VARCHAR(3),
  rejection_clause VARCHAR(255),
  policy_evaluation_latency_ms NUMERIC(6, 2),
  payload_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for SLA and Query Optimization
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE status = 'ACTIVE_RECURRING';
CREATE INDEX idx_cancellation_guards_pending ON cancellation_guards(scheduled_execution_time) WHERE status = 'ARMED';
CREATE INDEX idx_audit_logs_timestamp ON policy_audit_logs(created_at);
```

---

## 3. OpenAPI 3.1 REST API Specification (FastAPI Gateway)

```yaml
openapi: 3.1.0
info:
  title: SubGuard AI Core Orchestration Gateway
  description: Core REST API for managing asynchronous mandate suspensions, SaaS discovery querying, and human-in-the-loop approvals.
  version: 1.0.0
servers:
  - url: https://subguard-core.onrender.com/v1
    description: Production gateway on Render
paths:
  /mandates/suspend:
    post:
      summary: Register a suspended transaction awaiting human confirmation
      operationId: suspendTransaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SuspendTransactionRequest'
      responses:
        '202':
          description: Mandate suspension acknowledged; approval webhook dispatched.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuspendTransactionResponse'
        '400':
          description: Invalid transaction parameters.

  /mandates/{transaction_ref}/resume:
    post:
      summary: Resume a suspended mandate with cryptographic user approval
      operationId: resumeTransaction
      parameters:
        - name: transaction_ref
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ResumeTransactionRequest'
      responses:
        '200':
          description: Mandate approved and executed via payment gateway.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResumeTransactionResponse'
        '403':
          description: Cryptographic signature mismatch or expired authorization.

  /discovery/search:
    post:
      summary: Semantic vector search for SaaS tools and ToS risk profiles
      operationId: searchSoftwareCatalog
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DiscoverySearchRequest'
      responses:
        '200':
          description: Ranked software recommendations matching user constraints.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DiscoverySearchResponse'

  /webhooks/zapier/approval-callback:
    post:
      summary: Receive out-of-band user approval responses from Zapier
      operationId: handleZapierCallback
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ZapierApprovalPayload'
      responses:
        '200':
          description: Callback processed successfully.

components:
  schemas:
    SuspendTransactionRequest:
      type: object
      required:
        - agent_id
        - user_id
        - amount
        - currency
        - merchant_name
        - policy_violation_reason
      properties:
        agent_id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        amount:
          type: number
        currency:
          type: string
          example: USD
        merchant_name:
          type: string
        policy_violation_reason:
          type: string
          example: "Single transaction exceeds autonomous threshold of $50.00"

    SuspendTransactionResponse:
      type: object
      required:
        - transaction_ref
        - status
        - expires_at
      properties:
        transaction_ref:
          type: string
          format: uuid
        status:
          type: string
          example: SUSPENDED_AWAITING_HUMAN
        expires_at:
          type: string
          format: date-time

    ResumeTransactionRequest:
      type: object
      required:
        - action
        - signed_mandate_signature
      properties:
        action:
          type: string
          enum: [APPROVE, REJECT]
        signed_mandate_signature:
          type: string
          description: Ed25519 signature of the transaction_ref generated by the user's private key.

    ResumeTransactionResponse:
      type: object
      required:
        - transaction_ref
        - execution_status
      properties:
        transaction_ref:
          type: string
          format: uuid
        execution_status:
          type: string
          enum: [SUCCESSFUL_CHARGE, REJECTED, GATEWAY_ERROR]
        paypal_payment_id:
          type: string

    DiscoverySearchRequest:
      type: object
      required:
        - query
      properties:
        query:
          type: string
          example: "SOC-2 compliant vector database under $50 monthly"
        max_monthly_budget:
          type: number
        required_features:
          type: array
          items:
            type: string

    DiscoverySearchResponse:
      type: object
      required:
        - matches
      properties:
        matches:
          type: array
          items:
            type: object
            properties:
              product_name:
                type: string
              estimated_monthly_cost:
                type: number
              tos_risk_score:
                type: number
                description: Score from 0.0 to 1.0 evaluating auto-renewal lock-in severity.
              dark_pattern_warnings:
                type: array
                items:
                  type: string

    ZapierApprovalPayload:
      type: object
      required:
        - transaction_ref
        - user_decision
      properties:
        transaction_ref:
          type: string
          format: uuid
        user_decision:
          type: string
          enum: [APPROVED, REJECTED]
        channel:
          type: string
          example: "slack_interactive_button"
```

---

## 4. AP2 Cryptographic Mandate Specification

SubGuard implements the Agent Payments Protocol (AP2) format using cryptographically verifiable JWTs (RFC 7519) signed via asymmetric Ed25519 keypairs.

### 4.1. Mandate Header (JWS)
```json
{
  "alg": "EdDSA",
  "typ": "AP2-Mandate+JWT",
  "kid": "subguard-principal-key-2026-001"
}
```

### 4.2. Mandate Payload (Claims)
```json
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
