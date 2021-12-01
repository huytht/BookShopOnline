from fastapi import APIRouter, Body, Request, HTTPException, status, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.logger import logger
from ..models.publisher import PublisherModel, PublisherUpdateModel
from typing import List
router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["publisher"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all publisher")
async def list_publisher(request: Request):
    categories = []
    for doc in await request.app.mongodb["publisher"].find().to_list(length=100):
        if isinstance(doc["_id"], int):
            categories.append(doc)

    return categories

@router.get("/get-publisher/{id}", response_description="Get publisher detail")
async def get_publisher(id: int, request: Request):
    if (publisher := await request.app.mongodb["publisher"].find_one({"_id": id})) is not None:
        return publisher
    
    raise HTTPException(status_code=404, detail="publisher {id} not found")

@router.post("/get-list-publisher/", response_description="Get publisher detail")
async def get_list_publisher(request: Request):
    request_data = await request.json()
    idList = request_data['idList']
    listCate = []
    for id in idList:
        if (publisher := await request.app.mongodb["publisher"].find_one({"_id": id})) is not None:
            listCate.append(publisher)

    if listCate is not None:
        return listCate 
    
    raise HTTPException(status_code=404, detail="publisher not found")

@router.post("/create-publisher/")
async def create_publisher(request: Request, publisher: PublisherModel = Body(...)):
    publisher = jsonable_encoder(publisher)
    new_publisher = await request.app.mongodb["publisher"].insert_one({
        "_id": int(await getNextSequence("publisherid", request)),
        "name": publisher['name']
    })
    
    created_publisher = await request.app.mongodb["publisher"].find_one(
        {"_id": new_publisher.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_publisher)

@router.put("/update-publisher/{id}")
async def update_publisher(id: int, request: Request, publisher: PublisherUpdateModel = Body(...)):
    publisher = {k: v for k, v in publisher.dict().items() if v is not None}

    if (len(publisher) >= 1):
        update_publisher_result = await request.app.mongodb["publisher"].update_one(
            {"_id": id},
            {"$set": publisher}
        )

        if update_publisher_result.modified_count == 1:
            if (update_publisher := await request.app.mongodb["publisher"].find_one(
                {"_id": id}
            )) is not None:
                return update_publisher

    if (existing_publisher := await request.app.mongodb["publisher"].find_one(
            {"_id": id}
        )) is not None:
        return existing_publisher
    
    raise HTTPException(status_code=404, detail=f"publisher {id} not found")

@router.delete("/delete-publisher/{id}")
async def delete_publisher(id: int, request: Request):
    delete_publisher = await request.app.mongodb["publisher"].delete_one({"_id": id})

    if delete_publisher.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"publisher {id} not found")

@router.get("/check-publisher/{name}")
async def check_publisher(name: str, request: Request):
    for publisher in await list_publisher(request):
        if publisher['name'].lower() == name.lower():
            return True

    return False

@router.get("/check-publisher/{name}/{id}")
async def check_publisher(name: str, id: int, request: Request):
    for publisher in await list_publisher(request):
        if publisher['name'].lower() == name.lower() and publisher['_id'] != id:
            return True

    return False