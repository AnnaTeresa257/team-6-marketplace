from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, or_
from datetime import timedelta

from backend.models import User, UserCreate, UserPublic, Token
from backend.database import get_session
from backend.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Groups API endpoints into a modular, manageable components.
# Allows group of related routes to be defined separately from the main application file
auth_router = APIRouter(tags=["authentication"])


@auth_router.post("/signup", response_model=UserPublic)
def signup(user_data: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.exec(
        select(User).where((User.email == user_data.email) | (User.username == user_data.username))
    ).first()  # Queries the database with a SQL wrapper (ORM) to check if the user already exists

    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    # --- ADD THIS DEBUG LINE ---
    print(f"DEBUG: Attempting to hash: {user_data.password}")
    print(f"DEBUG: Length is: {len(user_data.password.encode('utf-8'))} bytes")
    # ---------------------------

    # User does not already exist, so hash their password and add the user's data into the database
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Validates and converts object into the UserPublic Pydantic model, effectively stripping hashed_password
    return new_user

@auth_router.post("/login")
def login(
        # Pre-built Pydantic model that tells FastAPI to look for data sent in the requested body as standard HTML form data (application/x-www-form-urlencoded)
        # Specifically looks for username and password fields and parses the data
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: Session = Depends(get_session)
):
    user = session.exec(
        select(User).where(or_(User.username == form_data.username, User.email == form_data.username))
    ).first()  # Queries the database for the user with the given username

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # User is valid, so generate JSON Web Token to authorize them
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.username, expires_delta=access_token_expires
    )

    # Return token with user metadata (backward compatible)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "username": user.username,
            "is_admin": user.is_admin
        }
    }