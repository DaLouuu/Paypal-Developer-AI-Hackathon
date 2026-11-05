# SubGuard AI: Dual-Track Antigravity Engineering Workflow

Welcome to the collaborative pair-programming workflow for **SubGuard AI** (Agentic Subscription Management System). This directory contains the complete blueprints, single sources of truth, phase-by-phase prompts, checkpoints, and quality gates to enable two engineers to work in parallel using separate Antigravity instances with **zero git collisions and guaranteed cross-compatibility**.

---

## 📁 Directory Structure

```
workflow/
├── README.md                      # This onboarding guide
├── COLLABORATION_PROTOCOL.md      # Rules of engagement, directory isolation, git policies
├── contracts/                     # THE SINGLE SOURCES OF TRUTH
│   ├── API_CONTRACTS.md           # Frozen JSON-RPC, PostgreSQL DDL, REST OpenAPI, AP2 JWT specs
│   └── ARCHITECTURE_SPEC.md       # High-level architecture, partner tech matrix, dataflows
│
├── track_alpha_core/              # 👤 FOR YOU (Engineer 1)
│   ├── GUIDE.md                   # Full step-by-step walkthrough & execution rules
│   ├── CHECKPOINTS.md             # Strict automated & manual verification gates
│   └── prompts/                   # Sequential Antigravity prompts
│       ├── 01_phase1_research_discovery.md
│       ├── 02_phase2_architecture_contracts.md
│       ├── 03_phase3_product_rfc.md
│       ├── 04_phase4_core_implementation.md
│       ├── 05_phase5_evaluation_benchmarks.md
│       └── 06_phase6_hardening_deployment.md
│
└── track_beta_discovery_ui/       # 👥 FOR YOUR TEAMMATE (Engineer 2)
    ├── GUIDE.md                   # Full step-by-step walkthrough & execution rules
    ├── CHECKPOINTS.md             # Strict automated & manual verification gates
    └── prompts/                   # Sequential Antigravity prompts
        ├── 01_phase1_research_discovery.md
        ├── 02_phase2_indexing_and_wireframes.md
        ├── 03_phase3_pitch_deck.md
        ├── 04_phase4_integrations_frontend.md
        ├── 05_phase5_evaluation_benchmarks.md
        └── 06_phase6_hardening_deployment.md
```

---

## 🚀 Quick Start for Both Engineers

### 1. Assign Your Tracks
* **Engineer 1 (You):** Work from [`track_alpha_core/`](track_alpha_core/GUIDE.md). You own the core FastMCP proxy, deterministic policy engine, AP2 mandates, and PostgreSQL database.
* **Engineer 2 (Teammate):** Work from [`track_beta_discovery_ui/`](track_beta_discovery_ui/GUIDE.md). They own the Elasticsearch vector RAG discovery, ToS contract analyzer, APIMatic wrappers, Zapier webhooks, and React/AG Grid/Bryntum frontend.

### 2. Read the Single Sources of Truth
Before running any code or prompt, both engineers must read:
1. [`contracts/API_CONTRACTS.md`](contracts/API_CONTRACTS.md) - All schemas, types, and paths are locked here.
2. [`COLLABORATION_PROTOCOL.md`](COLLABORATION_PROTOCOL.md) - Strict directory isolation and lockfile policies.

### 3. How to Run with Antigravity
1. Open your Antigravity instance in this repository.
2. Open the prompt file corresponding to your current phase (e.g. `prompts/01_phase1_...md`).
3. Feed the markdown content into Antigravity.
4. When Antigravity completes the deliverables, run the verification commands specified in your track's `CHECKPOINTS.md`.
5. Once your checkpoint passes, commit to your feature branch (`feat/alpha-*` or `feat/beta-*`).
6. At merge gates, sync into `main` via pull requests.
