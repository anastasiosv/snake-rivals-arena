from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class GameModeEnum(str, enum.Enum):
    """Game mode enumeration"""
    pass_through = "pass-through"
    walls = "walls"

class UserDB(Base):
    """SQLAlchemy model for users/players"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    high_score = Column(Integer, default=0)
    games_played = Column(Integer, default=0)
    last_played = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    leaderboard_entries = relationship("LeaderboardEntryDB", back_populates="player")
    live_games = relationship("LiveGameDB", back_populates="player")

class LeaderboardEntryDB(Base):
    """SQLAlchemy model for leaderboard entries"""
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    player_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    player = relationship("UserDB", back_populates="leaderboard_entries")

class LiveGameDB(Base):
    """SQLAlchemy model for live games"""
    __tablename__ = "live_games"

    id = Column(String, primary_key=True, index=True)
    player_id = Column(String, ForeignKey("users.id"), nullable=False)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    current_score = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    spectators = Column(Integer, default=0)

    # Relationships
    player = relationship("UserDB", back_populates="live_games")
