from fastapi import APIRouter, Body, Request, HTTPException, status, Response, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.logger import logger
from ..models.category import CategoryModel, CategoryUpdateModel
from typing import List
router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["category"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"



@router.get("/", response_description="List all category")
async def list_category(request: Request):
    categories = []
    for doc in await request.app.mongodb["category"].find().to_list(length=100):
        if isinstance(doc["_id"], int):
            categories.append(doc)

    return categories

@router.get("/get-category/{id}", response_description="Get category detail")
async def get_category(id: int, request: Request):
    if (category := await request.app.mongodb["category"].find_one({"_id": id})) is not None:
        return category
    
    raise HTTPException(status_code=404, detail="category {id} not found")

@router.post("/get-list-category/", response_description="Get category detail")
async def get_list_category(request: Request):
    request_data = await request.json()
    idList = request_data['idList']
    listCate = []
    for id in idList:
        if (category := await request.app.mongodb["category"].find_one({"_id": id})) is not None:
            listCate.append(category)

    if listCate is not None:
        return listCate 
    
    raise HTTPException(status_code=404, detail="category not found")

@router.post("/create-category/")
async def create_category(request: Request, category: CategoryModel = Body(...)):
    category = jsonable_encoder(category)
    new_category = await request.app.mongodb["category"].insert_one({
        "_id": int(await getNextSequence("categoryid", request)),
        "name": category['name']
    })
    
    created_category = await request.app.mongodb["category"].find_one(
        {"_id": new_category.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_category)

@router.put("/update-category/{id}")
async def update_category(id: int, request: Request, category: CategoryUpdateModel = Body(...)):
    category = {k: v for k, v in category.dict().items() if v is not None}

    if (len(category) >= 1):
        update_category_result = await request.app.mongodb["category"].update_one(
            {"_id": id},
            {"$set": category}
        )

        if update_category_result.modified_count == 1:
            if (update_category := await request.app.mongodb["category"].find_one(
                {"_id": id}
            )) is not None:
                return update_category

    if (existing_category := await request.app.mongodb["category"].find_one(
            {"_id": id}
        )) is not None:
        return existing_category
    
    raise HTTPException(status_code=404, detail=f"category {id} not found")

@router.delete("/delete-category/{id}")
async def delete_category(id: int, request: Request):
    delete_category = await request.app.mongodb["category"].delete_one({"_id": id})

    if delete_category.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"category {id} not found")

@router.get("/check-category/{name}")
async def check_category(name: str, request: Request):
    for category in await list_category(request):
        if category['name'].lower() == name.lower():
            return True

    return False

@router.get("/check-category/{name}/{id}")
async def check_category(name: str, id: int, request: Request):
    for category in await list_category(request):
        if category['name'].lower() == name.lower() and category['_id'] != id:
            return True

    return False