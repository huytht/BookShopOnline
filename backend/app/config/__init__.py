from pydantic import BaseSettings

class DatabaseSettings(BaseSettings):
    # DB_URL: str = "mongodb://localhost:27017"
    DB_URL: str = "mongodb+srv://sa:ga123456@cluster0.sto5m.mongodb.net/BookShopOnline?retryWrites=true&w=majority"
    DB_NAME: str = "BookShopOnline"

class Settings(DatabaseSettings):
    pass

settings = Settings()