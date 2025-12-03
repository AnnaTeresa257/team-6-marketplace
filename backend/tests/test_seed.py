"""
Tests for the database seed script.
"""

import pytest
from sqlmodel import Session, select
from backend.models import User, Item
from backend.scripts.seed_db import create_seed_users, create_seed_items, SEED_USERS


def test_create_seed_users(session: Session):
    """Test that seed users are created correctly."""
    users = create_seed_users(session)
    
    # Check correct number of users
    assert len(users) == len(SEED_USERS)
    
    # Check all expected users exist
    for user_data in SEED_USERS:
        assert user_data["email"] in users
        user = users[user_data["email"]]
        assert user.email == user_data["email"]
        assert user.username == user_data["username"]
        assert user.is_admin == user_data["is_admin"]


def test_seed_users_idempotent(session: Session):
    """Test that running seed users multiple times doesn't create duplicates."""
    # First run
    users1 = create_seed_users(session)
    user_ids1 = {email: user.id for email, user in users1.items()}
    
    # Second run
    users2 = create_seed_users(session)
    user_ids2 = {email: user.id for email, user in users2.items()}
    
    # Should have same IDs (no duplicates created)
    assert user_ids1 == user_ids2
    
    # Verify database only has expected number of users
    all_users = session.exec(select(User)).all()
    assert len(all_users) == len(SEED_USERS)


def test_create_seed_items(session: Session):
    """Test that seed items are created correctly."""
    # First create users
    users = create_seed_users(session)
    
    # Then create items
    create_seed_items(session, users)
    
    # Check total number of items
    all_items = session.exec(select(Item)).all()
    assert len(all_items) == 100
    
    # Check items per category
    categories = ["school", "apparel", "living", "services", "tickets"]
    for category in categories:
        items = session.exec(select(Item).where(Item.category == category)).all()
        assert len(items) == 20, f"Expected 20 {category} items, got {len(items)}"
    
    # Check items per user (should be 20 each)
    for email, user in users.items():
        items = session.exec(select(Item).where(Item.seller_id == user.id)).all()
        assert len(items) == 20, f"Expected 20 items for {email}, got {len(items)}"


def test_seed_items_idempotent(session: Session):
    """Test that running seed items multiple times doesn't create duplicates."""
    users = create_seed_users(session)
    
    # First run
    create_seed_items(session, users)
    count1 = len(session.exec(select(Item)).all())
    
    # Second run
    create_seed_items(session, users)
    count2 = len(session.exec(select(Item)).all())
    
    # Should have same count (no duplicates)
    assert count1 == count2
    assert count1 == 100


def test_seed_items_structure(session: Session):
    """Test that seeded items have correct structure."""
    users = create_seed_users(session)
    create_seed_items(session, users)
    
    # Get a sample item
    item = session.exec(select(Item)).first()
    
    # Check required fields
    assert item.id is not None
    assert item.title is not None
    assert item.price > 0
    assert item.category in ["school", "apparel", "living", "services", "tickets"]
    assert item.seller_id is not None
    assert item.is_active is True
    assert item.image is not None
    assert "Seed #" in item.title  # Should have seed marker


def test_admin_users_created(session: Session):
    """Test that admin users are created with correct permissions."""
    users = create_seed_users(session)
    
    admin_count = sum(1 for user in users.values() if user.is_admin)
    assert admin_count == 2
    
    # Check specific admin emails
    assert users["admin1@ufl.edu"].is_admin is True
    assert users["admin2@ufl.edu"].is_admin is True
    assert users["user1@ufl.edu"].is_admin is False
