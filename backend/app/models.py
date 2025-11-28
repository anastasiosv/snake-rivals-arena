from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from enum import Enum
from datetime import datetime

class GameMode(str, Enum):
    pass_through = "pass-through"
    walls = "walls"

class Player(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    username: str
    score: int
    highScore: int
    gamesPlayed: int
    lastPlayed: Optional[datetime] = None

class LeaderboardEntry(BaseModel):
    rank: int
    player: Player
    score: int
    mode: GameMode
    timestamp: datetime

class LiveGame(BaseModel):
    id: str
    player: Player
    mode: GameMode
    currentScore: int
    startedAt: datetime
    spectators: int

class AuthResponse(BaseModel):
    user: Player
    token: str

class ErrorResponse(BaseModel):
    error: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str

class SubmitScoreRequest(BaseModel):
    score: int
    mode: GameMode

class SubmitScoreResponse(BaseModel):
    success: bool
    newRank: Optional[int] = None
