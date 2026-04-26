import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.domain.models import PostCreate
from app.infrastructure.database.repository import PostRepository

class PostService:
    def __init__(self, repository: PostRepository):
        self.repo = repository
        
    def create_post(self, post_data: PostCreate):
        return self.repo.create(post_data)

    def get_all_posts(self):
        return self.repo.list_all()

    def delete_post(self, post_id: int) -> bool:
        return self.repo.delete(post_id)

    def update_post(self, post_id: int, post_update):
        return self.repo.update(post_id, post_update)

class DocumentService:
    def __init__(self, repository):
        self.repo = repository

    def create_document(self, doc_data):
        return self.repo.create(doc_data)

    def get_all_documents(self):
        return self.repo.list_all()

class AuthService:
    def __init__(self, repository):
        self.repo = repository

    def get_user(self, username):
        return self.repo.get_by_username(username)

    def create_user(self, username, hashed_pwd):
        return self.repo.create(username, hashed_pwd)

class EventService:
    def __init__(self, repository):
        self.repo = repository

    def create_event(self, event_data):
        return self.repo.create(event_data)

    def get_all_events(self):
        return self.repo.list_all()

class PopupService:
    def __init__(self, repository):
        self.repo = repository

    def get_popup(self):
        return self.repo.get_popup()

    def update_popup(self, popup_update):
        return self.repo.update_popup(popup_update)
