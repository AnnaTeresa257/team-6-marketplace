"""
Tests for authentication endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import User


def test_signup_success(client: TestClient, session: Session):
    """Test successful user registration."""
    response = client.post(
        "/signup",
        json={
            "username": "newuser",
            "email": "newuser@ufl.edu",
            "password": "NewPass1!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@ufl.edu"
    assert data["username"] == "newuser"
    assert "hashed_password" not in data
    assert data["is_admin"] is False


def test_signup_invalid_email(client: TestClient):
    """Test signup with non-UFL email."""
    response = client.post(
        "/signup",
        json={
            "username": "baduser",
            "email": "baduser@gmail.com",
            "password": "BadPass1!"
        }
    )
    assert response.status_code == 422


def test_signup_weak_password(client: TestClient):
    """Test signup with weak password."""
    response = client.post(
        "/signup",
        json={
            "username": "weakuser",
            "email": "weakuser@ufl.edu",
            "password": "weak"
        }
    )
    assert response.status_code == 422


def test_signup_duplicate_email(client: TestClient, test_user: User):
    """Test signup with existing email."""
    response = client.post(
        "/signup",
        json={
            "username": "duplicate",
            "email": test_user.email,
            "password": "DupPass1!"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client: TestClient, test_user: User):
    """Test successful login."""
    response = client.post(
        "/login",
        data={"username": test_user.email, "password": "TestPass1!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == test_user.email
    assert data["user"]["is_admin"] == test_user.is_admin


def test_login_with_username(client: TestClient, test_user: User):
    """Test login using username instead of email."""
    response = client.post(
        "/login",
        data={"username": test_user.username, "password": "TestPass1!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_wrong_password(client: TestClient, test_user: User):
    """Test login with incorrect password."""
    response = client.post(
        "/login",
        data={"username": test_user.email, "password": "WrongPass1!"}
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Test login with non-existent user."""
    response = client.post(
        "/login",
        data={"username": "ghost@ufl.edu", "password": "GhostPass1!"}
    )
    assert response.status_code == 401


def test_admin_user_metadata(client: TestClient, admin_user: User):
    """Test that admin user gets correct is_admin flag in login response."""
    response = client.post(
        "/login",
        data={"username": admin_user.email, "password": "AdminPass1!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["is_admin"] is True
