from fastapi import APIRouter, Request, HTTPException, status, Response, Form
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()


@router.get("/", response_description="List all province_city")
async def list_province_city(request: Request):
    provinces_cities = []
    for doc in await request.app.mongodb["province_city"].find().to_list(length=100):
        doc['_id'] = str(doc['_id'])
        provinces_cities.append(doc)

    return provinces_cities

@router.get("/get-province-city/{code}", response_description="Get province city detail")
async def get_province_city(code: str, request: Request):
    if (province_city := await request.app.mongodb["province_city"].find_one({"code": code})) is not None:
        province_city['_id'] = str(province_city['_id'])
        return province_city

    raise HTTPException(status_code=404, detail=f"province_city {code} not found")


@router.get("/get-town-district-by-province-city/{code}", response_description="Get list town district")
async def get_town_district_list(code: str, request: Request):
    towns_districts = []
    for town_district in await request.app.mongodb["town_district"].find({'parent_code': code}).to_list(length=100):
        town_district['_id'] = str(town_district['_id'])
        towns_districts.append(town_district)
    return towns_districts
