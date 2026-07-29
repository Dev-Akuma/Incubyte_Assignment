from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate
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
    max_price: float = None
) -> list[Vehicle]:
    return vehicle_repo.search_vehicles(
        db, make=make, model=model, category=category, min_price=min_price, max_price=max_price
    )
