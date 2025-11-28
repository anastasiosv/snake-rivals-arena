# Multi-stage build for unified backend + frontend container
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Set API URL for production build (relative path for Nginx proxy)
ENV VITE_API_URL=/api

# Build the application
RUN npm run build

# Stage 2: Build Backend Dependencies
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS backend-builder

WORKDIR /app/backend

# Copy backend dependency files
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Stage 3: Final Runtime Image
FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend virtual environment from builder
# Must copy to the same path as builder to preserve shebangs
COPY --from=backend-builder /app/backend/.venv /app/backend/.venv

# Copy backend application code
COPY backend/ /app/backend/
WORKDIR /app/backend

# Copy frontend build from builder to Nginx html directory
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy configuration files
COPY nginx-unified.conf /etc/nginx/sites-available/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint-unified.sh /entrypoint-unified.sh

# Make entrypoint executable
RUN chmod +x /entrypoint-unified.sh

# Set environment variables
ENV PATH="/app/backend/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Expose port 80
EXPOSE 80

# Use unified entrypoint
ENTRYPOINT ["/entrypoint-unified.sh"]
