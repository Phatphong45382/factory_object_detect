from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SSCI Workplace Safety API"
    API_V1_STR: str = "/api/v1"
    
    # Dataiku Configuration
    DATAIKU_HOST: str = "https://your-dss-instance.com"
    DATAIKU_API_KEY: str = "your_api_key_here"
    DATAIKU_PROJECT_KEY: str = "WORKPLACE_SAFETY"
    DATAIKU_ENDPOINT_ID: str = "safety_object_detection"
    
    # Feature Flags
    USE_MOCK_DATAIKU: bool = True # Set to False when Dataiku is ready
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
