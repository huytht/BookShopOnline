from typing import Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

#Collection Review

class ReviewModel(BaseModel):
    
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    book_id: str = Field(...)
    user_id: str = Field(...)
    created_date: Optional[datetime]
    rate: int = Field(...)
    remark: str = Field(...)
    favourite: bool = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "book_id": "615eb78a3a7cd08ecd132d53",
                "user_id": "36355438-8af5-4fa7-8e4c-2372517df0b6",
                "rate": 0,
                "remark": "Your remark",
                "favourite": False
            }
        }

class ReviewUpdateModel(BaseModel):
    book_id: Optional[str]
    user_id: Optional[str]
    rate: Optional[int]
    remark: Optional[str]
    favourite: Optional[bool]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "book_id": "615eb78a3a7cd08ecd132d53",
                "user_id": "36355438-8af5-4fa7-8e4c-2372517df0b6",
                "rate": 0,
                "remark": "Your remark",
                "favourite": False
            }
        }