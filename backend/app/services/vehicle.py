from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.repositories import vehicle as vehicle_repo

def create_vehicle(db: Session, vehicle: VehicleCreate) -> Vehicle:
    return vehicle_repo.create_vehicle(db=db, vehicle=vehicle)

def get_vehicles(db: Session, skip: int = 0, limit: int = 100) -> list[Vehicle]:
    return vehicle_repo.get_all_vehicles(db, skip=skip, limit=limit)

def search_vehicles(
    db: Session, 
    make: str = None, 
    model: str = None, 
    category: str = None, 
    min_price: float = None, 
    max_price: float = None,
    skip: int = 0,
    limit: int = 100
) -> list[Vehicle]:
    return vehicle_repo.search_vehicles(
        db, make=make, model=model, category=category, min_price=min_price, max_price=max_price, skip=skip, limit=limit
    )

def update_vehicle(db: Session, vehicle_id: int, vehicle_update: VehicleUpdate) -> Vehicle:
    db_vehicle = vehicle_repo.get_vehicle_by_id(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    
    update_data = vehicle_update.model_dump(exclude_unset=True)
    return vehicle_repo.update_vehicle(db, db_vehicle, update_data)
