import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CEIP San Isidro API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./colegio.db")
    
settings = Settings()
