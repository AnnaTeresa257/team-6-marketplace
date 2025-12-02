from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.database import initialize_db
from backend.routes.auth import auth_router
from backend.dependencies import get_current_user
from backend.models import User
from backend.routes.items import items_router

# Transforms a generator into an asynchronous context manager.
# Handles the functionality of 'with', which allows setup code to run before the block and cleanup code to run after, even if an error occurred.
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_db()
    print("Database initialized and user table created!")
    yield  # Anything after yield runs when the app shuts down
app = FastAPI(lifespan=lifespan)

# --- CORS CONFIG (Connecting to Frontend) ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of frontend origins
    allow_credentials=True,  # Cookies/auth headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router)
app.include_router(items_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gator Market API!"}

@app.get("/secure-data")
def read_secure_data(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Success! You are authenticated as {current_user.username}",
        "email": current_user.email,
        "id": current_user.id,
        "is_admin": current_user.is_admin
    }
