from pydantic import BaseModel, ConfigDict, Field

class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float = Field(gt=0, description="The price must be greater than zero")
    quantity: int = Field(ge=0, description="The quantity must be greater than or equal to zero")

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
