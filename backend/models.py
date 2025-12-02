from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr, field_validator
from typing import List
import re

# --- Database Models ---
class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str | None = None
    seller_id: int = Field(foreign_key="user.id")
    price: float
    category: str
    is_active: bool = Field(default=True)
    image: str | None = None
    seller: "User" = Relationship(back_populates="items")
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    items: List[Item] = Relationship(back_populates="seller")

# --- Pydantic Schemas ---
class UserCreate(SQLModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("email")  # Tells Pydantic to validate ufl email address whenever the "email" field is filled out
    @classmethod
    def validate_ufl_email(cls, v: str) -> str:
        if not v.endswith("@ufl.edu"):
            raise ValueError("Email must be a valid @ufl.edu email address!")  # Pydantic converts this to a 422 Validation Error to the API client
        return v

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        # At least one lowercase letter
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        # At least one uppercase letter
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        # At least one special character
        if not re.search(r"[^\w\s]", v):
            raise ValueError("Password must contain at least one special character (e.g., !@#$%)")
        return v

class UserPublic(SQLModel):
    # Defines what data is safe to return to a client
    id: int
    username: str
    email: EmailStr

class Token(SQLModel):
    # Structure of an authentication response for OAuth2 workflows.
    # Return a bearer token to user after successful login
    access_token: str
    token_type: str