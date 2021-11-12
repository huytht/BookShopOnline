from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class OrderModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    user_id: int = Field(...)
    created_date: Optional[datetime]
    total_money: int = Field(...)
    payment_id: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "total_money": 20000,
                "payment_id": 1
            }
        } 

class OrderUpdateModel(BaseModel):
    user_id: Optional[int]
    total_money: Optional[int]
    payment_id: Optional[int]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "total_money": 20000,
                "payment_id": 1
            }
        } 