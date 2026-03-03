import requests
import json
import base64
import random
from datetime import datetime
from backend.config import settings
from backend.schemas.detection import DetectionResult, Detection, BoundingBox

class DataikuService:
    def __init__(self):
        self.host = settings.DATAIKU_HOST
        self.api_key = settings.DATAIKU_API_KEY
        self.project_key = settings.DATAIKU_PROJECT_KEY
        self.endpoint_id = settings.DATAIKU_ENDPOINT_ID
        self.use_mock = settings.USE_MOCK_DATAIKU

    def analyze_image(self, image_bytes: bytes) -> DetectionResult:
        if self.use_mock:
            return self._mock_analyze_image()
            
        # REAL DATAIKU INTEGRATION
        # Convert image to base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # This endpoint structure depends on how the API node is configured in Dataiku
        # Often it's: /public/api/v1/{project_key}/{endpoint_id}/predict
        url = f"{self.host}/public/api/v1/{self.project_key}/{self.endpoint_id}/predict"
        
        headers = {
            "Authorization": f"Basic {base64.b64encode(f'{self.api_key}:'.encode()).decode()}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "features": {
                "image_b64": image_b64
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Map Dataiku response to our internal DetectionResult schema
            # NOTE: This parsing logic MUST be adapted to the actual Dataiku output format
            detections_list = []
            
            # Example parsing (will vary based on the actual model output):
            raw_detections = data.get("result", {}).get("detections", [])
            for raw_d in raw_detections:
                is_violation = raw_d.get("label") in ["no_helmet", "no_vest"]
                detections_list.append(Detection(
                    label=raw_d.get("label", "unknown"),
                    confidence=raw_d.get("confidence", 0.0),
                    bbox=BoundingBox(**raw_d.get("bbox", {"x": 0, "y": 0, "width": 0, "height": 0})),
                    is_violation=is_violation
                ))
            
            return self._calculate_summary(detections_list)
            
        except requests.exceptions.RequestException as e:
            # Fallback to mock if requested or re-raise
            print(f"Dataiku API error: {e}")
            if self.use_mock:
                 return self._mock_analyze_image()
            raise Exception(f"Failed to communicate with Dataiku DSS: {str(e)}")

    def _mock_analyze_image(self) -> DetectionResult:
        """Returns a realistic mock response for pre-sale demo purposes"""
        # Determine pseudo-randomly if there are violations
        has_violation = random.random() > 0.5
        
        detections = []
        
        if has_violation:
            detections = [
                Detection(
                    label="helmet",
                    confidence=0.98,
                    bbox=BoundingBox(x=0.2, y=0.1, width=0.15, height=0.2),
                    is_violation=False
                ),
                Detection(
                    label="no_vest",
                    confidence=0.87,
                    bbox=BoundingBox(x=0.18, y=0.35, width=0.2, height=0.4),
                    is_violation=True
                )
            ]
        else:
            detections = [
                Detection(
                    label="helmet",
                    confidence=0.96,
                    bbox=BoundingBox(x=0.4, y=0.2, width=0.12, height=0.18),
                    is_violation=False
                ),
                Detection(
                    label="vest",
                    confidence=0.91,
                    bbox=BoundingBox(x=0.38, y=0.4, width=0.22, height=0.35),
                    is_violation=False
                )
            ]
            
        return self._calculate_summary(detections)
        
    def _calculate_summary(self, detections: list[Detection]) -> DetectionResult:
        """Calculates derived metrics from a list of detections"""
        violations_count = sum(1 for d in detections if d.is_violation)
        
        # Rough heuristic: count helmets + no_helmets as total persons
        total_persons = sum(1 for d in detections if d.label in ["helmet", "no_helmet", "person"])
        if total_persons == 0 and len(detections) > 0:
            total_persons = 1 # Assume at least 1 person if there are any detections
            
        compliance_rate = 1.0
        if total_persons > 0:
            compliance_rate = max(0.0, 1.0 - (violations_count / (total_persons * 2))) # Assume 2 required items per person
            
        return DetectionResult(
            detections=detections,
            total_persons=total_persons,
            violations_count=violations_count,
            compliance_rate=round(compliance_rate, 2),
            processed_at=datetime.utcnow().isoformat() + "Z"
        )

# Singleton instance
dataiku_service = DataikuService()
