from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.database import engine, Base
from app.models import complaint as complaint_model  # noqa
from app.models import user as user_model            # noqa
from app.routers import complaints, ai, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Complaint Management System",
    description="AI-Powered Customer Complaint Management for Pharma QMS",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",    # Docker service name
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(ai.router)

# ── Override OpenAPI schema to show simple Bearer token box ──
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    # Apply to all routes
    for path in schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi

@app.get("/")
def root():
    return {"message": "AIVOA Complaint Management API", "status": "running"}