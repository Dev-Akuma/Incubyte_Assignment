from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.repositories.vehicle import create_vehicle

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
    return create_vehicle(db=db, vehicle=vehicle_in)
