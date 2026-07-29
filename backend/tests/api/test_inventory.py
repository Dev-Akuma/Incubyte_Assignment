def test_record_vehicle_sale_success(authorized_client):
    """
    Test recording a sale of a vehicle reduces its quantity correctly.
    """
    # Create a vehicle with starting quantity of 5
    create_response = authorized_client.post("/api/vehicles", json={
        "make": "Ford", "model": "Mustang", "category": "Coupe", "price": 30000.0, "quantity": 5
    })
    assert create_response.status_code == 201
    vehicle_id = create_response.json()["id"]

    # Record a sale of 2 vehicles
    sale_response = authorized_client.post(f"/api/vehicles/{vehicle_id}/sale", json={
        "quantity": 2
    })
    assert sale_response.status_code == 200
    
    # Assert that the new quantity is exactly 3 (5 - 2 = 3)
    updated_vehicle = sale_response.json()
    assert updated_vehicle["quantity"] == 3

def test_record_vehicle_sale_insufficient_stock(authorized_client):
    """
    Test recording a sale fails if stock is insufficient.
    """
    create_response = authorized_client.post("/api/vehicles", json={
        "make": "Ford", "model": "Mustang", "category": "Coupe", "price": 30000.0, "quantity": 2
    })
    vehicle_id = create_response.json()["id"]

    sale_response = authorized_client.post(f"/api/vehicles/{vehicle_id}/sale", json={
        "quantity": 5
    })
    assert sale_response.status_code == 400

def test_record_vehicle_sale_invalid_quantity(authorized_client):
    """
    Test recording a sale fails if quantity is 0 or negative.
    """
    create_response = authorized_client.post("/api/vehicles", json={
        "make": "Ford", "model": "Mustang", "category": "Coupe", "price": 30000.0, "quantity": 5
    })
    vehicle_id = create_response.json()["id"]

    sale_response = authorized_client.post(f"/api/vehicles/{vehicle_id}/sale", json={
        "quantity": 0
    })
    assert sale_response.status_code == 422
