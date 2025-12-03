"""
Tests for item endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import User, Item


def test_get_active_items_no_auth(client: TestClient, test_item: Item):
    """Test getting active items without authentication (should work)."""
    response = client.get("/items/active")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 1
    
    # Check item structure
    item = items[0]
    assert "id" in item
    assert "title" in item
    assert "price" in item
    assert "seller_id" in item
    assert "category" in item
    assert "is_active" in item
    assert "seller" in item
    assert item["seller"]["email"] is not None


def test_get_active_items_with_seller_info(client: TestClient, session: Session, test_user: User):
    """Test that active items include seller email."""
    # Create an item
    item = Item(
        title="Item with Seller",
        description="Test",
        price=50.0,
        category="school",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    
    response = client.get("/items/active")
    assert response.status_code == 200
    items = response.json()
    
    # Find our item
    our_item = next((i for i in items if i["title"] == "Item with Seller"), None)
    assert our_item is not None
    assert our_item["seller"]["email"] == test_user.email


def test_create_item_success(client: TestClient, auth_token: str, test_user: User):
    """Test creating an item with authentication."""
    response = client.post(
        "/items",
        json={
            "title": "New Test Item",
            "price": 99.99,
            "category": "school",
            "description": "A brand new test item",
            "image": "https://example.com/image.jpg",
            "is_active": True
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Test Item"
    assert data["price"] == 99.99
    assert data["seller_id"] == test_user.id
    assert data["seller"]["email"] == test_user.email


def test_create_item_no_auth(client: TestClient):
    """Test creating an item without authentication (should fail)."""
    response = client.post(
        "/items",
        json={
            "title": "Unauthorized Item",
            "price": 50.0,
            "category": "school",
            "description": "Should fail",
        }
    )
    assert response.status_code == 401


def test_create_item_invalid_price(client: TestClient, auth_token: str):
    """Test creating an item with invalid price."""
    response = client.post(
        "/items",
        json={
            "title": "Invalid Price Item",
            "price": -10.0,
            "category": "school",
            "description": "Bad price",
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 400
    assert "positive" in response.json()["detail"].lower()


def test_create_item_missing_title(client: TestClient, auth_token: str):
    """Test creating an item without required title."""
    response = client.post(
        "/items",
        json={
            "price": 50.0,
            "category": "school",
            "description": "No title",
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 422


def test_mark_item_sold_owner(client: TestClient, session: Session, test_user: User, auth_token: str):
    """Test marking own item as sold."""
    # Create item
    item = Item(
        title="Item to Sell",
        price=30.0,
        category="apparel",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    response = client.put(
        f"/items/{item.id}/mark-sold",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is False


def test_mark_item_sold_non_owner(client: TestClient, session: Session, test_user: User, admin_user: User, auth_token: str):
    """Test marking someone else's item as sold (should fail unless admin)."""
    # Create item owned by admin
    item = Item(
        title="Admin's Item",
        price=40.0,
        category="living",
        is_active=True,
        seller_id=admin_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    # Try to mark as sold with regular user token
    response = client.put(
        f"/items/{item.id}/mark-sold",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 403
    assert "permission" in response.json()["detail"].lower()


def test_mark_item_sold_admin(client: TestClient, session: Session, test_user: User, admin_token: str):
    """Test that admin can mark any item as sold."""
    # Create item owned by regular user
    item = Item(
        title="User's Item",
        price=45.0,
        category="services",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    # Admin marks it as sold
    response = client.put(
        f"/items/{item.id}/mark-sold",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is False


def test_delete_item_owner(client: TestClient, session: Session, test_user: User, auth_token: str):
    """Test deleting own item."""
    item = Item(
        title="Item to Delete",
        price=20.0,
        category="tickets",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    response = client.delete(
        f"/items/{item.id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert "deleted" in response.json()["detail"].lower()


def test_delete_item_non_owner(client: TestClient, session: Session, admin_user: User, auth_token: str):
    """Test deleting someone else's item (should fail unless admin)."""
    item = Item(
        title="Protected Item",
        price=30.0,
        category="school",
        is_active=True,
        seller_id=admin_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    response = client.delete(
        f"/items/{item.id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 403


def test_delete_item_admin(client: TestClient, session: Session, test_user: User, admin_token: str):
    """Test that admin can delete any item."""
    item = Item(
        title="Item Admin Deletes",
        price=35.0,
        category="living",
        is_active=True,
        seller_id=test_user.id
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    
    response = client.delete(
        f"/items/{item.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200


def test_delete_nonexistent_item(client: TestClient, auth_token: str):
    """Test deleting an item that doesn't exist."""
    response = client.delete(
        "/items/99999",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 404
