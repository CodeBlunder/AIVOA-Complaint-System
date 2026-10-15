from pydantic import BaseModel, EmailStr
from typing import Optional

from pydantic import BaseModel, Field


class UserRegister(BaseModel):
    email: str
    full_name: str
    password: str = Field(
        min_length=8,
        max_length=72
    )
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    role: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True