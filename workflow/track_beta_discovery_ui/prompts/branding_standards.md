# SUBGUARD AI: CUSTOMER-CENTRIC E-COMMERCE-INSPIRED PRODUCT REDESIGN

## ROLE

Act as a Principal Product Designer, UX Strategist, Brand Designer, and Senior React Engineer.

You are redesigning SubGuard AI, an autonomous subscription governance, SaaS discovery, and AI agent spending protection platform.

The previous redesign improved the visual styling but did not establish a distinctive product identity or sufficiently intuitive customer experience.

We need a different design approach.

**Design SubGuard AI as a premium intelligent SaaS marketplace combined with an autonomous subscription management and financial protection platform.**

Take inspiration from the familiarity of e-commerce platforms, the clarity of modern consumer applications, and the sophistication of fintech products.

Do not blindly follow the typical developer dashboard, Linear-style interface, or generic enterprise admin template.

The interface must be visually distinctive, aesthetically pleasing, approachable, and easy to navigate, even for customers who are not technically sophisticated.

The objective is to make the product immediately understandable while preserving all existing technical capabilities.

---

# 1. PRODUCT POSITIONING

SubGuard AI is an autonomous software purchasing and subscription governance platform.

It helps users:

1. Discover software tools that match their requirements.
2. Compare products, pricing, compliance, and contractual risks.
3. Provision software subscriptions.
4. Monitor recurring software expenses and active licenses.
5. Govern autonomous AI agent spending.
6. Prevent unwanted renewals and forgotten free trials through deterministic cancellation safeguards.

Its unique value proposition is:

**Shop for software intelligently. Govern every commitment. Stay protected automatically.**

The product combines familiar e-commerce purchasing experiences with intelligent financial governance.

It should feel like an intelligent marketplace where customers can discover and manage their software purchases, with an autonomous financial protection layer operating in the background.

It is NOT:
- A conventional subscription tracker.
- A generic financial dashboard.
- A developer-only administration console.
- A traditional SaaS directory.
- A generic AI agent monitoring dashboard.

---

# 2. DESIGN PHILOSOPHY: FAMILIARITY FIRST, INTELLIGENCE SECOND

The most important UX principle is that customers should not have to understand the backend architecture to use the application.

Design around customer goals and familiar mental models.

Use e-commerce conventions where appropriate:

- Product discovery.
- Product categories.
- Search and filtering.
- Product comparison.
- Pricing information.
- Saved products or shortlists.
- Provisioning and approval.
- Purchase and subscription management.
- Recurring payment visibility.
- Cancellation and renewal management.

Use consumer financial application conventions for:

- Spending summaries.
- Upcoming payments.
- Transaction histories.
- Spending protection.
- Authorization requests.
- Financial activity.

However, do not make the product look like an ordinary online shopping website.

This is a premium B2B SaaS platform. The e-commerce inspiration should be expressed through its information architecture, interaction patterns, product presentation, and visual identity.

The overall experience should feel polished, trustworthy, intelligent, and approachable.

---

# 3. CREATE A DISTINCTIVE SUBGUARD BRAND IDENTITY

Develop a recognizable brand system.

Do not simply use a generic shield icon next to the product name.

Explore a brand mark that combines the concepts of:

- Shopping or purchasing.
- Software subscriptions.
- Financial protection.
- Intelligent automation.

Possible creative directions:

- A shopping bag integrated with a protective shield.
- A protected purchase or transaction symbol.
- A geometric shield with a subtle shopping or receipt reference.
- An abstract combination of a shopping basket and security check.
- A distinctive symbol representing protected recurring payments.

Create an identity that is recognizable at small sizes and works as an application icon.

## Brand personality

SubGuard should feel:

- Intelligent.
- Protective.
- Modern.
- Reliable.
- Approachable.
- Financially responsible.

Avoid making it look overly corporate, overly technical, or overly playful.

## Visual direction

Explore a premium e-commerce and fintech-inspired aesthetic.

Suggested palette:

