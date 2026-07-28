# backend/app/agents/state.py
from typing import TypedDict, Optional, List

class AgentState(TypedDict):
    """
    The shared state passed between all LangGraph nodes.
    Each node reads and updates this state.
    """
    # Input
    user_input: str                        # Raw prompt or extracted document text
    action: str                            # "log", "edit", "extract"
    current_complaint_data: Optional[dict] # For edit actions — existing complaint
    
    # Intermediate
    extracted_text: Optional[str]          # Document text (for extract flow)
    
    # Output
    form_data: Optional[dict]              # Parsed complaint fields
    risk_assessment: Optional[dict]        # Risk classification output
    capa_data: Optional[dict]              # CAPA recommendations
    edit_instructions: Optional[dict]      # Fields to change (edit flow)
    
    # Metadata
    confidence_score: Optional[float]
    processing_notes: Optional[List[str]]
    error: Optional[str]