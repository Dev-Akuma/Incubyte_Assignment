from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate

def create_vehicle(db: Session, vehicle: VehicleCreate) -> Vehicle:
    db_vehicle = Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_all_vehicles(db: Session) -> list[Vehicle]:
    return db.query(Vehicle).all()
