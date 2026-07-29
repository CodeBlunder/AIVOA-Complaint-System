
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.agents.state import AgentState

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.2,
)

RISK_PROMPT = """You are a pharmaceutical risk assessment expert with knowledge of ICH Q10, FDA 21 CFR Part 211, and EU GMP.

Analyze this customer complaint and provide a comprehensive risk assessment.

Complaint Details:
{complaint_data}

Return a JSON object with:
{{
  "severity": "Critical" | "Major" | "Minor",
  "risk_score": integer between 1-100,
  "risk_level": "Critical" | "Major" | "Minor",
  "regulatory_reportable": true | false,
  "ai_summary": "2-3 sentence summary of the complaint",
  "root_cause_suggestion": "Most likely root cause based on the complaint type",
  "capa_recommendation": "Specific CAPA steps recommended",
  "key_concerns": ["concern 1", "concern 2", "concern 3"]
}}

Risk scoring guidance:
- Critical (70-100): Patient safety risk, sterility failure, contamination, wrong product
- Major (40-69): Quality defect affecting product efficacy, packaging failure
- Minor (1-39): Cosmetic issues, minor labeling errors, documentation discrepancies

Regulatory reportable if: safety risk to patient, death/serious injury, contamination, counterfeiting.

Return ONLY the JSON."""

async def risk_assessment_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(RISK_PROMPT)
    chain = prompt | llm
    
    complaint_data = state.get("form_data", {})
    
    response = chain.invoke({"complaint_data": json.dumps(complaint_data, indent=2)})
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        risk_data = json.loads(content)
        state["risk_assessment"] = risk_data
        
        
        if state.get("form_data"):
            state["form_data"]["severity"] = risk_data.get("severity")
            state["form_data"]["risk_score"] = risk_data.get("risk_score")
    except json.JSONDecodeError as e:
        state["error"] = f"Risk assessment failed: {str(e)}"
    
    return state

async def assess_risk(complaint_data: dict) -> dict:
    """Standalone function callable from router"""
    state: AgentState = {
        "user_input": "",
        "action": "risk",
        "current_complaint_data": None,
        "extracted_text": None,
        "form_data": complaint_data,
        "risk_assessment": None,
        "capa_data": None,
        "edit_instructions": None,
        "confidence_score": None,
        "processing_notes": [],
        "error": None,
    }
    result = await risk_assessment_node(state)
    return result.get("risk_assessment", {})
