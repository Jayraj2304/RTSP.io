import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import validator
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Flask settings
    flask_debug: bool = True
    flask_secret_key: str = "your-secret-key-here"
    
    # RTSP.me settings
    rtspme_email: Optional[str] = None
    rtspme_password: Optional[str] = None
    
    # MongoDB settings
    mongodb_url: str = "mongodb://localhost:27017/rtspio"
    
    # CORS settings
    cors_origins: list = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # Additional settings that might be in env files
    mongo_uri: Optional[str] = None
    jwt_secret: Optional[str] = None
    cors_origin: Optional[str] = None
    flask_env: Optional[str] = None
    
    @validator("rtspme_email", "rtspme_password", pre=True)
    def validate_rtspme_credentials(cls, v):
        if v is None:
            return os.getenv("RTSPME_EMAIL") or os.getenv("RTSPME_PASSWORD")
        return v
    
    @validator("mongodb_url", pre=True)
    def validate_mongodb_url(cls, v):
        return os.getenv("MONGODB_URL", v)
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

settings = Settings()
