"""
Simple Roboflow Client using inference_sdk
Uses Roboflow Serverless API for hosted inference
"""

from typing import Optional
from inference_sdk import InferenceHTTPClient
from backend.config import settings


class RoboflowClient:
    """
    Client for Roboflow Serverless Inference API
    Uses inference_sdk for reliable communication
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_id: Optional[str] = None
    ):
        self.api_key = api_key or settings.ROBOFLOW_API_KEY
        self.model_id = model_id or settings.ROBOFLOW_MODEL_ID

        self._client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key=self.api_key
        )

    def infer(self, image_bytes: bytes) -> dict:
        """
        Run inference on image bytes

        Args:
            image_bytes: Raw image bytes

        Returns:
            Detection results with predictions and image info
        """
        import tempfile
        import os

        # inference_sdk needs a file path, so write bytes to a temp file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        try:
            result = self._client.infer(tmp_path, model_id=self.model_id)
        finally:
            os.unlink(tmp_path)

        return {
            "predictions": result.get("predictions", []),
            "image": result.get("image", {"width": 640, "height": 480})
        }

    def infer_from_file(self, image_path: str) -> dict:
        """Run inference on image file path"""
        result = self._client.infer(image_path, model_id=self.model_id)
        return {
            "predictions": result.get("predictions", []),
            "image": result.get("image", {"width": 640, "height": 480})
        }
