from fastapi import APIRouter, File, UploadFile, HTTPException
from backend.schemas.common import APIResponse
from backend.schemas.detection import DetectionResult
from backend.services.dataiku_service import dataiku_service

router = APIRouter()

@router.post("/analyze", response_model=APIResponse[DetectionResult])
async def analyze_image(file: UploadFile = File(...)):
    """
    Receives an uploaded image, sends it to Dataiku DSS for inference,
    and returns bounding boxes and safety metrics.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image")
        
    try:
        # Read file contents into memory
        contents = await file.read()
        
        # Call the Dataiku service
        result = dataiku_service.analyze_image(contents)
        
        return APIResponse(
            success=True,
            message="Analysis complete",
            data=result
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            message="Internal server error",
            error=str(e)
        )
