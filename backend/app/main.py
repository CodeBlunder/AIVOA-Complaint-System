# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import complaints, ai
from app.database import engine
from app.models import complaint as complaint_model

complaint_model.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Complaint Management System",
    description="AI-Powered Customer Complaint Management for Pharma QMS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "AIVOA Complaint Management API", "status": "running"}