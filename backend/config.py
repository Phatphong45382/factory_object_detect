from enum import Enum
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class DetectionProvider(str, Enum):
    """Available detection service providers"""
    ROBOFLOW = "roboflow"
    DATAIKU = "dataiku"
    MOCK = "mock"


class Settings(BaseSettings):
    PROJECT_NAME: str = "SSCI Workplace Safety API"
    API_V1_STR: str = "/api/v1"

    # ============================================
    # Detection Provider Selection
    # ============================================
    # Choose: "roboflow" | "dataiku" | "mock"
    DETECTION_PROVIDER: DetectionProvider = DetectionProvider.ROBOFLOW

    # ============================================
    # Roboflow Configuration (for DETECTION_PROVIDER="roboflow")
    # ============================================
    ROBOFLOW_API_KEY: str = "your_roboflow_api_key_here"
    # Model ID format: "project-name/version"
    # Example PPE models:
    #   - "construction-safety-gsnvb/1"
    #   - "ppe-detection-g3j6j/1"
    #   - "safety-helmet-detection-7n1ng/1"
    ROBOFLOW_MODEL_ID: str = "construction-safety-gsnvb/1"

    # ============================================
    # Dataiku Configuration (for DETECTION_PROVIDER="dataiku")
    # ============================================
    DATAIKU_HOST: str = "https://your-dss-instance.com"
    DATAIKU_API_KEY: str = "your_api_key_here"
    DATAIKU_PROJECT_KEY: str = "WORKPLACE_SAFETY"
    DATAIKU_ENDPOINT_ID: str = "safety_object_detection"

    # Feature Flags (legacy - use DETECTION_PROVIDER="mock" instead)
    USE_MOCK_DATAIKU: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
