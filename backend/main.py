from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.infrastructure.web.routes import router
from app.infrastructure.database.connection import engine, SessionLocal
from app.infrastructure.database import models
from app.core import security

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

# Create admin user if it doesn't exist
db = SessionLocal()
admin_user = db.query(models.DBUser).filter(models.DBUser.username == "admin").first()
if not admin_user:
    hashed_pw = security.get_password_hash("admin123")
    new_admin = models.DBUser(username="admin", hashed_password=hashed_pw)
    db.add(new_admin)
    db.commit()
db.close()

app = FastAPI(title="CEIP San Isidro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Backend CEIP San Isidro en ejecución"}
