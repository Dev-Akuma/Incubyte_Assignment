from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate
from app.repositories import vehicle as vehicle_repo

def create_vehicle(db: Session, vehicle: VehicleCreate) -> Vehicle:
    return vehicle_repo.create_vehicle(db=db, vehicle=vehicle)

def get_vehicles(db: Session) -> list[Vehicle]:
    return vehicle_repo.get_all_vehicles(db)
