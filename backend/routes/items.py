from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from backend.database import get_session
from backend.models import Item
from backend.dependencies import get_current_user

items_router = APIRouter(tags=["items"])

@items_router.get("/items/active")
def get_active_items(session: Session = Depends(get_session)):
    statement = select(Item).where(Item.is_active == True)
    return session.exec(statement).all()

@items_router.post("/items")
def create_item(item: Item, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    if not item.title or not item.price or not item.category or not item.description:
        raise HTTPException(status_code=400, detail="All fields are required.")
    if item.price <= 0:
        raise HTTPException(status_code=400, detail="Price must be a positive number.")
    item.seller_id = current_user.id
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@items_router.delete("/items/{item_id}")
def delete_item(item_id: int, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(item)
    session.commit()
    return {"message": "Item deleted successfully"}

@items_router.put("/items/{item_id}/mark-sold")
def mark_item_as_sold(item_id: int, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.is_active = False
    session.add(item)
    session.commit()
    return {"message": "Item marked as sold"}