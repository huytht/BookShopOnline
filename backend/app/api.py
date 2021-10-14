from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from .routers.book import router as router_book
from .routers.user import router as router_user 
from .routers.category import router as router_category 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:5020",
    "localhost:5020"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router_book, tags=["Books"], prefix="/book")
app.include_router(router_user, tags=["Users"], prefix="/user")
app.include_router(router_category, tags=["Categories"], prefix="/category")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
    app.mongodb = app.mongodb_client[settings.DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()