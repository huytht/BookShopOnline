from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class OrderModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    user_id: int = Field(...)
    created_date: Optional[datetime]
    total_money: int = Field(...)
    payment_id: int = Field(...)
    billing_address_id: int = Field(...)
    shipping_address_id: int = Field(...)
    order_tracking_number: Optional[str] = Field(alias="order_tracking_number", default_factory=uuid.uuid4)
    total_quantity: int = Field(...)
    status: Optional[str] = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "total_money": 20000,
                "payment_id": 1,
                "billing_address_id": 1,
                "shipping_address_id": 1,
                "total_quantity": 1,
                "status": "Complete"
            }
        }


class OrderUpdateModel(BaseModel):
    user_id: Optional[int]
    total_money: Optional[int]
    payment_id: Optional[int]
    billing_address_id: Optional[int]
    shipping_address_id: Optional[int]
    total_quantity: Optional[int]
    status: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "total_money": 20000,
                "payment_id": 1,
                "billing_address_id": 1,
                "shipping_address_id": 1,
                "total_quantity": 1,
                "status": "Complete"
            }
        }
