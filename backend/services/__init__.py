"""
Detection Services

Available providers:
- RoboflowService: Hosted inference via Roboflow API
- DataikuService: On-premise inference via Dataiku DSS
- Factory: Auto-select based on config

Usage:
    # Method 1: Use factory (recommended)
    from backend.services import get_detection_service
    service = get_detection_service()

    # Method 2: Import directly
    from backend.services.roboflow import RoboflowService
    service = RoboflowService()

    # Method 3: Use Dataiku (legacy)
    from backend.services.dataiku_service import dataiku_service
"""

from .factory import get_detection_service
from .dataiku_service import DataikuService, dataiku_service

__all__ = [
    "get_detection_service",
    "DataikuService",
    "dataiku_service",
]