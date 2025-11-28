# Snake Rivals Arena - Docker Setup

This guide explains how to run the Snake Rivals Arena application using Docker Compose.

## Quick Start

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at:
- **Application**: http://localhost (Frontend + API)

## Services

### 1. PostgreSQL Database
- **Container**: `snake-arena-postgres`
- **Port**: 5432
- **Database**: `snake_arena`
- **User**: `snakearena`
- **Password**: `snakearena_password`

Data is persisted in a Docker volume named `postgres_data`.

### 2. Unified App (Frontend + Backend)
- **Container**: `snake-arena-app`
- **Port**: 80
- **Technology**: 
  - **Frontend**: React, Vite, Nginx
  - **Backend**: Python 3.12, FastAPI, SQLAlchemy
  - **Process Manager**: Supervisor

The unified container:
- Builds the frontend using Node.js
- Builds the backend using Python/uv
- Runs Nginx to serve the frontend and proxy API requests
- Runs Uvicorn for the backend API
- Uses Supervisor to manage both processes
- Automatically initializes the database on startup

## Docker Commands

### Start Services
```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Check Status
```bash
# List running containers
docker-compose ps
```

### Execute Commands in Containers
```bash
# Access app shell
docker-compose exec app bash

# Access PostgreSQL
docker-compose exec postgres psql -U snakearena -d snake_arena
```

## Architecture

```
┌─────────────────────┐
│   Browser           │
│   localhost:80      │
└──────────┬──────────┘
           │
           │ HTTP
           │
┌──────────▼──────────┐
│   Unified App       │
│   Port 80           │
│                     │
│  ┌───────────────┐  │
│  │     Nginx     │  │
│  └───────┬───────┘  │
│          │ Proxy    │
│  ┌───────▼───────┐  │
│  │    Backend    │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │
           │ SQL
           │
┌──────────▼──────────┐
│   PostgreSQL        │
│   Port 5432         │
└─────────────────────┘
```

## Troubleshooting

### Services Won't Start

Check logs:
```bash
docker-compose logs -f
```

### Database Connection Issues

Ensure PostgreSQL is healthy:
```bash
docker-compose ps postgres
```

### Clean Slate

Remove everything and start fresh:
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build
```
