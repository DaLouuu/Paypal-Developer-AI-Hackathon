# ==============================================================================
# Multi-Stage Production Dockerfile for SubGuard AI Core Engine
# Target Host: Render Web Services / Linux AMD64
# ==============================================================================

# Stage 1: Build Dependencies via uv
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:0.5.21 /uv /uvx /bin/

# Copy dependency manifests
COPY pyproject.toml uv.lock README.md /app/

# Install dependencies into virtualenv without dev packages
RUN uv sync --frozen --no-dev --no-install-project

# Copy source tree and install project package
COPY subguard/ /app/subguard/
RUN uv sync --frozen --no-dev

# ==============================================================================
# Stage 2: Minimal Runtime Container
# ==============================================================================
FROM python:3.12-slim AS runtime

WORKDIR /app

# Create non-root system user
RUN groupadd -r subguard && useradd -r -g subguard subguard

# Copy installed virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
COPY subguard/ /app/subguard/
COPY pyproject.toml /app/

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set user privileges
RUN chown -R subguard:subguard /app
USER subguard

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "subguard.mcp_proxy.server:app", "--host", "0.0.0.0", "--port", "8000"]
