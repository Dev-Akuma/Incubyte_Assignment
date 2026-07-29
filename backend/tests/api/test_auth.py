def test_register_user_success(client, valid_user_payload):
    """
    Test that a new user can successfully register with valid credentials.
    Expects a 201 Created status and the returned user object to not include the password.
    """
    response = client.post("/api/auth/register", json=valid_user_payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == valid_user_payload["username"]
    assert data["email"] == valid_user_payload["email"]
    assert "password" not in data
