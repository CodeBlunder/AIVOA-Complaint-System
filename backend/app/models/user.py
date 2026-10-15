from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String(200), unique=True, index=True)
    full_name  = Column(String(200))
    hashed_password = Column(String(255))
    is_active  = Column(Boolean, default=True)
    role       = Column(String(50), default="qa_officer")  # qa_officer, manager, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())