from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic.networks import HttpUrl
from datetime import datetime
from ..models import UserModel, UserUpdateModel

router = APIRouter()

@router.get("/", response_description="List all user")
async def list_users(request: Request):
    users = []
    for doc in await request.app.mongodb["user"].find().to_list(length=100):
        doc['date_of_birth'] = doc['date_of_birth'].strftime("%d/%m/%Y")
        doc['registration_date'] = doc['registration_date'].strftime("%d/%m/%Y")
        users.append(doc)

    return users

@router.get("/get-user/{id}", response_description="Get user detail")
async def get_user(id: str, request: Request):
    if (user := await request.app.mongodb["user"].find_one({"_id": id})) is not None:
        return user
    
    raise HTTPException(status_code=404, detail="User {id} not found")

@router.post("/create-user/")
async def create_user(request: Request, user: UserModel = Body(...)):
    user = jsonable_encoder(user)
    user['date_of_birth'] = datetime.strptime(user['date_of_birth'], "%Y-%m-%dT%H:%M:%S")
    user['registration_date'] = datetime.strptime(user['registration_date'], "%Y-%m-%dT%H:%M:%S.%f")
    new_user = await request.app.mongodb["user"].insert_one(user)
    created_user = await request.app.mongodb["user"].find_one(
        {"_id": new_user.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)

@router.put("/update-user/{id}")
async def update_user(id: str, request: Request, user: UserUpdateModel = Body(...)):
    user = {k: v for k, v in user.dict().items() if v is not None}

    if (len(user) >= 1):
        update_user_result = await request.app.mongodb["user"].update_one(
            {"_id": id},
            {"$set": user}
        )

        if update_user_result.modified_count == 1:
            if (update_user := await request.app.mongodb["user"].find_one(
                {"_id": id}
            )) is not None:
                return update_user

    if (existing_user := await request.app.mongodb["user"].find_one(
            {"_id": id}
        )) is not None:
        return existing_user
    
    raise HTTPException(status_code=404, detail=f"user {id} not found")

@router.delete("/delete-user/{id}")
async def delete_user(id: str, request: Request):
    delete_user = await request.app.mongodb["user"].delete_one({"_id": id})

    if delete_user.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"user {id} not found")