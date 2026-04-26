from sqlalchemy.orm import Session
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from app.domain.models import PostCreate, PostUpdate, CenterDocumentCreate, CenterDocumentUpdate, EventCreate, PopupUpdate
from app.infrastructure.database.models import DBPost, DBDocument, DBUser, DBEvent, DBPopup

class PostRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, post_create: PostCreate) -> DBPost:
        db_post = DBPost(**post_create.model_dump())
        self.db.add(db_post)
        self.db.commit()
        self.db.refresh(db_post)
        return db_post

    def list_all(self):
        return self.db.query(DBPost).order_by(DBPost.created_at.desc()).all()

    def get_by_id(self, post_id: int):
        return self.db.query(DBPost).filter(DBPost.id == post_id).first()

    def delete(self, post_id: int) -> bool:
        post = self.get_by_id(post_id)
        if not post:
            return False
        self.db.delete(post)
        self.db.commit()
        return True

    def update(self, post_id: int, post_update: PostUpdate):
        post = self.get_by_id(post_id)
        if not post:
            return None
        for key, value in post_update.model_dump(exclude_unset=True).items():
            setattr(post, key, value)
        self.db.commit()
        self.db.refresh(post)
        return post

class DocumentRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, doc_create) -> DBDocument:
        db_doc = DBDocument(**doc_create.model_dump())
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def list_all(self):
        return self.db.query(DBDocument).order_by(DBDocument.created_at.desc()).all()

    def get_by_id(self, doc_id: int):
        return self.db.query(DBDocument).filter(DBDocument.id == doc_id).first()

    def delete(self, doc_id: int) -> bool:
        doc = self.get_by_id(doc_id)
        if not doc:
            return False
        self.db.delete(doc)
        self.db.commit()
        return True

    def update(self, doc_id: int, doc_update: CenterDocumentUpdate):
        doc = self.get_by_id(doc_id)
        if not doc:
            return None
        for key, value in doc_update.model_dump(exclude_unset=True).items():
            setattr(doc, key, value)
        self.db.commit()
        self.db.refresh(doc)
        return doc

class UserRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def get_by_username(self, username: str):
        return self.db.query(DBUser).filter(DBUser.username == username).first()

    def create(self, username, hashed_password):
        db_user = DBUser(username=username, hashed_password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

class EventRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, event_create: EventCreate) -> DBEvent:
        db_event = DBEvent(**event_create.model_dump())
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def list_all(self):
        return self.db.query(DBEvent).order_by(DBEvent.start_date.asc()).all()

class PopupRepository:
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def get_popup(self) -> DBPopup:
        popup = self.db.query(DBPopup).first()
        if not popup:
            popup = DBPopup()
            self.db.add(popup)
            self.db.commit()
            self.db.refresh(popup)
        return popup
        
    def update_popup(self, popup_update: PopupUpdate) -> DBPopup:
        popup = self.get_popup()
        if popup_update.is_active is not None:
            popup.is_active = popup_update.is_active
        if popup_update.title is not None:
            popup.title = popup_update.title
        if popup_update.description is not None:
            popup.description = popup_update.description
        if popup_update.image_url is not None:
            popup.image_url = popup_update.image_url
        if popup_update.link_url is not None:
            popup.link_url = popup_update.link_url
            
        self.db.commit()
        self.db.refresh(popup)
        return popup
