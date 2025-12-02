"""
Pytest configuration and fixtures for backend tests.
"""

import os
import pytest
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient

# Set test environment
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

from backend.main import app
from backend.database import get_session
from backend.models import User, Item
from backend.security import get_password_hash


@pytest.fixture(name="session")
def session_fixture():
    """Create a fresh database session for each test."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a test client with database session override."""
    def get_session_override():
        return session
    
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
    """Create a test user."""
    user = User(
        username="testuser",
        email="testuser@ufl.edu",
        hashed_password=get_password_hash("TestPass1!"),
        is_admin=False
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="admin_user")
def admin_user_fixture(session: Session):
    """Create an admin test user."""
    admin = User(
        username="adminuser",
        email="admin@ufl.edu",
        hashed_password=get_password_hash("AdminPass1!"),
        is_admin=True
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin


@pytest.fixture(name="auth_token")
def auth_token_fixture(client: TestClient, test_user: User):
    """Get authentication token for test user."""
    response = client.post(
        "/login",
        data={"username": test_user.email, "password": "TestPass1!"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(name="admin_token")
def admin_token_fixture(client: TestClient, admin_user: User):
    """Get authentication token for admin user."""
    response = client.post(
        "/login",
        data={"username": admin_user.email, "password": "AdminPass1!"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(name="test_item")
def test_item_fixture(session: Session, test_user: User):
    """Create a test item."""
    item = Item(
        title="Test Item",
        description="A test item",
        price=25.00,
        category="school",
        image="https://example.com/image.jpg",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
