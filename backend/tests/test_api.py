import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Must import and configure BEFORE importing app
from app.database import Base
from app.db_models import UserDB
import app.database as database_module
import app.db as db_module

# ============================================================================
# TEST DATABASE CONFIGURATION - Uses SQLite in-memory database
# ============================================================================
# This ensures tests are:
# 1. Fast (in-memory)
# 2. Isolated (separate from production database)
# 3. Clean (fresh database for each test run)
# 4. Thread-safe (StaticPool maintains single connection)
# ============================================================================

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # StaticPool ensures single connection for in-memory DB
)

# Create test session factory
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create all tables in test database
Base.metadata.create_all(bind=test_engine)

# Override the database engine and session in modules BEFORE importing main
# This ensures all database operations in the app use the test database
database_module.engine = test_engine
database_module.SessionLocal = TestSessionLocal
db_module.SessionLocal = TestSessionLocal

# Now import app
from main import app

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """Setup and teardown for each test"""
    # Create tables
    Base.metadata.create_all(bind=test_engine)
    
    # Create test user
    session = TestSessionLocal()
    try:
        # Clear any existing data
        session.query(UserDB).delete()
        session.commit()
        
        # Create test user with known password
        from app.db import db
        test_user = UserDB(
            id="test-user-1",
            username="SnakeMaster",
            password_hash=db.hash_password("password123"),
            high_score=450,
            games_played=1,
        )
        session.add(test_user)
        session.commit()
    finally:
        session.close()
    
    yield
    
    # Cleanup after test
    session = TestSessionLocal()
    try:
        session.query(UserDB).delete()
        session.commit()
    finally:
        session.close()

def test_home():
    """Test home endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Welcome" in response.json()["message"]

def test_login_success():
    """Test successful login"""
    response = client.post("/auth/login", json={"username": "SnakeMaster", "password": "password123"})
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["user"]["username"] == "SnakeMaster"

def test_login_failure():
    """Test failed login with wrong password"""
    response = client.post("/auth/login", json={"username": "SnakeMaster", "password": "wrongpassword"})
    assert response.status_code == 401

def test_signup_success():
    """Test successful user signup"""
    import random
    username = f"NewUser_{random.randint(10000, 99999)}"
    response = client.post("/auth/signup", json={"username": username, "password": "password123"})
    assert response.status_code == 201
    assert response.json()["user"]["username"] == username
    assert "token" in response.json()

def test_signup_short_username():
    """Test signup with short username"""
    response = client.post("/auth/signup", json={"username": "ab", "password": "password123"})
    assert response.status_code == 400

def test_signup_short_password():
    """Test signup with short password"""
    import random
    username = f"User_{random.randint(10000, 99999)}"
    response = client.post("/auth/signup", json={"username": username, "password": "ab"})
    assert response.status_code == 400

def test_leaderboard():
    """Test getting leaderboard"""
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # Should have at least our test user
    assert len(response.json()) >= 1

def test_spectate_live():
    """Test getting live games"""
    response = client.get("/spectate/live")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_auth_me():
    """Test getting current user with valid token"""
    # Use the test user's token
    response = client.get("/auth/me", headers={"Authorization": "Bearer mock-token-test-user-1"})
    assert response.status_code == 200
    assert response.json()["username"] == "SnakeMaster"

def test_auth_me_invalid_token():
    """Test getting current user with invalid token"""
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401
