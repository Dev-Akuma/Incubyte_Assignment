from fastapi import FastAPI
from app.api import auth
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory System")

app.include_router(auth.router)
