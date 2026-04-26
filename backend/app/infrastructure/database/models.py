from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class DBPost(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    content = Column(Text)
    image_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, server_default="true")
    created_at = Column(DateTime, default=datetime.utcnow)

class DBDocument(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    image_url = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False, server_default="true")
    created_at = Column(DateTime, default=datetime.utcnow)

class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))

class DBEvent(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    image_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBPopup(Base):
    __tablename__ = "popup_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    is_active = Column(Boolean, default=False)
    title = Column(String(255), default="Última Hora")
    description = Column(Text, default="Mensaje importante aquí.")
    image_url = Column(String(500), nullable=True)
    link_url = Column(String(500), nullable=True)
