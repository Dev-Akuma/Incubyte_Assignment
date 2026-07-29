from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str
    email: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
