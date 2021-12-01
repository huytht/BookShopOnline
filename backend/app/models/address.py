from typing import Optional
from pydantic import BaseModel, Field

class AddressModel(BaseModel):
    id: Optional[int] = Field(alias="_id")
    province_city: str = Field(...)
    town_district: str = Field(...)
    street: str = Field(...)
    zip_code: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "province_city": "Long An",
                "town_district": "Thành phố Tân An",
                "street": "368/14 Châu Thị Kim",
                "zip_code": "70000"
            }
        }


class AddressUpdateModel(BaseModel):
    province_city: Optional[str]
    town_district: Optional[str]
    street: Optional[str]
    zip_code: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "province_city": "Long An",
                "town_district": "Thành phố Tân An",
                "street": "368/14 Châu Thị Kim",
                "zip_code": "70000"
            }
        }
