from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.repository import PostRepository, DocumentRepository, UserRepository, EventRepository, PopupRepository
from app.application.use_cases import PostService, DocumentService, AuthService, EventService, PopupService
from app.domain.models import Post, PostCreate, PostUpdate, CenterDocument, CenterDocumentCreate, Token, Event, EventCreate, Popup, PopupUpdate
from app.core import security

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Dependencies Injection
def get_post_service(db: Session = Depends(get_db)):
    return PostService(PostRepository(db))

def get_document_service(db: Session = Depends(get_db)):
    return DocumentService(DocumentRepository(db))

def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(UserRepository(db))

def get_event_service(db: Session = Depends(get_db)):
    return EventService(EventRepository(db))

def get_popup_service(db: Session = Depends(get_db)):
    return PopupService(PopupRepository(db))

# JWT Dependency
def get_current_user(token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except security.jwt.JWTError:
        raise credentials_exception
    
    user = auth_service.get_user(username)
    if user is None:
        raise credentials_exception
    return user

# --- AUTH ROUTES ---
@router.post("/auth/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    user = auth_service.get_user(form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = security.timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- UPLOAD ROUTE ---
os.makedirs("uploads", exist_ok=True)

@router.post("/upload")
def upload_file(file: UploadFile = File(...), current_user = Depends(get_current_user)):
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_location = f"uploads/{unique_filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Return URL format compatible with frontend
    return {"url": f"/uploads/{unique_filename}"}

# --- POST ROUTES ---
@router.post("/posts/", response_model=Post)
def create_post(post: PostCreate, service: PostService = Depends(get_post_service), current_user = Depends(get_current_user)):
    return service.create_post(post)

@router.get("/posts/", response_model=List[Post])
def list_posts(service: PostService = Depends(get_post_service)):
    return service.get_all_posts()

@router.put("/posts/{post_id}", response_model=Post)
def update_post(post_id: int, post_update: PostUpdate, service: PostService = Depends(get_post_service), current_user = Depends(get_current_user)):
    post = service.update_post(post_id, post_update)
    if not post:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return post

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, service: PostService = Depends(get_post_service), current_user = Depends(get_current_user)):
    if not service.delete_post(post_id):
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return {"ok": True}

# --- DOCUMENT ROUTES ---
@router.post("/documents/", response_model=CenterDocument)
def create_document(doc: CenterDocumentCreate, service: DocumentService = Depends(get_document_service), current_user = Depends(get_current_user)):
    return service.create_document(doc)

@router.get("/documents/", response_model=List[CenterDocument])
def list_documents(service: DocumentService = Depends(get_document_service)):
    return service.get_all_documents()

# --- EVENT ROUTES ---
@router.post("/events/", response_model=Event)
def create_event(event: EventCreate, service: EventService = Depends(get_event_service), current_user = Depends(get_current_user)):
    return service.create_event(event)

@router.get("/events/", response_model=List[Event])
def list_events(service: EventService = Depends(get_event_service)):
    return service.get_all_events()

# --- POPUP ROUTES ---
@router.get("/popup/", response_model=Popup)
def get_popup_info(service: PopupService = Depends(get_popup_service)):
    return service.get_popup()

@router.put("/popup/", response_model=Popup)
def update_popup_info(popup_update: PopupUpdate, service: PopupService = Depends(get_popup_service), current_user = Depends(get_current_user)):
    return service.update_popup(popup_update)
