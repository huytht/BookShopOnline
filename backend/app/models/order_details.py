from typing import Optional
from pydantic import BaseModel, Field

class OrderDetailsModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    order_id: int = Field(...)
    book_detail_id: int = Field(...)
    price: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "order_id": 1,
                "book_detail_id": 1,
                "price": 20000
            }
        } 

class OrderDetailsUpdateModel(BaseModel):
    order_id: Optional[int]
    book_detail_id: Optional[int]
    price: Optional[int]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "order_id": 1,
                "book_detail_id": 1,
                "price": 20000
            }
        } 