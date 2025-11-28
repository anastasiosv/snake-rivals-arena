from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
import bcrypt
import uuid

from .models import Player, LeaderboardEntry, LiveGame, GameMode
from .db_models import UserDB, LeaderboardEntryDB, LiveGameDB, GameModeEnum
from .database import SessionLocal

class Database:
    """Database operations using SQLAlchemy"""
    
    def __init__(self):
        """Initialize database connection"""
        pass
    
    def _get_session(self) -> Session:
        """Get a new database session"""
        return SessionLocal()
    
    # Password hashing methods
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    # User/Player operations
    def get_user_by_username(self, username: str) -> Optional[Player]:
        """Get user by username"""
        session = self._get_session()
        try:
            user_db = session.query(UserDB).filter(UserDB.username == username).first()
            if not user_db:
                return None
            return self._user_db_to_player(user_db)
        finally:
            session.close()
    
    def get_user_by_id(self, user_id: str) -> Optional[Player]:
        """Get user by ID"""
        session = self._get_session()
        try:
            user_db = session.query(UserDB).filter(UserDB.id == user_id).first()
            if not user_db:
                return None
            return self._user_db_to_player(user_db)
        finally:
            session.close()
    
    def create_user(self, username: str, password: str = None) -> Player:
        """Create a new user"""
        session = self._get_session()
        try:
            # Generate UUID for user ID
            user_id = str(uuid.uuid4())
            
            # Hash password (use default if not provided for backward compatibility)
            password_hash = self.hash_password(password if password else "password123")
            
            user_db = UserDB(
                id=user_id,
                username=username,
                password_hash=password_hash,
                high_score=0,
                games_played=0,
                last_played=datetime.utcnow()
            )
            session.add(user_db)
            session.commit()
            session.refresh(user_db)
            
            return self._user_db_to_player(user_db)
        finally:
            session.close()
    
    def authenticate_user(self, username: str, password: str) -> Optional[Player]:
        """Authenticate a user by username and password"""
        session = self._get_session()
        try:
            user_db = session.query(UserDB).filter(UserDB.username == username).first()
            if not user_db:
                return None
            if not self.verify_password(password, user_db.password_hash):
                return None
            return self._user_db_to_player(user_db)
        finally:
            session.close()
    
    # Leaderboard operations
    def get_top_scores(self, limit: int = 10) -> List[LeaderboardEntry]:
        """Get top scores from leaderboard"""
        session = self._get_session()
        try:
            # Get users sorted by high score
            users = session.query(UserDB).order_by(UserDB.high_score.desc()).limit(limit).all()
            
            entries = []
            for i, user_db in enumerate(users):
                player = self._user_db_to_player(user_db)
                entry = LeaderboardEntry(
                    rank=i + 1,
                    player=player,
                    score=user_db.high_score,
                    mode=GameMode.walls,  # Default mode
                    timestamp=user_db.last_played or datetime.utcnow()
                )
                entries.append(entry)
            
            return entries
        finally:
            session.close()
    
    def update_score(self, user_id: str, score: int, mode: GameMode) -> bool:
        """Update user's score"""
        session = self._get_session()
        try:
            user_db = session.query(UserDB).filter(UserDB.id == user_id).first()
            if not user_db:
                return False
            
            # Update high score if new score is higher
            if score > user_db.high_score:
                user_db.high_score = score
            
            # Update games played and last played
            user_db.games_played += 1
            user_db.last_played = datetime.utcnow()
            
            # Create leaderboard entry
            mode_enum = GameModeEnum.walls if mode == GameMode.walls else GameModeEnum.pass_through
            entry = LeaderboardEntryDB(
                player_id=user_id,
                score=score,
                mode=mode_enum,
                timestamp=datetime.utcnow()
            )
            session.add(entry)
            
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            print(f"Error updating score: {e}")
            return False
        finally:
            session.close()
    
    # Live games operations
    def get_live_games(self) -> List[LiveGame]:
        """Get all live games"""
        session = self._get_session()
        try:
            games_db = session.query(LiveGameDB).all()
            games = []
            for game_db in games_db:
                player = self._user_db_to_player(game_db.player)
                mode = GameMode.walls if game_db.mode == GameModeEnum.walls else GameMode.pass_through
                game = LiveGame(
                    id=game_db.id,
                    player=player,
                    mode=mode,
                    currentScore=game_db.current_score,
                    startedAt=game_db.started_at,
                    spectators=game_db.spectators
                )
                games.append(game)
            return games
        finally:
            session.close()
    
    def get_live_game(self, game_id: str) -> Optional[LiveGame]:
        """Get a specific live game by ID"""
        session = self._get_session()
        try:
            game_db = session.query(LiveGameDB).filter(LiveGameDB.id == game_id).first()
            if not game_db:
                return None
            
            player = self._user_db_to_player(game_db.player)
            mode = GameMode.walls if game_db.mode == GameModeEnum.walls else GameMode.pass_through
            return LiveGame(
                id=game_db.id,
                player=player,
                mode=mode,
                currentScore=game_db.current_score,
                startedAt=game_db.started_at,
                spectators=game_db.spectators
            )
        finally:
            session.close()
    
    # Helper methods
    def _user_db_to_player(self, user_db: UserDB) -> Player:
        """Convert UserDB to Player Pydantic model"""
        return Player(
            id=user_db.id,
            username=user_db.username,
            score=0,  # Current score is always 0 when fetching user
            highScore=user_db.high_score,
            gamesPlayed=user_db.games_played,
            lastPlayed=user_db.last_played
        )

# Global database instance
db = Database()
