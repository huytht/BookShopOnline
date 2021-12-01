from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class BookModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    title: str = Field(...)
    summary_content: str = Field(...)
    author: str = Field(...)
    price: int = Field(...)
    image: str = Field(...)
    publisher_id: int = Field(...)
    category_id = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "title": "Title",
                "summary_content": "short content",
                "author": "Author name",
                "price": 20000,
                "image": "abc.jpg",
                "publisher_id": 1,
                "category_id": [1, 2],
            }
        } 

class BookUpdateModel(BaseModel):
    title: Optional[str]
    summary_content: Optional[str]
    author: Optional[str]
    price: Optional[int]
    image: Optional[str]
    publisher_id: Optional[int]
    category_id = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Title",
                "summary_content": "short content",
                "author": "Author name",
                "price": 20000,
                "image": "abc.jpg",
                "publisher_id": 1,
                "category_id": [1, 2],
            }
        } 