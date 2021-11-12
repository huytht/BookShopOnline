from fastapi import FastAPI, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from .models.user import UserModel 
from .routers.book import router as router_book
from .routers.user import router as router_user 
from .routers.category import router as router_category 
from .routers.payment import router as router_payment 
from .routers.order import router as router_order 
from .routers.order_details import router as router_order_detail 
from .routers.review import router as router_review 
from .routers.authenticate import router as router_authenticate, get_current_user 
from .routers.cart import router as router_cart 
from .routers.cart_items import router as router_cart_items

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:8000",
    "localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root(current_user: UserModel = Depends(get_current_user)):
    return {"Hello": "World"}

app.include_router(router_book, tags=["Books"], prefix="/book")
app.include_router(router_user, tags=["Users"], prefix="/user")
app.include_router(router_category, tags=["Categories"], prefix="/category")
app.include_router(router_payment, tags=["Payments"], prefix="/payment")
app.include_router(router_order, tags=["Orders"], prefix="/order")
app.include_router(router_order_detail, tags=["Order Details"], prefix="/order-detail")
app.include_router(router_review, tags=["Reviews"], prefix="/review")
app.include_router(router_authenticate, tags=["Authenticate"], prefix="/authenticate")
app.include_router(router_cart, tags=["Carts"], prefix="/cart")
app.include_router(router_cart_items, tags=["Cart Items"], prefix="/cart-items")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL, tls=True, tlsAllowInvalidCertificates=True)
    app.mongodb = app.mongodb_client[settings.DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()