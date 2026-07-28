# backend/app/models/complaint.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class SeverityEnum(str, enum.Enum):
    critical = "Critical"
    major = "Major"
    minor = "Minor"

class StatusEnum(str, enum.Enum):
    open = "Open"
    under_investigation = "Under Investigation"
    pending_capa = "Pending CAPA"
    closed = "Closed"

class CategoryEnum(str, enum.Enum):
    quality = "Quality"
    packaging = "Packaging"
    efficacy = "Efficacy"
    safety = "Safety"
    labeling = "Labeling"
    other = "Other"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True)
    
    # Complainant Info
    complainant_name = Column(String(200))
    complainant_company = Column(String(200))
    complainant_email = Column(String(200))
    complainant_phone = Column(String(50))
    
    # Product Info
    product_name = Column(String(200))
    batch_number = Column(String(100))
    manufacturing_date = Column(String(50))
    expiry_date = Column(String(50))
    quantity_affected = Column(String(100))
    
    # Complaint Details
    date_received = Column(String(50))
    category = Column(String(100))
    description = Column(Text)
    
    # AI-Generated Fields
    severity = Column(String(50))
    risk_score = Column(Integer, default=0)
    ai_summary = Column(Text)
    root_cause_suggestion = Column(Text)
    capa_recommendation = Column(Text)
    regulatory_reportable = Column(Boolean, default=False)
    
    # Assignment
    assigned_to = Column(String(200))
    status = Column(String(50), default="Open")
    
    # Source
    source = Column(String(50), default="Manual")  # Manual, Email, Document, AI-Prompt
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer)
    action = Column(String(100))   # created, edited, status_changed
    changed_by = Column(String(200))
    change_details = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())