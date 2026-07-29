from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.agents.complaint_agent import run_log_agent, run_edit_agent, run_extract_agent
from app.services.document_parser import extract_text_from_file

router = APIRouter(prefix="/ai", tags=["ai"])



class LogComplaintRequest(BaseModel):
    prompt: str

class EditComplaintRequest(BaseModel):
    complaint_id: Optional[int] = None
    edit_instruction: str
    current_data: dict



@router.post("/log-complaint")
async def ai_log_complaint(request: LogComplaintRequest):
    """
    Accepts: { "prompt": "ABC Pharma called about batch B2024..." }
    Returns: { form_data: {...}, risk_assessment: {...} }
    """
    try:
        result = await run_log_agent(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/edit-complaint")
async def ai_edit_complaint(request: EditComplaintRequest):
    """
    Accepts: { "edit_instruction": "Change severity to Critical", "current_data": {...} }
    Returns: { form_data: {...}, edit_instructions: {...}, risk_assessment: {...} }
    """
    try:
        result = await run_edit_agent(request.edit_instruction, request.current_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-document")
async def ai_extract_document(file: UploadFile = File(...)):
    """
    Accepts: multipart file upload (PDF, DOCX, TXT, image)
    Returns: { form_data: {...}, risk_assessment: {...} }
    """
    try:
        content = await file.read()
        extracted_text = extract_text_from_file(content, file.filename, file.content_type)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the document.")
        result = await run_extract_agent(extracted_text)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/risk-assess")
async def ai_risk_assess(complaint_data: dict):
    """
    Accepts: complaint dict
    Returns: risk assessment object
    """
    from app.agents.nodes.risk_node import assess_risk
    try:
        result = await assess_risk(complaint_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
