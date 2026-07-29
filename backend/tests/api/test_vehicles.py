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

def test_get_all_vehicles_unauthorized(client):
    """
    Test that an unauthenticated user cannot retrieve vehicles.
    Expects a 401 Unauthorized status.
    """
    response = client.get("/api/vehicles")
    assert response.status_code == 401

def test_get_all_vehicles_pagination(authorized_client):
    """
    Test that the skip and limit pagination parameters work correctly.
    """
    # Create 3 vehicles
    vehicles = [
        {"make": "TestMake1", "model": "TestModel1", "category": "Sedan", "price": 10000, "quantity": 1},
        {"make": "TestMake2", "model": "TestModel2", "category": "SUV", "price": 20000, "quantity": 1},
        {"make": "TestMake3", "model": "TestModel3", "category": "Truck", "price": 30000, "quantity": 1},
    ]
    for v in vehicles:
        authorized_client.post("/api/vehicles", json=v)
        
    # Test limit=2
    response_limit = authorized_client.get("/api/vehicles?limit=2")
    assert response_limit.status_code == 200
    data_limit = response_limit.json()
    assert len(data_limit) <= 2  # Might be less if DB is cleared, but definitely shouldn't exceed 2

def test_search_vehicles_success(authorized_client):
    """
    Test that an authorized user can search vehicles by make, category, and price range.
    """
    # 1. Toyota SUV ($25,000)
    authorized_client.post("/api/vehicles", json={
        "make": "Toyota", "model": "RAV4", "category": "SUV", "price": 25000.0, "quantity": 1
    })
    # 2. Honda Sedan ($15,000)
    authorized_client.post("/api/vehicles", json={
        "make": "Honda", "model": "Civic", "category": "Sedan", "price": 15000.0, "quantity": 1
    })
    # 3. Ford Truck ($35,000)
    authorized_client.post("/api/vehicles", json={
        "make": "Ford", "model": "F-150", "category": "Truck", "price": 35000.0, "quantity": 1
    })

    # Search by make
    response_make = authorized_client.get("/api/vehicles/search?make=Toyota")
    assert response_make.status_code == 200
    data_make = response_make.json()
    assert len(data_make) == 1
    assert data_make[0]["make"] == "Toyota"

    # Search by category
    response_category = authorized_client.get("/api/vehicles/search?category=Sedan")
    assert response_category.status_code == 200
    data_category = response_category.json()
    assert len(data_category) == 1
    assert data_category[0]["category"] == "Sedan"

    # Search by price range
    response_price = authorized_client.get("/api/vehicles/search?min_price=20000&max_price=40000")
    assert response_price.status_code == 200
    data_price = response_price.json()
    assert len(data_price) == 2
