import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.user import User  # Ensure models are imported before create_all
from app.models.vehicle import Vehicle

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    # Create the tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop the tables after the test
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def valid_user_payload():
    return {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword123"
    }

@pytest.fixture(scope="function")
def authorized_client(client, valid_user_payload):
    # Register the user
    client.post("/api/auth/register", json=valid_user_payload)
    
    # Login to get the access token
    login_data = {
        "username": valid_user_payload["username"],
        "password": valid_user_payload["password"]
    }
    response = client.post("/api/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Set the Authorization header for future requests
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client

@pytest.fixture(scope="function")
def admin_user_payload():
    return {
        "username": "adminuser",
        "email": "admin@example.com",
        "password": "adminpassword123",
        "is_admin": True
    }

@pytest.fixture(scope="function")
def admin_client(client, admin_user_payload):
    # Register the admin
    client.post("/api/auth/register", json=admin_user_payload)
    
    # Login to get the access token
    login_data = {
        "username": admin_user_payload["username"],
        "password": admin_user_payload["password"]
    }
    response = client.post("/api/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Set the Authorization header for future requests
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