- Midnight navy: #17243D
- Deep slate: #293A55
- Electric blue: #4568F5
- Guard green: #22B982
- Warm white: #FAFBFC
- Light slate: #F0F3F8
- Soft amber: #E9A23B
- Restrained red: #D9535D

Use color intentionally to distinguish discovery, financial activity, and protection.

Typography should be modern, readable, and approachable. Consider Inter or Geist.

Use tabular numerals for prices, financial metrics, and dates.

Do not use excessive gradients, generic glowing effects, or repetitive white cards.

---

# 4. RESTRUCTURE THE CUSTOMER NAVIGATION

Do not automatically use a Linear-style developer sidebar.

Explore a more intuitive navigation system inspired by modern shopping platforms and consumer account-management applications.

A compact top navigation may be preferable if it provides a more natural experience.

Alternatively, explore a visually distinct, simplified sidebar if usability testing or the existing application architecture makes it more appropriate.

The navigation should prioritize four customer-facing destinations:

## A. Home

A personalized subscription and spending overview.

## B. Discover

A SaaS marketplace where customers can find, evaluate, and provision software.

## C. My Subscriptions

A central location for managing active subscriptions, recurring costs, and renewals.

## D. Protection

A customer-facing control center for spending governance, cancellation safeguards, and authorization requests.

Activity and audit history should be accessible through the relevant areas or a clearly identifiable secondary navigation element.

Do not introduce navigation items that lead to nonexistent functionality.

Inspect the existing implementation and map actual features to the proposed navigation.

The objective is to minimize the customer's cognitive load.

A first-time user should understand where to go without needing instructions.

---

# 5. HOMEPAGE: AN ACTION-ORIENTED CUSTOMER DASHBOARD

The homepage is the most important UX improvement.

Do not make it a collection of generic KPI cards.

The homepage should immediately answer:

1. What am I spending?
2. What needs my attention?
3. What is SubGuard protecting?
4. What can I do next?

Use an approachable introduction such as:

**Your software, under control.**

Supporting description:

"Discover better software, manage your subscriptions, and let SubGuard protect you from unwanted spending."

## Recommended homepage composition

### A. Financial overview

Give appropriate prominence to:

- Total Monthly Software Spend.
- Number of Active Subscriptions.
- Upcoming Billing Events.
- Trials Approaching Expiration.

Use a visually interesting financial summary rather than four identical metric cards.

### B. Attention required

Introduce a dedicated section for important events.

Examples:

- A trial approaching its renewal deadline.
- An agent spending request awaiting authorization.
- A subscription with elevated ToS risk.
- A suspended mandate requiring human approval.

Each alert should explain the issue and provide a relevant next action.

Do not overwhelm users with alerts that do not require attention.

### C. Quick actions

Provide clear, customer-oriented entry points:

- Discover Software.
- Manage Subscriptions.
- Review Spending Requests.
- Check Cancellation Protection.

Use intuitive icons, short descriptions, and clear interaction affordances.

### D. Protection overview

Show a concise summary of the autonomous protection mechanism.

Explain that SubGuard monitors subscription commitments and applies predefined spending and cancellation guardrails.

Avoid exposing low-level infrastructure terminology on the main homepage unless the user explicitly wants technical details.

---

# 6. DISCOVER: BUILD AN INTELLIGENT SAAS MARKETPLACE

Redesign `src/components/DiscoverySearch.jsx`.

This should be one of the most visually engaging parts of the application.

The experience should resemble a premium marketplace for software products.

## Discovery landing experience

Include:

- Prominent natural-language search.
- Suggested search examples.
- SaaS product categories.
- Monthly budget filter.
- SOC-2 compliance filter.
- Search and filtering controls.
- Relevant search result count.

Example searches:

- Find SOC-2 compliant vector databases under $50/month.
- Find affordable AI coding assistants for a small development team.
- Compare managed database services with predictable monthly pricing.

The search should feel intelligent and approachable.

## Product categories

Where supported by the available product catalog, use recognizable categories such as:

- AI & Machine Learning.
- Developer Tools.
- Databases & Infrastructure.
- Productivity.
- Analytics & Monitoring.
- Security.

Do not hardcode categories as if they represent a complete live catalog if the backend does not support them.

