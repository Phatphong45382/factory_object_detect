"""
Roboflow Service for Workplace Safety Detection
Converts Roboflow API responses to application schema
"""

from datetime import datetime
from typing import List, Set
from backend.schemas.detection import DetectionResult, Detection, BoundingBox
from backend.services.roboflow.client_simple import RoboflowClient


# Classes that count as safety violations (NOT wearing PPE)
VIOLATION_CLASSES: Set[str] = {
    "no_helmet", "no_vest", "no_safety_vest", "no_hard_hat",
    "no_gloves", "no_boots", "no_mask", "person_without_helmet",
    "person_without_vest"
}

# Classes that count as persons (for total count)
# Only count actual person detections, not PPE items
PERSON_CLASSES: Set[str] = {
    "person", "worker", "employee", "people"
}


class RoboflowService:
    """
    Service layer that wraps Roboflow Inference API
    and converts responses to DetectionResult schema
    """

    def __init__(self, client: RoboflowClient = None):
        """
        Initialize service

        Args:
            client: RoboflowClient instance (optional, creates default if None)
        """
        self.client = client or RoboflowClient()

    def analyze_image(self, image_bytes: bytes) -> DetectionResult:
        """
        Analyze image for PPE compliance

        Args:
            image_bytes: Raw image bytes

        Returns:
            DetectionResult with detections and summary metrics
        """
        # Call Roboflow API
        raw_result = self.client.infer(image_bytes)

        # Parse response
        detections = self._parse_detections(raw_result)

        # Calculate summary
        return self._calculate_summary(detections)

    def _parse_detections(self, raw_result: dict) -> List[Detection]:
        """
        Parse Roboflow API response into Detection objects

        Roboflow response format:
        {
            "predictions": [
                {
                    "x": 320.5,          # center x (absolute pixels)
                    "y": 200.0,          # center y (absolute pixels)
                    "width": 100.0,
                    "height": 80.0,
                    "confidence": 0.92,
                    "class": "helmet",
                    "class_id": 0
                },
                ...
            ],
            "image": {"width": 640, "height": 480}
        }
        """
        detections = []

        predictions = raw_result.get("predictions", [])
        image_info = raw_result.get("image", {})
        img_width = image_info.get("width", 1)
        img_height = image_info.get("height", 1)

        for pred in predictions:
            # Extract class name
            label = pred.get("class", "unknown").lower()

            # Calculate normalized bounding box
            # Roboflow gives center x,y in absolute pixels
            center_x = pred.get("x", 0)
            center_y = pred.get("y", 0)
            width = pred.get("width", 0)
            height = pred.get("height", 0)

            # Convert to top-left corner and normalize (0-1)
            x = (center_x - width / 2) / img_width
            y = (center_y - height / 2) / img_height
            w = width / img_width
            h = height / img_height

            # Clamp values to 0-1
            x = max(0.0, min(1.0, x))
            y = max(0.0, min(1.0, y))
            w = max(0.0, min(1.0, w))
            h = max(0.0, min(1.0, h))

            # Determine if this is a violation using substring matching
            # NOTE: FLIPPED FOR TESTING - normal items show as violations and vice versa
            is_violation = not any(
                v_class in label or label in v_class
                for v_class in VIOLATION_CLASSES
            )

            detection = Detection(
                label=label,
                confidence=round(pred.get("confidence", 0), 3),
                bbox=BoundingBox(
                    x=round(x, 4),
                    y=round(y, 4),
                    width=round(w, 4),
                    height=round(h, 4)
                ),
                is_violation=is_violation
            )

            detections.append(detection)

        return detections

    def _calculate_summary(self, detections: List[Detection]) -> DetectionResult:
        """
        Calculate summary metrics from detections
        """
        violations_count = sum(1 for d in detections if d.is_violation)

        # Count persons (heuristic: count helmet/hard_hat detections)
        total_persons = sum(
            1 for d in detections
            if any(p_class in d.label for p_class in PERSON_CLASSES)
        )

        # If no person-related detections but have detections, assume at least 1
        if total_persons == 0 and len(detections) > 0:
            total_persons = 1

        # Calculate compliance rate
        # Assumption: each person should have 2 PPE items (helmet + vest)
        if total_persons > 0:
            max_violations = total_persons * 2
            compliance_rate = max(0.0, 1.0 - (violations_count / max_violations))
        else:
            compliance_rate = 1.0

        return DetectionResult(
            detections=detections,
            total_persons=total_persons,
            violations_count=violations_count,
            compliance_rate=round(compliance_rate, 2),
            processed_at=datetime.utcnow().isoformat() + "Z"
        )
