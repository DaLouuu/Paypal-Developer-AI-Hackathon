# Antigravity Prompt: Track Beta - Phase 2 (Indexing Schemas & UI Wireframes)

**Role:** Discovery Architect & Frontend Lead for SubGuard AI  
**Track:** Track Beta (Discovery, Integrations & Frontend)  
**Objective:** Establish Elasticsearch index mappings, define third-party API integration contracts, and create UI dashboard wireframes.

---

### Execution Instructions:

1. **Design Elasticsearch Mappings**:
   - Define index schema for `software_catalog`:
     - Fields: `product_id`, `product_name`, `vendor_domain`, `category`, `features` (text), `pricing_tier` (keyword), `monthly_cost` (float), `embedding` (dense_vector, dim=1536).
   - Define index schema for `tos_clauses`:
     - Fields: `clause_id`, `vendor_domain`, `raw_text`, `clause_type` (`auto_renewal`, `cancellation_window`, `penalty_fee`), `risk_score` (float 0.0 - 1.0).

2. **Design APIMatic & Zapier Schemas**:
   - Define standardized OpenAPI request/response models for third-party subscription cancellation endpoints.
   - Define Zapier webhook payload for `/webhooks/zapier/approval-callback` (matching `workflow/contracts/API_CONTRACTS.md`).

3. **Design Frontend Wireframes & Data Bindings**:
   - AG Grid column definitions: Vendor, Plan, Monthly Burn, Active Seats, Status (Active/Trial/Suspended), Days to Renewal, Actions (Cancel/Downgrade).
   - Bryntum Scheduler view: Horizontal timeline plotting trial expiration dates, 30/60/90-day cancellation notice windows, and renewal triggers.

4. **Lock Contracts**:
   - Coordinate with Track Alpha to verify that `/discovery/search` matches the schema in `workflow/contracts/API_CONTRACTS.md`.

---

### Quality Gate:
Elasticsearch mapping definitions and REST JSON schemas must be valid JSON and adhere to OpenAPI 3.1 standards.
