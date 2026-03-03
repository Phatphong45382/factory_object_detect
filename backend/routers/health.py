from fastapi import APIRouter
from backend.schemas.common import APIResponse

router = APIRouter()

@router.get("/")
def health_check():
    return APIResponse(
        success=True,
        message="SSCI Workplace Safety API is running",
        data={"status": "healthy"}
    )