## Product cards

Create attractive product cards inspired by premium e-commerce interfaces.

Each card should contain:

- Vendor logo or recognizable identity.
- Product name.
- Vendor domain.
- Category.
- Short product description.
- Pricing tier.
- Monthly cost.
- SOC-2 compliance indicator.
- ToS risk classification.
- Dark-pattern warnings.
- Provision action.

Make pricing prominent.

Display risk information clearly without allowing warning indicators to overwhelm the product presentation.

Use meaningful visual differentiation between low-, moderate-, and high-risk products.

## Product comparison

If the existing data and search functionality allow it, implement a shortlist or comparison experience.

Customers should be able to compare relevant product attributes before deciding to provision a subscription.

Avoid inventing backend capabilities if comparison requires unsupported API functionality.

---

# 7. MY SUBSCRIPTIONS: MAKE SOFTWARE MANAGEMENT INTUITIVE

Redesign `src/components/SubscriptionTable.jsx`.

The subscription management experience should feel familiar to customers who regularly manage purchases and recurring services.

Do not make a dense AG Grid the only way customers can understand their subscriptions.

Explore a hybrid presentation:

### Default view: Subscription cards or compact rows

Show:
- Vendor identity.
- Product name.
- Subscription tier.
- Number of seats.
- Recurring amount.
- Billing cadence.
- Next billing date.
- Lifecycle status.
- Relevant action.

Each subscription should be easy to identify and understand.

### Detailed view: Financial data grid

Retain AG Grid v32 for users who need more detailed financial information.

Provide an intuitive view switcher if appropriate.

The detailed grid must retain:
- Vendor and Product.
- Tier.
- Seats.
- Recurring Burn.
- Billing Cadence.
- Renewal / End Date.
- Lifecycle State.
- ToS Risk.
- Quick Actions.

Improve:
- Column sizing.
- Table density.
- Financial formatting.
- Row hover states.
- Vendor identification.
- Status visualization.
- Responsive overflow.

Remove unnecessary empty vertical space and avoid truncated column labels where reasonably possible.

### Subscription actions

Preserve existing functionality:

- Arm Cancel.
- Approve Mandate.
- Relevant provisioning or management actions.

Use confirmation dialogs for consequential actions.

Make it clear what each action does and what happens afterward.

---

# 8. PROTECTION: MAKE AUTONOMOUS GOVERNANCE CUSTOMER-FRIENDLY

This section is where SubGuard should distinguish itself from conventional e-commerce and subscription management applications.

Create a dedicated protection experience that explains what the system is monitoring and what it is doing to protect the customer.

## Protection overview

Present information such as:

- Active spending guardrails.
- Monthly spending limit.
- Current governed spending.
- Pending agent authorization requests.
- Suspended mandates.
- Upcoming trial expiration events.
- Cancellation protection status.

Use customer-friendly descriptions rather than raw backend terminology.

Technical details may be available through expandable sections or contextual tooltips.

## Signature feature: 48-Hour Cancellation Shield

Give the cancellation protection mechanism a recognizable visual identity.

The feature should explain:

1. Which subscription is approaching expiration.
2. When its renewal or conversion deadline occurs.
3. When the deterministic 48-hour protection mechanism activates.
4. Whether cancellation is armed, pending, or awaiting approval.
5. What action the customer can take.

Use an intuitive countdown or protection timeline.

The shield should become a recognizable part of the SubGuard brand.

Avoid using a large decorative glowing red shield without explanatory context.

Distinguish actual protection states from scheduled or completed actions.

Never imply that a cancellation was completed when the backend only armed the cancellation mechanism.

---

# 9. ACTIVITY: MAKE GOVERNANCE TRANSPARENT

Create an accessible activity experience using familiar transaction-history and order-history conventions.

Show:
- Subscription provisioning events.
- Agent spending requests.
- Approved mandates.
- Suspended requests.
- Cancellation events.
- Renewal-related events.
- Relevant governance decisions.

Use chronological grouping and clear descriptions.

Make the default experience understandable to nontechnical users.

