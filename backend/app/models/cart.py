from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class CartModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    user_id: int = Field(...)
    created_date: Optional[datetime]
    status: bool = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "status": False
            }
        } 

class CartUpdateModel(BaseModel):
    user_id: Optional[int]
    status: Optional[bool]
    status: bool = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "status": False
            }
        } 