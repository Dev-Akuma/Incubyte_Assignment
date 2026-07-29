import pytest
from fastapi.testclient import TestClient
from app.main import app 

client = TestClient(app)

def test_register_user_success():
    """
    Test that a new user can successfully register with valid credentials.
    Expects a 201 Created status and the returned user object to not include the password.
    """
    payload = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword123"
    }
    
    response = client.post("/api/auth/register", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"
    assert "password" not in data
