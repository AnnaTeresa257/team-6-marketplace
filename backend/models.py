from sqlmodel import SQLModel, Field
from pydantic import EmailStr

# --- Database Models ---
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str

# --- Pydantic Schemas ---
class UserCreate(SQLModel):
    username: str
    email: EmailStr
    password: str

class UserPublic(SQLModel):
    id: int
    username: str
    email: EmailStr

class Token(SQLModel):
    access_token: str
    token_type: str