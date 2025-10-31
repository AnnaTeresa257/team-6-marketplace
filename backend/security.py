from datetime import datetime, timedelta, timezone
from typing import Any
from passlib.context import CryptContext
from dotenv import load_dotenv
import jwt
import os

load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

# Sanity check to ensure env variables were found
if not SECRET_KEY:
    raise ValueError("SECRET_KEY was not found, verify .env file.")
elif not ALGORITHM:
    raise ValueError("ALGORITHM was not found, verify .env file.")
elif not ACCESS_TOKEN_EXPIRE_MINUTES:
    raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES was not found, verify .env file.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # Sets up the password hashing system with the bcrypt hashing algorithm

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) ->str:
    return pwd_context.hash(password)

# Generates the JWT, with the subject being the username or user ID
def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt
