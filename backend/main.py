from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import initialize_db

# Transforms a generator into an asynchronous context manager.
# Handles the functionality of 'with', which allows setup code to run before the block and cleanup code to run after, even if an error occurred.
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_db()
    print("Database initialized and user table created!")
    yield  # Anything after yield runs when the app shuts down
app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gator Market API!"}
