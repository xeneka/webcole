import os
from pydantic_settings import BaseSettings

# SQLAlchemy 2.0 requiere "postgresql://" en lugar de "postgres://"
db_url = os.getenv("DATABASE_URL", "sqlite:///./colegio.db")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

class Settings(BaseSettings):
    PROJECT_NAME: str = "CEIP San Isidro API"
    DATABASE_URL: str = db_url
    
settings = Settings()
