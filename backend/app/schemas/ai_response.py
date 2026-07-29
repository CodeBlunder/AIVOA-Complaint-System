
from pydantic import BaseModel
from typing import Optional, List

class ExtractedComplaintData(BaseModel):
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

class RiskAssessment(BaseModel):
    severity: str
    risk_score: int                    
    risk_level: str                     
    regulatory_reportable: bool
    ai_summary: str
    root_cause_suggestion: str
    capa_recommendation: str
    key_concerns: List[str]

class AIProcessResult(BaseModel):
    extracted_data: ExtractedComplaintData
    risk_assessment: Optional[RiskAssessment] = None
    confidence_score: Optional[float] = None
    processing_notes: Optional[str] = None
