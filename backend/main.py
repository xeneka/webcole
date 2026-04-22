from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.infrastructure.web.routes import router
from app.infrastructure.database.connection import engine, SessionLocal
from app.infrastructure.database import models
from app.core import security

models.Base.metadata.create_all(bind=engine)

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router, prefix="/api")

FRONTEND_DIST = Path(__file__).parent / "frontend_dist"

@app.get("/", include_in_schema=False)
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react(full_path: str = ""):
    file = FRONTEND_DIST / full_path
    if file.is_file():
        return FileResponse(file)
    return FileResponse(FRONTEND_DIST / "index.html")
