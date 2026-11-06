# SubGuard AI: Frontend Wireframes, AG Grid Specs & Bryntum Timeline Data Bindings
**Version:** 1.0.0  
**Track:** Track Beta (Discovery, Integrations & Frontend)  
**Target Runtimes:** React 18 / AG Grid Enterprise/Community / Bryntum Calendar & Scheduler / TailwindCSS

---

## 1. High-Level Dashboard Layout Wireframe

```
+-----------------------------------------------------------------------------------------------------------------------+
|  🛡️ SubGuard AI  |  🔍 [ Natural-language SaaS search: "cheap SOC-2 vector db under $30/mo" ]  |  👤 Founder (Admin)  |
+-----------------------------------------------------------------------------------------------------------------------+
|  KPI SUMMARY CARDS:                                                                                                   |
|  [ Total Monthly Burn: $1,420.00 ]   [ Active Subscriptions: 14 ]   [ Trials at Risk: 3 ]   [ Pending Suspensions: 1 ] |
+-----------------------------------------------------------------------------------------------------------------------+
|  SECTION A: ACTIVE SUBSCRIPTION TELEMETRY & SEAT GOVERNANCE (AG GRID)                                                |
|  +-----------------------------------------------------------------------------------------------------------------+  |
|  | Vendor / Product | Plan Tier | Seats | Monthly Burn | Next Renewal | State Badge   | Risk Score | Quick Actions  |  |
|  |------------------+-----------+-------+--------------+--------------+---------------+------------+----------------|  |
|  | Notion Inc.      | Team Plus | 8     | $80.00       | Nov 18 (12d) | ACTIVE        | 0.12 (Low) | [Manage Seats] |  |
|  | OpenAI API       | Usage Pro | --    | $340.50      | Dec 01 (25d) | ACTIVE        | 0.05 (Low) | [Adjust Cap]   |  |
|  | Cursor IDE       | Business  | 4     | $160.00      | Nov 10 (4d)  | TRIAL_ACTIVE  | 0.85 (High)| [Arm Cancel]   |  |
|  | DataDog APM      | Pro Infra | --    | $75.00       | Pending      | SUSPENDED_HITL| 0.40 (Med) | [Approve/Deny] |  |
|  +-----------------------------------------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------------------------------------+
|  SECTION B: MULTI-HORIZON CONTRACT LIFECYCLE & CANCELLATION TIMELINE (BRYNTUM SCHEDULER)                            |
|  Timeline Scale: [ Day | Week | Month | Quarter ]                                                                     |
|  Nov 2026:                     W1 (Nov 1-7)      W2 (Nov 8-14)       W3 (Nov 15-21)      W4 (Nov 22-28)               |
|  +-----------------------------------------------------------------------------------------------------------------+  |
|  | Cursor IDE (Trial)       | [=== Active Trial ===] ⚠️ [48h Guard Trigger]                                        |  |
|  | Notion (Renewal)         |                                     | [===== 30-Day Notice Window =====] 🔒 Renewal |  |
|  | Figma Org (Annual)       | [============================== 60-Day Lock-in Window =============================]  |  |
|  +-----------------------------------------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------------------------------------+
|  SECTION C: SEMANTIC DISCOVERY & ToS RISK INSPECTOR PANEL                                                              |
|  Search Result: Pinecone Serverless | Match Score: 94% | Cost: $25.00/mo | ToS Risk: 0.18 (Auto-cancel available via API)|
+-----------------------------------------------------------------------------------------------------------------------+
```

---

## 2. AG Grid Component Specification: `SubscriptionTable.jsx`

