from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
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

@router.get("/search", response_model=list[VehicleResponse])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search vehicles by various criteria.
    """
    return vehicle_service.search_vehicles(
        db=db, make=make, model=model, category=category, min_price=min_price, max_price=max_price, skip=skip, limit=limit
    )

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

@router.put("/{id}", response_model=VehicleResponse)
def update_vehicle(
    id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a vehicle.
    """
    return vehicle_service.update_vehicle(db=db, vehicle_id=id, vehicle_update=vehicle_in)
