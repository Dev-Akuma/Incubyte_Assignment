from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate

def create_vehicle(db: Session, vehicle: VehicleCreate) -> Vehicle:
    db_vehicle = Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_all_vehicles(db: Session, skip: int = 0, limit: int = 100) -> list[Vehicle]:
    return db.query(Vehicle).offset(skip).limit(limit).all()

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
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.offset(skip).limit(limit).all()
