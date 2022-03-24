from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from passlib.context import CryptContext
from ..models.user import RegisterModel, UserModel, UserUpdateModel
import time

router = APIRouter()

TIME_FORMAT='%Y-%m-%dT%H:%M:%S'
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["user"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

    
def get_password_hash(password):
    return pwd_context.hash(password)

@router.get("/", response_description="List all user")
async def list_users(request: Request):
    users = []
    for doc in await request.app.mongodb["user"].find().to_list(length=100):
        if isinstance(doc['_id'], int):
            users.append(doc)

    return users

@router.get("/get-user/{id}", response_description="Get user detail")
async def get_user(id: int, request: Request):
    if (user := await request.app.mongodb["user"].find_one({"_id": id})) is not None:
        return user
    
    raise HTTPException(status_code=404, detail="User {id} not found")

@router.get("/get-all-role/{id}", response_description="Get all role")
async def get_all_role(id: int, request: Request):
    roles = []
    for user_role in await request.app.mongodb["users_roles"].find().to_list(length=1000):
        if isinstance(user_role['_id'], int):
            if (user_role['user_id'] == id):
                if (role := await request.app.mongodb["role"].find_one({"_id": user_role['role_id']})) is not None:
                    roles.append(role['name'])

    return roles

@router.post("/create-user/")
async def create_user(request: Request, user: UserModel = Body(...)):
    user = jsonable_encoder(user)
    user['password'] = get_password_hash(user['password'])
    # user['date_of_birth'] = datetime.strptime(user['date_of_birth'], TIME_FORMAT + "+00:00").timestamp()
    user['_id'] = int(await getNextSequence("userid", request))
    user['registration_date'] = int(time.time())
    new_user = await request.app.mongodb["user"].insert_one(user)
    created_user = await request.app.mongodb["user"].find_one(
        {"_id": new_user.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)

@router.post("/register/")
async def register(request: Request, userRegister: RegisterModel = Body(...)):
    userRegister = jsonable_encoder(userRegister)
    
    if (user := await request.app.mongodb["user"].find_one({"username": userRegister['username']})) is None:
        if (user := await request.app.mongodb["user"].find_one({"email": userRegister['email']})) is None:
            if (userRegister['password'] == userRegister['password_confirm']):
                new_user = await request.app.mongodb["user"].insert_one({
                    "_id": int(await getNextSequence("userid", request)),
                    "fullname": userRegister['lastName'] + " " + userRegister['firstName'],
                    "username": userRegister['username'],
                    "password": get_password_hash(userRegister['password']),
                    "email": userRegister['email'],
                    "registration_date": int(time.time()),
                    "avatar": "default-avatar.jpg",
                    "phone": "0988888888",
                    "date_of_birth": int(time.time()),
                    "gender": 1
                })
                created_user = await request.app.mongodb["user"].find_one(
                    {"_id": new_user.inserted_id}
                )
                return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)
            else: 
                return {"success": False, "message": "Mật khẩu và mật khẩu xác nhận không trùng khớp"}
        else: 
            return {"success": False, "message": "Email đã tồn tại"}
    else: 
        return {"success": False, "message": "Tài khoản đã tồn tại"}

@router.put("/update-user/{id}")
async def update_user(id: int, request: Request, user: UserUpdateModel = Body(...)):
    user = {k: v for k, v in user.dict().items() if v is not None}

    if (len(user) >= 1):
        # if user['password'] is not None:
        #     user['password'] = get_password_hash(user['password'])
        # print(user['date_of_birth'])
        # if user['date_of_birth'] is not None:
        #    user['date_of_birth'] = user['date_of_birth'].timestamp()        
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
async def delete_user(id: int, request: Request):
    delete_user = await request.app.mongodb["user"].delete_one({"_id": id})

    if delete_user.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"user {id} not found")

@router.get("/check-user/{username}")
async def check_user(username: str, request: Request):
    for user in await list_users(request):
        if user['username'] == username:
            return True

    return False

@router.get("/check-user/{username}/{id}")
async def check_user(username: str, id: int, request: Request):

    for user in await list_users(request):
        if user['username'] == username and user['_id'] != id:
            return True

    return False