from sqlalchemy.orm import Session
from app.repositories.user import get_user_by_username
from app.core.security import verify_password
from app.models.user import User

def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
