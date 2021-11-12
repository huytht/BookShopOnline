from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

#Collection Review

class ReviewModel(BaseModel):
    
    id: Optional[int] = Field(alias="_id")
    book_id: int = Field(...)
    user_id: int = Field(...)
    created_date: Optional[datetime]
    rate: int = Field(...)
    remark: str = Field(...)
    favourite: bool = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "book_id": 1,
                "user_id": 1,
                "rate": 0,
                "remark": "Your remark",
                "favourite": False
            }
        }

class ReviewUpdateModel(BaseModel):
    book_id: Optional[int]
    user_id: Optional[int]
    rate: Optional[int]
    remark: Optional[str]
    favourite: Optional[bool]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "book_id": 1,
                "user_id": 1,
                "rate": 0,
                "remark": "Your remark",
                "favourite": False
            }
        }