"""
Service Factory
Creates appropriate service instance based on configuration

Usage:
    from backend.services.factory import get_detection_service

    service = get_detection_service()
    result = service.analyze_image(image_bytes)
"""

from backend.config import settings, DetectionProvider
from backend.services.dataiku_service import dataiku_service, DataikuService
from backend.services.roboflow import RoboflowService


def get_detection_service():
    """
    Factory function to get the configured detection service

    Returns:
        Service instance based on DETECTION_PROVIDER config:
        - "roboflow" → RoboflowService
        - "dataiku" → DataikuService
        - "mock" → DataikuService (with mock mode enabled)

    Raises:
        ValueError: If DETECTION_PROVIDER is not recognized
    """
    provider = settings.DETECTION_PROVIDER

    if provider == DetectionProvider.ROBOFLOW:
        return RoboflowService()

    elif provider == DetectionProvider.DATAIKU:
        return DataikuService()

    elif provider == DetectionProvider.MOCK:
        # Use DataikuService but force mock mode
        return dataiku_service  # This already checks USE_MOCK_DATAIKU

    else:
        raise ValueError(
            f"Unknown DETECTION_PROVIDER: {provider}. "
            f"Must be one of: {list(DetectionProvider)}"
        )
