from typing import Optional
from pydantic import BaseModel, Field

class CartItemsModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    cart_id: int = Field(...)
    book_id: int = Field(...)
    quantity: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "cart_id": 1,
                "book_id": 1,
                "quantity": 1
            }
        } 

class CartItemsUpdateModel(BaseModel):
    cart_id: Optional[int]
    book_id: Optional[int]
    quantity: Optional[int]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "cart_id": 1,
                "book_id": 1,
                "quantity": 1
            }
        } 