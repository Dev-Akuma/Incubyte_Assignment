from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services import vehicle as vehicle_service

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_new_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create new vehicle.
    """
    return vehicle_service.create_vehicle(db=db, vehicle=vehicle_in)

@router.get("", response_model=list[VehicleResponse])
def get_all_vehicles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all vehicles.
    """
    return vehicle_service.get_vehicles(db=db, skip=skip, limit=limit)
