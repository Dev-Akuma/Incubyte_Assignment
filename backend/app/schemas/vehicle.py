from pydantic import BaseModel, ConfigDict

class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
