# models.py
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Text, Uuid, ForeignKey, Boolean
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Uuid, nullable=False)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False, unique=True)
    file_hash = Column(String(64), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    mime_type = Column(String)
    category = Column(String)
    summary = Column(Text)
    embedding = Column(Vector(1024))
    upload_date = Column(DateTime(timezone=True), server_default=func.now())


class ShareLink(Base):
    __tablename__ = "share_links"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    created_by_user_id = Column(Uuid, nullable=False)
    password_hash = Column(String, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)