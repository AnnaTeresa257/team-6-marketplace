from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from backend.database import get_session
from backend.models import Item, User
from backend.dependencies import get_current_user

items_router = APIRouter(tags=["items"])


class ItemCreate(BaseModel):
    title: str
    price: float
    category: str
    description: str | None = None
    image: str | None = None
    is_active: bool = True


class ItemResponse(BaseModel):
    id: int
    title: str
    price: float
    seller_id: int
    category: str
    description: str | None
    image: str | None
    is_active: bool
    seller: dict | None = None


@items_router.get("/items/active")
def get_active_items(session: Session = Depends(get_session)):
    """Get all active items with seller information"""
    statement = select(Item).where(Item.is_active == True)
    items = session.exec(statement).all()
    
    # Include seller email in response
    result = []
    for item in items:
        item_dict = {
            "id": item.id,
            "title": item.title,
            "price": item.price,
            "seller_id": item.seller_id,
            "category": item.category,
            "description": item.description,
            "image": item.image,
            "is_active": item.is_active,
            "seller": {"email": item.seller.email} if item.seller else None
        }
        result.append(item_dict)
    
    return result


@items_router.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(
    item_data: ItemCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new item (authenticated users only)"""
    # Validate required fields
    if not item_data.title or not item_data.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title and category are required"
        )
    
    if item_data.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price must be a positive number"
        )
    
    # Create new item
    new_item = Item(
        title=item_data.title,
        price=item_data.price,
        category=item_data.category,
        description=item_data.description,
        image=item_data.image,
        is_active=item_data.is_active,
        seller_id=current_user.id
    )
    
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    
    # Return item with seller info
    return {
        "id": new_item.id,
        "title": new_item.title,
        "price": new_item.price,
        "seller_id": new_item.seller_id,
        "category": new_item.category,
        "description": new_item.description,
        "image": new_item.image,
        "is_active": new_item.is_active,
        "seller": {"email": current_user.email}
    }


@items_router.delete("/items/{item_id}", status_code=status.HTTP_200_OK)
def delete_item(
    item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete an item (owner or admin only)"""
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check authorization: only item owner or admin can delete
    if item.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this item"
        )
    
    session.delete(item)
    session.commit()
    return {"detail": "Item deleted successfully"}


@items_router.put("/items/{item_id}/mark-sold", status_code=status.HTTP_200_OK)
def mark_item_as_sold(
    item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Mark an item as sold (owner or admin only)"""
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check authorization: only item owner or admin can mark as sold
    if item.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to mark this item as sold"
        )
    
    item.is_active = False
    session.add(item)
    session.commit()
    session.refresh(item)
    
    # Return updated item with seller info
    return {
        "id": item.id,
        "title": item.title,
        "price": item.price,
        "seller_id": item.seller_id,
        "category": item.category,
        "description": item.description,
        "image": item.image,
        "is_active": item.is_active,
        "seller": {"email": item.seller.email} if item.seller else None
    }