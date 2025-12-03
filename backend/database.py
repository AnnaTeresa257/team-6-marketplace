from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv
from backend.models import User, Item
import os

load_dotenv()  # Gets our DATABASE_URL without leaking private data

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:  # Sanity check to ensure DB URL was found
    raise ValueError("DATABASE_URL was not found, verify .env file.")

engine = create_engine(DATABASE_URL)  # Add second parameter "echo=True" to get debug info printed out

def initialize_db():
    SQLModel.metadata.create_all(engine)  # Creates tables in the database based on "table=True" flag

# Ensures a new session is created for each request and closed when the request is done
def get_session():
    with Session(engine) as session:
        yield session  # With yield --> Transaction safe session to the database, allows code to run and closes db at the end even if there is an error