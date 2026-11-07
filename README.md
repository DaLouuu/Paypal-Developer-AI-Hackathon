# SubGuard AI: Autonomous Subscription Governance & Discovery Platform

SubGuard AI is an autonomous subscription discovery, lifecycle governance, and cancellation platform specifically engineered for consumers and early-stage startups.

## Architecture
- **Track Alpha (Core & Protocols):** FastMCP proxy interceptor, deterministic policy engine (<5ms), AP2 cryptographic mandate verification (Ed25519), Skyfire KYA down-scoping, and PostgreSQL persistence.
- **Track Beta (Discovery, Integrations & Frontend):** Elasticsearch vector RAG discovery, ToS contract analyzer, APIMatic SDK wrappers, Zapier webhooks, and React/AG Grid/Bryntum frontend.

## Quick Start

### 1. Backend & Core Engine
```bash
# Install Python dependencies
uv sync --extra dev

# Run core and integration tests
pytest tests/ -v

# Start the FastMCP Orchestration Gateway (port 8000)
uvicorn subguard.mcp_proxy.server:app --reload --port 8000
```

### 2. Frontend Setup & Run

The SubGuard frontend is built with React 18, Vite, AG Grid, and Lucide icons.

#### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later (included with Node.js)

#### Installation
Navigate to the `frontend` folder and install the dependencies:
```bash
cd frontend
npm install
```

#### Run Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
- Local URL: [http://localhost:5173](http://localhost:5173)
- Network URL: Accessible across your local network via `--host` (configured in `vite.config.js`)
- Automatic API Proxy: Requests to `/v1`, `/discovery`, and `/mcp` are proxied to the backend at `http://localhost:8000`

#### Run Frontend Tests
Execute the Vitest component and integration test suite:
```bash
npm test
```
To run tests with watch mode:
```bash
npx vitest
```

#### Production Build & Preview
To create an optimized production build:
```bash
npm run build
```
Built files will be output to `frontend/dist/`.

To test and preview the production build locally:
```bash
npm run preview
```

### 3. Full-Stack Local Execution

To run the complete system locally:

1. **Terminal 1 (Backend Gateway):**
   ```bash
   uvicorn subguard.mcp_proxy.server:app --reload --port 8000
   ```

2. **Terminal 2 (Frontend Dashboard):**
   ```bash
   cd frontend
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with SubGuard AI.
