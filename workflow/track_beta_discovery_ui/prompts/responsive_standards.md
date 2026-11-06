# SUBGUARD AI: PRODUCT UX ARCHITECTURE, NAVIGATION & RESPONSIVE DESIGN

Act as a Senior Product Designer, UX Architect, and Senior React Engineer.

The Figma-generated interface has already been integrated into the existing React application. Your task is to improve the actual product experience, information architecture, navigation, and responsive behavior without unnecessarily redesigning the established visual direction.

**Primary objective: Make SubGuard intuitive for first-time customers, easy to navigate, and consistent across desktop, tablet, and mobile.**

Do not treat this as a generic dashboard optimization task. Think about how customers discover, purchase, manage, and protect software subscriptions.

## 1. FIRST: AUDIT THE EXISTING APPLICATION

Before changing code:

- Inspect the existing React components and routing.
- Review the integrated Figma implementation.
- Identify all existing features and their current entry points.
- Map each feature to its corresponding backend endpoint and state.
- Identify redundant navigation, confusing interactions, inaccessible actions, and incomplete user journeys.
- Identify which features are fully implemented versus placeholders.

Do not remove working functionality or introduce unsupported backend capabilities.

## 2. ESTABLISH A CLEAR INFORMATION ARCHITECTURE

Organize the application around four primary destinations:

### HOME
A personalized overview that answers:
- How much am I spending?
- What needs my attention?
- What is SubGuard currently protecting?
- What should I do next?

Prioritize actionable alerts, upcoming renewals, spending summaries, and relevant shortcuts.

Make the homepage context-aware using actual application data.

### DISCOVER
A software marketplace where customers can:
- Search using natural language.
- Browse SaaS categories.
- Filter by budget and SOC-2 compliance.
- Review product pricing and ToS risk.
- Inspect dark-pattern warnings.
- Compare products where supported.
- Review a purchase before provisioning.

Create a coherent discovery-to-provisioning journey.

### MY SUBSCRIPTIONS
A subscription management center with:
- All subscriptions.
- Active subscriptions.
- Active trials.
- Awaiting approval.
- Pending cancellations.

Provide understandable subscription cards, detailed subscription views, and a detailed grid for desktop users.

Make available actions contextual to the actual subscription state.

### PROTECTION
A dedicated governance center containing:
- Spending policies and limits.
- Agent authorization requests.
- AP2 mandate status.
- Cancellation safeguards.
- 48-hour trial protection.
- Suspended requests.

Clearly distinguish automated actions from actions requiring human approval.

### SECONDARY DESTINATIONS
Provide accessible entry points for:
- Activity and audit history.
- Organization and account settings.
- Notifications.

Avoid overcrowding the primary navigation.

## 3. CONNECT THE CUSTOMER JOURNEYS

The application should behave like one integrated product rather than four disconnected pages.

Implement contextual navigation between features.

Examples:

- A product discovery result should lead to its product details and provisioning flow.
- A successful provisioning action should lead to the newly created subscription.
- A trial expiration alert should link directly to the corresponding subscription and protection details.
- An agent spending violation should link to the relevant authorization request.
- A cancellation action should show its actual lifecycle status.
- An approval decision should provide clear feedback and an updated state.

Use direct navigation and contextual links instead of forcing customers through unnecessary steps.

## 4. IMPROVE INTERACTION DESIGN

Implement consistent interaction patterns throughout the application.

- Use detail pages, drawers, or modals appropriately.
- Use confirmation dialogs for financially consequential actions.
- Provide clear success, failure, loading, and pending states.
- Include useful empty states with suggested next actions.
- Provide tooltips for unfamiliar technical terminology.
- Add breadcrumbs when navigating nested detail views.
- Ensure notifications link to relevant records.
- Preserve user context when navigating between pages.
- Prevent duplicate submissions and accidental repeated actions.

Do not introduce buttons that look functional but have no actual behavior.

## 5. RESPONSIVE DESIGN

Implement responsive behavior based on actual available screen space.

### Desktop
- Full navigation.
- Multi-column marketplace layouts.
- Detailed subscription grid.
- Full contract lifecycle timeline.
- Comfortable information density.

### Tablet
- Compact navigation.
- Adaptive product grids.
- Collapsible filters.
- Condensed subscription information.
- Reorganized timeline.

### Mobile
- Bottom navigation for Home, Discover, Subscriptions, and Protection.
- Single-column product layouts.
- Search and filters in mobile-friendly drawers or bottom sheets.
- Subscription cards instead of a wide AG Grid.
- Vertically adapted or horizontally scrollable timelines.
- Full-width primary actions.
- Touch-friendly controls.
- No unintended horizontal page overflow.

Do not simply scale down desktop components. Reconsider the interaction pattern where necessary.

## 6. SUBSCRIPTION LIFECYCLE AND PROTECTION STATES

Ensure that the interface consistently communicates these states:

- ACTIVE_RECURRING
- TRIAL_ACTIVE
- SUSPENDED_AWAITING_HUMAN
- PENDING_CANCELLATION

Distinguish between:
- Scheduled cancellation.
- Cancellation armed.
- Cancellation pending.
- Cancellation completed.
- Authorization required.
- Mandate suspended.

Never represent an armed cancellation as a completed cancellation.

Use actual backend state as the source of truth.

## 7. DESIGN CONSISTENCY

Preserve the established SubGuard brand identity and integrated Figma visual direction.

Improve:
- Typography hierarchy.
- Spacing consistency.
- Navigation clarity.
- Component reuse.
- Responsive layouts.
- Status visualization.
- Accessibility.
- Interaction feedback.

Avoid introducing generic dashboard patterns, unnecessary cards, redundant metrics, or decorative elements without a functional purpose.

Use consistent design tokens and reusable components rather than scattered inline styles.

## 8. TECHNICAL CONSTRAINTS

Preserve:
- React 18 and Vite.
- Existing JavaScript modules.
- AG Grid v32.
- lucide-react.
- Existing API contracts and data schemas.
- FastMCP integration.
- AP2 cryptographic verification.
- Deterministic spending limits.
- PayPal and Skyfire integrations.
- Existing backend and cancellation logic.

Do not rewrite backend functionality to accommodate frontend design preferences.

Keep business logic separate from presentation components.

## 9. IMPLEMENTATION ORDER

Work incrementally:

1. Audit existing implementation and identify UX issues.
2. Establish navigation and information architecture.
3. Implement consistent routing and contextual navigation.
4. Improve the homepage and actionable alerts.
5. Connect discovery, product details, and provisioning.
6. Improve subscription management and contextual actions.
7. Organize protection and authorization workflows.
8. Implement responsive layouts.
9. Validate all existing interactions, API integrations, and tests.

Before implementing major structural changes, present a concise UX audit and proposed component changes.

Do not rewrite the entire application unnecessarily.

## 10. DEFINITION OF DONE

Evaluate the application as a first-time customer.

Can someone immediately understand what SubGuard does?

Can they discover a software product without understanding the technical architecture?

Can they provision a subscription without confusion?

Can they identify what they are paying for and when they will be billed?

Can they understand what SubGuard is protecting automatically?

Can they identify which actions require their approval?

Can they accomplish the same important tasks on mobile?

The final product should feel like a cohesive, premium software marketplace with an integrated autonomous subscription protection service.

**Prioritize usability, clarity, and customer confidence over feature density and visual complexity.**