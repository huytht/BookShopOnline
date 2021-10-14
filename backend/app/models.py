from typing import Optional
import uuid
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, BaseConfig
from datetime import datetime
from fastapi import Request

class MongoModel(BaseModel):
    class Config(BaseConfig):
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }

#Collection book
class BookModel(MongoModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    isbn: str = Field(...)
    title: str = Field(...)
    summary_content: str = Field(...)
    author: str = Field(...)
    published_date: datetime = Field(...)
    price: int = Field(...)
    image: str = Field(...)
    category_id = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "isbn": "456-987-456",
                "title": "Title",
                "summary_content": "short content",
                "author": "Author name",
                "published_date": datetime(2021, 10, 7, 0, 0 , 0),
                "price": 20000,
                "image": "abc.jpg",
                "category_id": [1, 2]
            }
        } 

class BookUpdateModel(BaseModel):
    isbn: Optional[str]
    title: Optional[str]
    summary_content: Optional[str]
    author: Optional[str]
    published_date: Optional[datetime]
    price: Optional[int]
    image: Optional[str]
    category_id = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "isbn": "456-987-456",
                "title": "Title",
                "summary_content": "short content",
                "author": "Author name",
                "published_date": datetime(2021, 10, 7, 0, 0 , 0),
                "price": 20000,
                "image": "abc.jpg",
                "category_id": [1, 2]
            }
        } 

#Collection user
class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str = Field(...)
    password: str = Field(...)
    email: str = Field(...)
    date_of_birth: datetime = Field(...)
    gender: int = Field(...)
    registration_date: datetime = Field(default_factory=datetime.now)
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

#Collection Category

class CategoryModel(BaseModel):
    
    id: Optional[int] = Field(alias="_id")
    name: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "name": "name_category"
        }

class CategoryUpdateModel(BaseModel):
    name: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "name": "name_category"
        }
