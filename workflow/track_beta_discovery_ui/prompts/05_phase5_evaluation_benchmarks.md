# Antigravity Prompt: Track Beta - Phase 5 (Evaluation & Discovery Benchmarks)

**Role:** Principal QA & Performance Engineer  
**Track:** Track Beta (Discovery, Integrations & Frontend)  
**Objective:** Benchmark Elasticsearch query recall and latency, test Zapier error handling, and validate frontend grid rendering performance.

---

### Execution Instructions:

1. **Benchmark Elasticsearch Query Performance**:
   - Run 100 sample natural-language queries against indexed SaaS tools.
   - Assert p50 latency < 50ms, p95 latency < 120ms.
   - Verify that all ranked results satisfy budget and SOC-2 filtering constraints.

2. **Test Zapier Webhook Fault Tolerance**:
   - Simulate out-of-band delivery timeouts, network disconnects, and malformed approval payloads.
   - Verify that failed webhooks trigger retries and log descriptive errors without crashing the service.

3. **Frontend Rendering Stress Test**:
   - Feed AG Grid with 500+ active mock subscription items.
   - Assert virtualized scrolling maintains 60 FPS without DOM degradation.
   - Verify that Bryntum Calendar accurately renders overlapping 30/60/90-day renewal deadlines across months.

4. **Compile Results**:
   - Add your benchmarks to `BENCHMARK_REPORT.md` (Elasticsearch Search Latency & Recall, Zapier Resilience, UI Rendering Telemetry).

---

### Quality Gate:
Elasticsearch p95 query latency must be under 120ms. AG Grid virtual scrolling must render without DOM lag.
