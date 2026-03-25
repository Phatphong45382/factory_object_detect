"""
Roboflow Inference Service for Workplace Safety Detection

Usage:
    from backend.services.roboflow import RoboflowService

    service = RoboflowService()
    result = service.analyze_image(image_bytes)
"""

from .service import RoboflowService
from .client_simple import RoboflowClient

__all__ = ["RoboflowService", "RoboflowClient"]
