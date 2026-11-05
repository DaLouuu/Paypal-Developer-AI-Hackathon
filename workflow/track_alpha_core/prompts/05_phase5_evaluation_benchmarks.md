# Antigravity Prompt: Track Alpha - Phase 5 (Evaluation & Rigorous Benchmarks)

**Role:** Principal QA & Security Validation Engineer  
**Track:** Track Alpha (Core & Protocols)  
**Objective:** Empirically benchmark the core platform for throughput, latency, security guardrails, and adversarial prompt injection resistance.

---

### Execution Instructions:

1. **Benchmark Core Latencies**:
   - Run a load test (100 concurrent requests) measuring deterministic policy rule evaluation latency.
   - Assert p50 < 2ms, p95 < 5ms.
   - Measure FastMCP proxy roundtrip overhead (assert p95 < 45ms).

2. **Timeout & Concurrency Stress Test**:
   - Simulate 50 simultaneous suspended transactions awaiting asynchronous user authorization.
   - Verify that all 50 sessions remain idempotent, properly stored in PostgreSQL, and can be resumed with user signatures without race conditions.

3. **Security & Adversarial Testing**:
   - Execute prompt injection test cases simulating malicious SaaS checkout pages attempting to override spend limits or bypass merchant whitelists.
   - Verify that deterministic policy filters catch **100%** of over-limit transactions, completely neutralizing any LLM prompt manipulation.

4. **Compile Results**:
   - Populate Track Alpha's benchmarks into `BENCHMARK_REPORT.md` (Performance Benchmark, Robustness Matrix, Protocol Verification Compliance).

---

### Quality Gate:
The deterministic policy engine must achieve a 100% block rate on malicious over-limit transactions. p95 proxy overhead must not exceed 45ms.
