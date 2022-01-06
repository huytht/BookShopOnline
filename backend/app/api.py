from fastapi import FastAPI, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from .models.user import UserModel 
from .routers.book import router as router_book
from .routers.book_details import router as router_book_details
from .routers.user import router as router_user 
from .routers.category import router as router_category 
from .routers.payment import router as router_payment 
from .routers.order import router as router_order 
from .routers.order_details import router as router_order_detail 
from .routers.review import router as router_review 
from .routers.authenticate import router as router_authenticate, get_current_user 
from .routers.publisher import router as router_publisher
from .routers.province_city import router as router_province_city
from .routers.town_district import router as router_town_district
from .routers.address import router as router_address

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# origins = [
#     "http://localhost:3000",
#     "localhost:3000",
#     "http://localhost:8000",
#     "localhost:8000"
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router_book, tags=["Books"], prefix="/book")
app.include_router(router_book_details, tags=["Book Details"], prefix="/book-detail")
app.include_router(router_user, tags=["Users"], prefix="/user")
app.include_router(router_category, tags=["Categories"], prefix="/category")
app.include_router(router_payment, tags=["Payments"], prefix="/payment")
app.include_router(router_order, tags=["Orders"], prefix="/order")
app.include_router(router_order_detail, tags=["Order Details"], prefix="/order-detail")
app.include_router(router_review, tags=["Reviews"], prefix="/review")
app.include_router(router_authenticate, tags=["Authenticate"], prefix="/authenticate")
app.include_router(router_publisher, tags=["Publisher"], prefix="/publisher")
app.include_router(router_province_city, tags=["Province City"], prefix="/province-city")
app.include_router(router_town_district, tags=["Town District"], prefix="/town-district")
app.include_router(router_address, tags=["Addresses"], prefix="/address")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL, tls=True, tlsAllowInvalidCertificates=True)
    app.mongodb = app.mongodb_client[settings.DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()