# Snake Rivals Arena - Backend

FastAPI backend for the Snake Rivals Arena game.

## Setup

This project uses `uv` for dependency management and SQLAlchemy with support for both PostgreSQL and SQLite databases.

```bash
# Install dependencies
uv sync

# Initialize database (creates tables)
make init-db

# Or initialize with sample data
make seed-db
```

### Database Configuration

The backend uses SQLite by default for development. To use PostgreSQL or customize the database:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your database URL:
   ```bash
   # For SQLite (default)
   DATABASE_URL=sqlite:///./snake_arena.db
   
   # For PostgreSQL
   DATABASE_URL=postgresql://username:password@localhost:5432/snake_arena
   ```

3. Initialize the database:
   ```bash
   make seed-db
   ```

## Running the Server

```bash
# Development mode with auto-reload
uv run uvicorn main:app --reload --port 3000

# Or on default port 8000
uv run uvicorn main:app --reload
```

The server will start at:
- `http://localhost:3000` (or `http://localhost:8000`)
- API docs: `http://localhost:3000/docs` (Swagger UI)
- Alternative docs: `http://localhost:3000/redoc` (ReDoc)

## Testing

### Unit Tests

```bash
# Run all tests
uv run pytest tests

# Run with verbose output
uv run pytest tests -v
```

### API Verification

Test the running server:

```bash
uv run python verify_api.py
```

This script will:
1. Start a server instance
2. Test all endpoints
3. Report results

## Project Structure

```
backend/
├── app/
│   ├── models.py    # Pydantic models
│   └── db.py        # Mock database
├── tests/
│   └── test_api.py  # Unit tests
├── main.py          # FastAPI application
├── verify_api.py    # Server verification script
└── pyproject.toml   # Project configuration
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/signup` - Register new user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Leaderboard
- `GET /leaderboard` - Get top scores
- `POST /leaderboard` - Submit score

### Spectate
- `GET /spectate/live` - Get live games
- `GET /spectate/live/{gameId}` - Watch specific game

## Development

### Database Management

```bash
# Initialize database (create tables only)
make init-db

# Initialize and seed with sample data
make seed-db

# Reset database (delete and recreate with sample data)
make reset-db

# Clean up (removes database file and cache)
make clean
```

### Sample Users

When seeding the database, the following test users are created:
- Username: `SnakeMaster`, Password: `password123`
- Username: `NeonViper`, Password: `password123`
- Username: `CyberSnake`, Password: `password123`

### Database Schema

The backend uses SQLAlchemy ORM with the following models:
- **Users**: Player accounts with password hashing (bcrypt)
- **Leaderboard Entries**: Score submissions with game mode and timestamp
- **Live Games**: Currently active games for spectating

### PostgreSQL Setup (Optional)

For production or if you prefer PostgreSQL:

1. Install PostgreSQL on your system
2. Create a database:
   ```bash
   createdb snake_arena
   ```
3. Update `.env` with your PostgreSQL connection string
4. Run migrations:
   ```bash
   make seed-db
   ```
