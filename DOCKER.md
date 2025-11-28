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
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Direct Backend**: http://localhost:8000 (for debugging)

## Services

### 1. PostgreSQL Database
- **Container**: `snake-arena-postgres`
- **Port**: 5432
- **Database**: `snake_arena`
- **User**: `snakearena`
- **Password**: `snakearena_password`

Data is persisted in a Docker volume named `postgres_data`.

### 2. FastAPI Backend
- **Container**: `snake-arena-backend`
- **Port**: 8000
- **Technology**: Python 3.12, FastAPI, SQLAlchemy
- **Dependencies**: Managed with `uv`

The backend automatically:
- Waits for PostgreSQL to be ready
- Initializes database tables
- Seeds sample data on first run

### 3. Nginx Frontend
- **Container**: `snake-arena-frontend`
- **Port**: 80
- **Technology**: React, Vite, Nginx

Nginx serves the built React application and proxies API requests to the backend.

## Docker Commands

### Start Services
```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
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
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check service health
docker-compose ps
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache
```

### Execute Commands in Containers
```bash
# Access backend shell
docker-compose exec backend bash

# Access PostgreSQL
docker-compose exec postgres psql -U snakearena -d snake_arena

# Run backend tests
docker-compose exec backend pytest tests -v
```

## Environment Variables

The Docker Compose setup uses environment variables defined in `docker-compose.yml`. To customize:

1. Create a `.env` file in the root directory
2. Override variables as needed:

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb
```

## Development Workflow

### Making Changes

**Backend Changes:**
```bash
# Rebuild and restart backend
docker-compose up -d --build backend
```

**Frontend Changes:**
```bash
# Rebuild and restart frontend
docker-compose up -d --build frontend
```

### Database Management

**Reset Database:**
```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

**Backup Database:**
```bash
docker-compose exec postgres pg_dump -U snakearena snake_arena > backup.sql
```

**Restore Database:**
```bash
cat backup.sql | docker-compose exec -T postgres psql -U snakearena -d snake_arena
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

Check backend logs:
```bash
docker-compose logs backend
```

### Frontend Can't Reach Backend

1. Check Nginx configuration in `frontend/nginx.conf`
2. Verify backend is running: `docker-compose ps backend`
3. Test backend directly: `curl http://localhost:8000/`

### Port Conflicts

If ports 80, 8000, or 5432 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Use port 8080 instead of 80
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

## Production Considerations

For production deployment:

1. **Change default passwords** in `docker-compose.yml`
2. **Use environment files** instead of hardcoded values
3. **Enable HTTPS** with a reverse proxy (e.g., Traefik, Caddy)
4. **Set up backups** for the PostgreSQL volume
5. **Configure resource limits** in docker-compose.yml
6. **Use Docker secrets** for sensitive data

Example with resource limits:
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
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
│   Nginx (Frontend)  │
│   Port 80           │
│   - Serves React    │
│   - Proxies /api/*  │
└──────────┬──────────┘
           │
           │ Proxy /api/*
           │
┌──────────▼──────────┐
│   FastAPI Backend   │
│   Port 8000         │
│   - REST API        │
│   - SQLAlchemy ORM  │
└──────────┬──────────┘
           │
           │ SQL
           │
┌──────────▼──────────┐
│   PostgreSQL        │
│   Port 5432         │
│   - Database        │
│   - Persistent Vol  │
└─────────────────────┘
```

## Sample Users

When the backend starts for the first time, it seeds the database with sample users:

- **Username**: `SnakeMaster`, **Password**: `password123`
- **Username**: `NeonViper`, **Password**: `password123`
- **Username**: `CyberSnake`, **Password**: `password123`

## Next Steps

- Visit http://localhost to play the game
- Check http://localhost/api/ for API documentation
- View http://localhost:8000/docs for Swagger UI (direct backend access)
