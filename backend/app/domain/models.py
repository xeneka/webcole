from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    is_active: Optional[bool] = None

class Post(PostBase):
    id: int
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class CenterDocumentBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    file_url: str

class CenterDocumentCreate(CenterDocumentBase):
    pass

class CenterDocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    is_active: Optional[bool] = None

class CenterDocument(CenterDocumentBase):
    id: int
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    id: int
    username: str
    hashed_password: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class EventBase(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PopupBase(BaseModel):
    is_active: bool = False
    title: str = "Última Hora"
    description: str = ""
    image_url: Optional[str] = None
    link_url: Optional[str] = None

class PopupUpdate(BaseModel):
    is_active: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None

class Popup(PopupBase):
    id: int
    
    class Config:
        from_attributes = True
