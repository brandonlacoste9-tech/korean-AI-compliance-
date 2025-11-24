"""Database configuration and session management for Korean AI compliance."""
import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment (Supabase Seoul region recommended for PIPC compliance)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/korean_ai_compliance")

# Verify Seoul residency if DATABASE_URL contains identifiable region info
if "supabase" in DATABASE_URL.lower():
    # Log warning if not Seoul region (should contain ap-northeast-2 or seoul identifier)
    if "ap-northeast-2" not in DATABASE_URL.lower() and "seoul" not in DATABASE_URL.lower():
        import logging
        logging.warning(
            "⚠️ Database may not be in Seoul region. PIPC compliance requires data residency in South Korea. "
            "Ensure your Supabase project is configured for Seoul (ap-northeast-2) region."
        )

# SQLAlchemy engine configuration
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,
    max_overflow=10,
    echo=os.getenv("DATABASE_ECHO", "false").lower() == "true"
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI endpoints to get database session.
    
    Yields:
        Database session
        
    Example:
        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize database tables.
    Should be called on application startup.
    """
    Base.metadata.create_all(bind=engine)
