import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "LearnLens AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "learnlens-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "learnlens")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
