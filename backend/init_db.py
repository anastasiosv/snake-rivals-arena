#!/usr/bin/env python3
"""
Database initialization script for Snake Rivals Arena backend.
Creates all tables and optionally seeds with sample data.
"""
import sys
from app.database import init_db
from app.db import db

def seed_sample_data():
    """Seed database with sample users"""
    print("Seeding sample data...")
    
    # Create sample users
    sample_users = [
        ("SnakeMaster", "password123"),
        ("NeonViper", "password123"),
        ("CyberSnake", "password123"),
    ]
    
    for username, password in sample_users:
        # Check if user already exists
        existing_user = db.get_user_by_username(username)
        if existing_user:
            print(f"  - User '{username}' already exists, skipping...")
            continue
        
        user = db.create_user(username, password)
        print(f"  - Created user: {username} (ID: {user.id})")
        
        # Add some scores for the sample users
        from app.models import GameMode
        if username == "SnakeMaster":
            db.update_score(user.id, 450, GameMode.walls)
        elif username == "NeonViper":
            db.update_score(user.id, 380, GameMode.walls)
        elif username == "CyberSnake":
            db.update_score(user.id, 320, GameMode.pass_through)
    
    print("Sample data seeded successfully!")

def main():
    """Main initialization function"""
    print("Initializing Snake Rivals Arena database...")
    
    # Create all tables
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!")
    
    # Check if we should seed data
    if len(sys.argv) > 1 and sys.argv[1] == "--seed":
        seed_sample_data()
    else:
        print("\nTo seed sample data, run: uv run python init_db.py --seed")
    
    print("\nDatabase initialization complete!")

if __name__ == "__main__":
    main()
