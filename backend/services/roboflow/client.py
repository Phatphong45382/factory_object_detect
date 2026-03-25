"""
Roboflow HTTP Client Wrapper
Handles communication with Roboflow Hosted Inference API

Uses 'inference' library as per official Roboflow docs:
https://inference.roboflow.com
"""

import os
from io import BytesIO
from typing import Optional
from PIL import Image
from backend.config import settings


class RoboflowClient:
    """
    Client for Roboflow Serverless Inference API
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_id: Optional[str] = None
    ):
        """
        Initialize Roboflow Client

        Args:
            api_key: Roboflow API Key
            model_id: Model ID in format "project-name/version"
        """
        self.api_key = api_key or settings.ROBOFLOW_API_KEY
        self.model_id = model_id or settings.ROBOFLOW_MODEL_ID

        self._model = None

        # Set API key for inference library
        os.environ["ROBOFLOW_API_KEY"] = self.api_key

    def _get_model(self):
        """Lazy load model"""
        if self._model is None:
            try:
                from inference import get_model
                self._model = get_model(model_id=self.model_id)
            except ImportError:
                raise ImportError(
                    "inference is not installed. "
                    "Run: pip install inference"
                )
        return self._model

    def infer(self, image_bytes: bytes) -> dict:
        """
        Run inference on image bytes

        Args:
            image_bytes: Raw image bytes

        Returns:
            Raw response from Roboflow API
        """
        # Convert bytes to PIL Image
        image = Image.open(BytesIO(image_bytes))

        # Convert to numpy array (format that inference library expects)
        import numpy as np
        image_array = np.array(image)

        # Get model and run inference
        model = self._get_model()
        results = model.infer(image_array)[0]

        # Return in consistent format
        return {
            "predictions": self._format_predictions(results),
            "image": {"width": image.width, "height": image.height}
        }

    def _format_predictions(self, results) -> list:
        """
        Format inference results to consistent structure

        Args:
            results: Inference results from model

        Returns:
            List of prediction dicts
        """
        predictions = []

        # Handle different result formats
        if hasattr(results, 'predictions'):
            # supervision Detections format
            for pred in results.predictions:
                predictions.append({
                    "x": pred.x,
                    "y": pred.y,
                    "width": pred.width,
                    "height": pred.height,
                    "confidence": pred.confidence,
                    "class": pred.class_name,
                    "class_id": pred.class_id
                })
        elif isinstance(results, list):
            # Direct list format
            for pred in results:
                predictions.append({
                    "x": pred.get("x", 0),
                    "y": pred.get("y", 0),
                    "width": pred.get("width", 0),
                    "height": pred.get("height", 0),
                    "confidence": pred.get("confidence", 0),
                    "class": pred.get("class", "unknown"),
                    "class_id": pred.get("class_id", 0)
                })
        elif isinstance(results, dict) and "predictions" in results:
            # Dict with predictions key
            return results["predictions"]

        return predictions

    def infer_from_file(self, image_path: str) -> dict:
        """
        Run inference on image file path

        Args:
            image_path: Path to image file

        Returns:
            Raw response from Roboflow API
        """
        with open(image_path, "rb") as f:
            return self.infer(f.read())
