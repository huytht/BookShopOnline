from typing import Optional
import uuid
from pydantic import BaseModel, Field
from datetime import datetime

class InvoiceModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    user_id: str = Field(...)
    created_date: Optional[datetime]
    total_money: int = Field(...)
    payment_id: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "user_id": "36355438-8af5-4fa7-8e4c-2372517df0b6",
                "total_money": 20000,
                "payment_id": 1
            }
        } 

class InvoiceUpdateModel(BaseModel):
    user_id: Optional[str]
    total_money: Optional[int]
    payment_id: Optional[int]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": "36355438-8af5-4fa7-8e4c-2372517df0b6",
                "total_money": 20000,
                "payment_id": 1
            }
        } 