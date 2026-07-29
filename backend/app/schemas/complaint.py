
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    complainant_name: Optional[str] = None
    complainant_company: Optional[str] = None
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    quantity_affected: Optional[str] = None
    date_received: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = "Open"
    source: Optional[str] = "Manual"

class ComplaintUpdate(ComplaintCreate):
    pass

class ComplaintResponse(ComplaintCreate):
    id: int
    complaint_number: str
    risk_score: Optional[int] = 0
    ai_summary: Optional[str] = None
    root_cause_suggestion: Optional[str] = None
    capa_recommendation: Optional[str] = None
    regulatory_reportable: Optional[bool] = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
