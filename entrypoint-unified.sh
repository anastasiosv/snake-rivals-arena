#!/bin/bash
set -e

echo "Starting Snake Rivals Arena unified container..."

# Check if we're using PostgreSQL
if [[ $DATABASE_URL == postgresql://* ]]; then
    echo "Waiting for PostgreSQL to be ready..."
    
    # Extract connection details from DATABASE_URL if needed
    # Wait for PostgreSQL to be ready
    until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
        >&2 echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    
    >&2 echo "PostgreSQL is up - initializing database"
    
    # Initialize database (create tables and seed data)
    cd /app/backend
    python init_db.py --seed
    
    >&2 echo "Database initialized"
else
    echo "Using SQLite database"
    cd /app/backend
    python init_db.py --seed
fi

# Create log directory for supervisor
mkdir -p /var/log/supervisor

echo "Starting Supervisor to manage backend and frontend..."

# Start Supervisor which will start both Nginx and Uvicorn
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
