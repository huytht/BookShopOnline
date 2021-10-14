from pydantic import BaseSettings

class DatabaseSettings(BaseSettings):
    DB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "BookShopOnline"

class Settings(DatabaseSettings):
    pass

settings = Settings()