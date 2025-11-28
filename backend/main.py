from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from app.models import (
    Player, LeaderboardEntry, LiveGame, GameMode,
    AuthResponse, ErrorResponse, LoginRequest, SignupRequest,
    SubmitScoreRequest, SubmitScoreResponse
)
from app.db import db

app = FastAPI(
    title="Snake Rivals Arena API",
    version="1.0.0",
    description="API for the Snake Rivals Arena game backend."
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost",  # Docker Compose frontend
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.get("/")
async def home():
    """Welcome endpoint for the Snake Rivals Arena API"""
    return {
        "message": "Welcome to the Snake Rivals Arena API!",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "authentication": ["/auth/login", "/auth/signup", "/auth/logout", "/auth/me"],
            "leaderboard": ["/leaderboard"],
            "spectate": ["/spectate/live", "/spectate/live/{gameId}"]
        }
    }

# Mock token verification
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if not token.startswith("mock-token-"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = token.replace("mock-token-", "")
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.post("/auth/login", response_model=AuthResponse, responses={401: {"model": ErrorResponse}})
async def login(request: LoginRequest):
    user = db.authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return AuthResponse(user=user, token=f"mock-token-{user.id}")

@app.post("/auth/signup", response_model=AuthResponse, status_code=201, responses={400: {"model": ErrorResponse}})
async def signup(request: SignupRequest):
    if len(request.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(request.password) < 3:
        raise HTTPException(status_code=400, detail="Password must be at least 3 characters")
    
    if db.get_user_by_username(request.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = db.create_user(request.username, request.password)
    return AuthResponse(user=user, token=f"mock-token-{user.id}")

@app.post("/auth/logout")
async def logout(current_user: Player = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@app.get("/auth/me", response_model=Player)
async def get_me(current_user: Player = Depends(get_current_user)):
    return current_user

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 10):
    return db.get_top_scores(limit)

@app.post("/leaderboard", response_model=SubmitScoreResponse)
async def submit_score(request: SubmitScoreRequest, current_user: Player = Depends(get_current_user)):
    success = db.update_score(current_user.id, request.score, request.mode)
    return SubmitScoreResponse(success=success, newRank=5) # Mock rank

@app.get("/spectate/live", response_model=List[LiveGame])
async def get_live_games():
    return db.get_live_games()

@app.get("/spectate/live/{game_id}", response_model=LiveGame, responses={404: {"model": ErrorResponse}})
async def get_live_game(game_id: str):
    game = db.get_live_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game
