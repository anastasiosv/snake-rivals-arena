#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - initializing database"

# Initialize database (create tables and seed data)
python init_db.py --seed

>&2 echo "Database initialized - starting application"

# Start the application
exec uvicorn main:app --host 0.0.0.0 --port 8000
