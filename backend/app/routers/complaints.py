# backend/app/routers/complaints.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.complaint import Complaint, AuditLog
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintResponse
import random, string
from datetime import datetime
    
router = APIRouter(prefix="/complaints", tags=["complaints"])

def generate_complaint_number():
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"CC-{year}-{suffix}"

@router.post("/", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    db_complaint = Complaint(
        **complaint.model_dump(),
        complaint_number=generate_complaint_number(),
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    # Audit log
    log = AuditLog(complaint_id=db_complaint.id, action="created",
                   changed_by="system", change_details="Complaint created")
    db.add(log)
    db.commit()
    return db_complaint

@router.get("/", response_model=List[ComplaintResponse])
def list_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Complaint).offset(skip).limit(limit).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(complaint_id: int, update: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(complaint, field, value)
    
    db.commit()
    db.refresh(complaint)
    
    log = AuditLog(complaint_id=complaint.id, action="edited",
                   changed_by="user", change_details=str(update.model_dump(exclude_unset=True)))
    db.add(log)
    db.commit()
    return complaint

@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    db.delete(complaint)
    db.commit()
    return {"message": "Deleted successfully"}