Provide expandable technical details where useful, such as transaction identifiers, mandate metadata, or audit information, if already available.

---

# 10. VISUAL AND INTERACTION DESIGN

Avoid the generic dashboard design patterns used in the previous iteration.

Specifically avoid:

- Four identical KPI cards.
- Repetitive white bordered containers.
- Large empty sections.
- Excessive rounded cards.
- Random icon backgrounds.
- Unnecessary gradients.
- Overly technical navigation labels.
- Large dashboard headings that consume excessive space.
- Dense tables as the default customer experience.
- Decorative controls without functionality.

Instead, use:

- A distinctive brand identity.
- Clear customer-oriented navigation.
- Attractive product presentation.
- Meaningful visual hierarchy.
- Carefully differentiated sections.
- Contextual actions.
- Intuitive search and filtering.
- Purposeful whitespace.
- Strong visual emphasis on pricing and financial protection.

Use subtle interactions:
- Product card hover effects.
- Search feedback.
- Filter selection states.
- Comparison interactions.
- Provision confirmation.
- Countdown updates where supported.
- Protection status transitions.
- Clear success and error feedback.

Support keyboard navigation and reduced-motion preferences.

---

# 11. TECHNICAL CONSTRAINTS

Preserve:

- React 18.
- Vite.
- JavaScript ES modules.
- ag-grid-react.
- ag-grid-community v32.
- lucide-react.
- Existing backend integrations.
- Existing API contracts.
- Existing state management where practical.

Prioritize:

- `src/App.jsx`
- `src/components/SubscriptionTable.jsx`
- `src/components/RenewalTimeline.jsx`
- `src/components/DiscoverySearch.jsx`
- `src/index.css`

You may introduce additional reusable components.

Preserve all existing subscription and discovery schemas.

Do not modify:

- FastMCP proxy interception.
- AP2 cryptographic mandate validation.
- Deterministic spending limits.
- PayPal integration.
- Skyfire integration.
- Backend cancellation and authorization logic.

All displayed values must reflect actual application data.

Do not invent historical trends, transactions, operational states, or backend capabilities.

---

# 12. IMPLEMENTATION PROCESS

Work incrementally.

Do not immediately rewrite the entire application.

## Phase 1: UX and Brand Exploration

First inspect the repository and latest screenshots.

Then establish:

1. SubGuard's new brand identity.
2. Logo and color direction.
3. Customer-oriented information architecture.
4. Homepage composition.
5. Navigation and user journey.

Before modifying all components, propose the new UX direction and implement the foundational shell.

Prioritize usability over visual novelty.

## Phase 2: Homepage and Navigation

Implement the new application shell, customer-friendly navigation, and action-oriented homepage.

Verify that customers can easily identify where to discover software, manage subscriptions, and access protection.

## Phase 3: Marketplace Experience

Redesign the discovery experience.

Prioritize product discovery, filtering, product information, contractual risk visibility, and provisioning.

## Phase 4: Subscription and Protection Experience

Redesign subscription management and the cancellation protection interface.

Retain all existing technical functionality.

## Phase 5: Final Polish and Validation

Check:
- Desktop, tablet, and mobile usability.
- Navigation clarity.
- Search and filtering.
- Subscription management.
- Provisioning.
- Approval and cancellation actions.
- Protection timeline.
- Existing backend integrations.
- Existing tests and production build.

---

# 13. FINAL UX ACCEPTANCE CRITERIA

Evaluate the redesign from the perspective of someone using SubGuard for the first time.

Can the customer immediately understand what the product does?

Can they find a SaaS product without learning the application's internal architecture?

Can they understand how much they spend on software?

Can they easily identify which subscription needs attention?

Can they understand how SubGuard protects them from unwanted renewals?

Can they distinguish between actions they can perform and actions that require authorization?

If the answer to any of these questions is no, revisit the design.

The interface must be intuitive before it is impressive.

**Final creative direction: Build SubGuard as a premium intelligent software marketplace with an integrated autonomous subscription protection experience. Make it feel familiar enough to navigate immediately, distinctive enough to remember, and sophisticated enough to inspire trust.**