from typing import Optional
import uuid
from pydantic import BaseModel, Field

class InvoiceDetailsModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    invoice_id: str = Field(...)
    book_id: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "invoice_id": "615eb8d93a7cd08ecd132d60",
                "book_id": "615eb78a3a7cd08ecd132d53"
            }
        } 

class InvoiceDetailsUpdateModel(BaseModel):
    invoice_id: Optional[str]
    book_id: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "invoice_id": "615eb8d93a7cd08ecd132d60",
                "book_id": "615eb78a3a7cd08ecd132d53"
            }
        } 