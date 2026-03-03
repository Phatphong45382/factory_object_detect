from pydantic import BaseModel
from typing import List, Optional

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Detection(BaseModel):
    label: str # e.g. "helmet", "no_helmet", "vest", "no_vest"
    confidence: float
    bbox: BoundingBox
    is_violation: bool

class DetectionResult(BaseModel):
    detections: List[Detection]
    total_persons: int
    violations_count: int
    compliance_rate: float
    processed_at: str
