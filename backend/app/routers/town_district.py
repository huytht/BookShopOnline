from fastapi import APIRouter, Request, HTTPException, status, Response, Form

router = APIRouter()

@router.get("/", response_description="List all town district")
async def list_town_district(request: Request):
    towns_districts = []
    for doc in await request.app.mongodb["town_district"].find().to_list(length=2000):
        doc['_id'] = str(doc['_id'])
        towns_districts.append(doc)

    return towns_districts

@router.get("/get-town-district/{code}", response_description="Get town district detail")
async def get_town_district(code: str, request: Request):
    if (town_district := await request.app.mongodb["town_district"].find_one({"code": code})) is not None:
        town_district['_id'] = str(town_district['_id'])
        return town_district
    
    raise HTTPException(status_code=404, detail=f"town_district {code} not found")

