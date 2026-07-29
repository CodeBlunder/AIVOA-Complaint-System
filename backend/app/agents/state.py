
from typing import TypedDict, Optional, List

class AgentState(TypedDict):
    """
    The shared state passed between all LangGraph nodes.
    Each node reads and updates this state.
    """
   
    user_input: str                      
    action: str                           
    current_complaint_data: Optional[dict]
    
    extracted_text: Optional[str]       
    

    form_data: Optional[dict]             
    risk_assessment: Optional[dict]      
    capa_data: Optional[dict]              
    edit_instructions: Optional[dict]     
    

    confidence_score: Optional[float]
    processing_notes: Optional[List[str]]
    error: Optional[str]
