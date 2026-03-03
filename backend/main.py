from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import health, detection

# -- Mock Routers for future phases --
# from backend.routers import dashboard, incidents, config

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="Backend API for Workplace Safety Demo, powered by Dataiku DSS."
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Allow all origins for local prep
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Core Routes
    app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["System"])
    app.include_router(detection.router, prefix=f"{settings.API_V1_STR}/detection", tags=["AI Detection"])
    
    # Placeholders for Next Phase
    # app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])
    # app.include_router(incidents.router, prefix=f"{settings.API_V1_STR}/incidents", tags=["Incidents Logs"])

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8080, reload=True)
