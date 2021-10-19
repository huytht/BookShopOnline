from typing import Optional
import uuid
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, BaseConfig
from datetime import datetime

#Collection user
class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str = Field(...)
    password: str = Field(...)
    email: str = Field(...)
    date_of_birth: datetime
    gender: int = Field(...)
    registration_date: Optional[datetime]
    authLevel: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "username": "username",
            "password": "password",
            "email": "email",
            "date_of_birth": datetime(2021, 10, 7, 0, 0 , 0),
            "gender": 1,
            "authLevel": "user"
        }

class UserUpdateModel(BaseModel):
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]
    date_of_birth: Optional[datetime]
    gender: Optional[int]
    authLevel: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "username": "username",
            "password": "password",
            "email": "email",
            "date_of_birth": datetime(2021, 10, 7, 0, 0 , 0),
            "gender": 1,
            "authLevel": "user"
        }