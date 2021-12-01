from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class BookDetailsModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    isbn: str = Field(...)
    published_date: datetime
    book_id: int = Field(...)
    isSold: Optional[bool] = Field(default_factory=False)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "isbn": "456-987-456",
                "published_date": datetime(2021, 10, 7, 0, 0, 0),
                "book_id": 1,
                "isSold": False
            }
        } 

class BookDetailsUpdateModel(BaseModel):
    isbn: Optional[str]
    published_date: Optional[datetime]
    book_id: Optional[int]
    isSold: Optional[bool]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "isbn": "456-987-456",
                "published_date": datetime(2021, 10, 7, 0, 0, 0),
                "book_id": 1,
                "isSold": False
            }
        } 