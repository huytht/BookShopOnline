from typing import Optional
import uuid
from pydantic import BaseModel, Field
from datetime import datetime

class BookModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    isbn: str = Field(...)
    title: str = Field(...)
    summary_content: str = Field(...)
    author: str = Field(...)
    published_date: datetime
    price: int = Field(...)
    image: str = Field(...)
    category_id = []
    isSold: Optional[bool] = Field(default_factory=False)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
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
    isSold: Optional[bool]

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
                "category_id": [1, 2],
                "isSold": False
            }
        } 