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

def test_create_vehicle_unauthorized(client):
    """
    Test that an unauthenticated user cannot create a vehicle.
    Expects a 401 Unauthorized status.
    """
    payload = {
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 22000.0,
        "quantity": 2
    }
    
    response = client.post("/api/vehicles", json=payload)
    
    assert response.status_code == 401

def test_get_all_vehicles_success(authorized_client):
    """
    Test that an authorized user can retrieve a list of all vehicles.
    Expects a 200 OK status and a list containing the created vehicles.
    """
    vehicle1 = {
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 22000.0,
        "quantity": 2
    }
    vehicle2 = {
        "make": "Ford",
        "model": "F-150",
        "category": "Truck",
        "price": 35000.0,
        "quantity": 1
    }
    
    # Create the vehicles
    authorized_client.post("/api/vehicles", json=vehicle1)
    authorized_client.post("/api/vehicles", json=vehicle2)
    
    # Retrieve all vehicles
    response = authorized_client.get("/api/vehicles")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    
    # Verify the created vehicles are in the response
    makes_models = [(v["make"], v["model"]) for v in data]
    assert (vehicle1["make"], vehicle1["model"]) in makes_models
    assert (vehicle2["make"], vehicle2["model"]) in makes_models
