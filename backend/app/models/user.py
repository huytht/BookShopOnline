from typing import Optional
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, BaseConfig
from datetime import datetime

# Collection user


class UserModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    fullname: Optional[str] = Field(...)
    username: str = Field(...)
    password: str = Field(...)
    email: str = Field(...)
    date_of_birth: Optional[datetime]
    gender: Optional[int] = Field(...)
    avatar: Optional[str] = Field(default_factory="default-avatar.jpg")
    registration_date: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "fullname": "your fullname",
                "username": "username",
                "password": "password",
                "email": "email",
                "date_of_birth": datetime(2021, 10, 7, 0, 0, 0),
                "gender": 1,
            }

        }


class UserUpdateModel(BaseModel):
    fullname: Optional[str]
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]
    date_of_birth: Optional[datetime]
    gender: Optional[int]
    avatar: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "fullname": "your fullname",
                "username": "username",
                "password": "password",
                "email": "email",
                "date_of_birth": datetime(2021, 10, 7, 0, 0, 0),
                "gender": 1,
            }
        }


class LoginModel(BaseModel):
    username: str
    password: str