### 2.1 Column Definitions (`ColDef[]`)
```javascript
export const subscriptionColumnDefs = [
  {
    field: "vendor_product",
    headerName: "Vendor & Product",
    width: 220,
    pinned: "left",
    cellRenderer: (params) => {
      return `
        <div class="flex items-center space-x-2">
          <img src="${params.data.logo_url || '/vendor-placeholder.svg'}" class="w-5 h-5 rounded" />
          <span class="font-medium text-slate-900">${params.data.product_name}</span>
          <span class="text-xs text-slate-500">(${params.data.merchant_domain})</span>
        </div>
      `;
    },
    filter: "agTextColumnFilter",
    sortable: true
  },
  {
    field: "product_tier",
    headerName: "Plan Tier",
    width: 140,
    filter: true
  },
  {
    field: "active_seats",
    headerName: "Seats",
    width: 90,
    type: "numericColumn",
    valueFormatter: (params) => params.value ? `${params.value} seats` : "N/A"
  },
  {
    field: "recurring_amount",
    headerName: "Recurring Burn",
    width: 140,
    type: "numericColumn",
    valueFormatter: (params) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: params.data.currency || "USD"
      }).format(params.value);
    },
    sortable: true
  },
  {
    field: "billing_cycle",
    headerName: "Cadence",
    width: 110,
    filter: "agSetColumnFilter"
  },
  {
    field: "next_billing_date",
    headerName: "Next Renewal",
    width: 150,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    sortable: true
  },
  {
    field: "status",
    headerName: "Lifecycle State",
    width: 170,
    cellRenderer: (params) => {
      const badgeClasses = {
        ACTIVE_RECURRING: "bg-emerald-100 text-emerald-800 border-emerald-300",
        TRIAL_ACTIVE: "bg-amber-100 text-amber-800 border-amber-300 animate-pulse",
        SUSPENDED_AWAITING_HUMAN: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        PENDING_CANCELLATION: "bg-orange-100 text-orange-800 border-orange-300",
        CANCELLED: "bg-slate-100 text-slate-600 border-slate-300"
      };
      return `<span class="px-2 py-1 text-xs rounded border ${badgeClasses[params.value] || 'bg-gray-100'}">${params.value}</span>`;
    }
  },
  {
    field: "tos_risk_score",
    headerName: "ToS Risk",
    width: 120,
    cellRenderer: (params) => {
      const score = params.value ?? 0.0;
      const color = score > 0.6 ? "text-rose-600 font-bold" : (score > 0.3 ? "text-amber-600" : "text-emerald-600");
      return `<span class="${color}">${(score * 100).toFixed(0)}% Risk</span>`;
    }
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 160,
    pinned: "right",
    cellRenderer: "SubscriptionActionButtons"
  }
];
```

### 2.2 Grid Options & Virtualization Benchmarks
- `rowModelType: "clientSide"` with virtualized DOM row rendering.
- `rowBuffer: 20` to guarantee butter-smooth 60 FPS scrolling with >500 active subscriptions.
- Pinned bottom row computing:
  - Aggregate total monthly burn rate.
  - Active seat count tally.
  - Immediate trial cancellation exposure sum.

---

## 3. Bryntum Scheduler Specification: `RenewalTimeline.jsx`

### 3.1 Resource & Event Store Bindings
```typescript
interface BryntumSubscriptionResource {
  id: string; // Subscription UUID
  name: string; // e.g., "Cursor IDE (agt_7719f911)"
  vendor: string;
  category: string;
}

interface BryntumTimelineEvent {
  id: string;
  resourceId: string; // References Subscription ID
  name: string; // "14-Day Free Trial", "30-Day Cancellation Notice Window"
  startDate: string; // ISO 8601 UTC
  endDate: string; // ISO 8601 UTC
  eventColor: "amber" | "rose" | "blue" | "emerald";
  eventType: "TRIAL_PERIOD" | "NOTICE_WINDOW" | "AUTO_GUARD_TRIGGER" | "RENEWAL_LOCKIN";
  isDraggable: boolean;
}
```

### 3.2 Visual Milestone Zones
1. **Active Trial Horizon (Amber Bar):**
   - Marks duration between `created_at` and `trial_end_date`.
2. **Auto-Cancellation Guard Marker (Flashing Shield Icon):**
   - Positioned at `trial_end_date - 48 hours`.
   - On hover: Displays execution handler (e.g. `PAYPAL_MCP_API` or `APIMATIC_VENDOR_SDK`).
   - Dragging the marker adjusts `lead_notification_time` and sends real-time PATCH request to the backend.
3. **Mandatory Notice Windows (30/60/90 Days):**
   - Shaded restriction zone prior to `next_billing_date` based on the indexed ToS contract clauses.

---

## 4. Semantic Discovery & ToS Risk Panel: `DiscoverySearch.jsx`

### 4.1 Natural Language Query Flow
1. User enters natural language request: e.g., *"We need an automated error tracking tool under $50/mo with Slack alerts"*.
2. Component debounces and dispatches `POST /discovery/search`.
3. Cards render top 3 ranked tools showing:
   - Pricing tier comparison against current organizational budget.
   - ToS Risk Radar (flags phone-call cancellation requirements, auto-renewal traps, or mandatory arbitration).
   - One-Click Purchase Delegation: Issues scoped AP2 mandate directly to purchaser agent.

---

## 5. Phase 2 Verification & Freeze Sign-Off
All JSON schemas and component definitions in this specification comply with OpenAPI 3.1 standards and match the contract definitions in [`workflow/contracts/API_CONTRACTS.md`](../workflow/contracts/API_CONTRACTS.md).

