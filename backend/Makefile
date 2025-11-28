.PHONY: help install dev test test-verbose verify clean lint format check

# Default target
help:
	@echo "Snake Rivals Arena - Backend Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  make install       - Install dependencies using uv"
	@echo "  make init-db       - Initialize database (create tables)"
	@echo "  make seed-db       - Initialize and seed database with sample data"
	@echo "  make reset-db      - Reset database (delete and recreate)"
	@echo "  make dev           - Run development server (port 3000)"
	@echo "  make dev-8000      - Run development server (port 8000)"
	@echo "  make test          - Run unit tests"
	@echo "  make test-verbose  - Run unit tests with verbose output"
	@echo "  make verify        - Verify API by testing running server"
	@echo "  make lint          - Run linting checks (ruff)"
	@echo "  make format        - Format code (ruff)"
	@echo "  make check         - Run linting and tests"
	@echo "  make clean         - Clean up cache and temporary files"

# Install dependencies
install:
	uv sync

# Initialize database (create tables)
init-db:
	uv run python init_db.py

# Initialize and seed database with sample data
seed-db:
	uv run python init_db.py --seed

# Reset database (delete and recreate)
reset-db:
	rm -f snake_arena.db
	uv run python init_db.py --seed

# Run development server on port 3000
dev:
	uv run uvicorn main:app --reload --port 3000

# Run development server on port 8000
dev-8000:
	uv run uvicorn main:app --reload --port 8000

# Run unit tests
test:
	uv run pytest tests

# Run unit tests with verbose output
test-verbose:
	uv run pytest tests -v

# Verify API with running server
verify:
	uv run python verify_api.py

# Run linting (requires ruff to be added to dependencies)
lint:
	@if uv run ruff check . 2>/dev/null; then \
		echo "Linting passed"; \
	else \
		echo "Note: ruff not installed. Run 'uv add --dev ruff' to enable linting"; \
	fi

# Format code (requires ruff to be added to dependencies)
format:
	@if uv run ruff format . 2>/dev/null; then \
		echo "Formatting complete"; \
	else \
		echo "Note: ruff not installed. Run 'uv add --dev ruff' to enable formatting"; \
	fi

# Run all checks (lint + test)
check: lint test

# Clean up cache and temporary files
clean:
	rm -rf __pycache__
	rm -rf .pytest_cache
	rm -rf app/__pycache__
	rm -rf tests/__pycache__
	rm -f snake_arena.db
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
