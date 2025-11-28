# Snake Rivals Arena

A multiplayer snake game with real-time spectating and leaderboards.

## 🐳 Docker Quick Start (Recommended)

Run the entire application with Docker Compose:

```bash
docker-compose up --build
```

Visit **http://localhost** to play the game!

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

## 💻 Local Development

Run both frontend and backend servers:

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:8080` (or `http://localhost:5173`)

### Individual Commands

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## 📁 Project Structure

- `frontend/` - React + TypeScript frontend with Vite
- `backend/` - FastAPI backend with Python
- `openapi.yaml` - API specification
- `docker-compose.yml` - Docker Compose configuration

## 📚 Documentation

- **[Docker Setup](DOCKER.md)** - Complete Docker Compose guide
- [Backend README](backend/README.md) - Backend development guide
- [Frontend README](frontend/README.md) - Frontend development guide
- [API Documentation](http://localhost:3000/docs) - Swagger UI (when backend is running)

## 🎮 Features

- **Multiplayer Snake Game** - Classic snake with modern twist
- **Real-time Spectating** - Watch live games
- **Leaderboards** - Compete for high scores
- **User Authentication** - Secure login and signup
- **PostgreSQL Database** - Production-ready data persistence

