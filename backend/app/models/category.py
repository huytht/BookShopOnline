from typing import Optional
from pydantic import BaseModel, Field

#Collection Category

class CategoryModel(BaseModel):
    
    id: Optional[int] = Field(alias="_id")
    name: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "name": "name_category"
        }

class CategoryUpdateModel(BaseModel):
    name: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "name": "name_category"
        }