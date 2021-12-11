from ..models.user import UserModel, UserUpdateModel, LoginModel
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, APIRouter, Request
from typing import Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from passlib.context import CryptContext
from .user import get_all_role

router = APIRouter()

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256" # SHA-256
ACCESS_TOKEN_EXPIRE_MINUTES = 5
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorize",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        role: str = payload.get("role")
        if username is None or role != "admin":
            raise credentials_exception
        else:
            return username
    except JWTError:
        raise credentials_exception

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def validate_user(model: LoginModel, request: Request):
    
    if (user := await request.app.mongodb["user"].find_one({"username": model.username})) is not None:
        if user and verify_password(model.password, user['password']):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"username": user['username'], "id": user['_id']}, expires_delta=access_token_expires
            )
            return {"success": True, "id": user['_id'], "username": user['username'], "email": user['email'], "roles": await get_all_role(user['_id'], request), "accessToken": access_token}
        else:
            return {"success": False, "message": "Sai mật khẩu"}
    else:
        return {"success": False, "message": "Tài khoản/mật khẩu khồng chính xác"}
