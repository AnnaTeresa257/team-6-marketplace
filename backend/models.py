from sqlmodel import SQLModel, Field
from pydantic import EmailStr, field_validator

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

    @field_validator("email")  # Tells Pydantic to validate ufl email address whenever the "email" field is filled out
    @classmethod
    def validate_ufl_email(cls, v: str) -> str:
        if not v.endswith("@ufl.edu"):
            raise ValueError("Email must be a valid @ufl.edu email address!")  # Pydantic converts this to a 422 Validation Error to the API client
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