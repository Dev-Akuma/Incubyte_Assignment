from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float = Field(gt=0, description="The price must be greater than zero")
    quantity: int = Field(ge=0, description="The quantity must be greater than or equal to zero")

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0, description="The price must be greater than zero")
    quantity: Optional[int] = Field(None, ge=0, description="The quantity must be greater than or equal to zero")

class VehicleSale(BaseModel):
    quantity: int = Field(..., gt=0, description="The number of vehicles sold must be greater than zero")

class VehicleRestock(BaseModel):
    quantity: int = Field(..., gt=0, description="The number of vehicles restocked must be greater than zero")

class VehicleResponse(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
