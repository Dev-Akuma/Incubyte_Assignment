def test_create_vehicle_success(authorized_client):
    """
    Test that an authorized user can successfully create a new vehicle.
    Expects a 201 Created status and the returned vehicle object to contain an ID.
    """
    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 5
    }
    
    response = authorized_client.post("/api/vehicles", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["make"] == payload["make"]
    assert data["model"] == payload["model"]
    assert data["category"] == payload["category"]
    assert data["price"] == payload["price"]
    assert data["quantity"] == payload["quantity"]
