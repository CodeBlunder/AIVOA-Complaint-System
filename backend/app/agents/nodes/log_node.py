# backend/app/agents/nodes/log_node.py
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.agents.state import AgentState

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.1,  # Low temp for structured extraction
)

LOG_PROMPT = """You are a pharmaceutical QMS expert. A user has described a customer complaint.
Extract the complaint details and return ONLY a valid JSON object with these fields.
If a field cannot be determined, use null.

Fields to extract:
- complainant_name: string
- complainant_company: string  
- complainant_email: string
- complainant_phone: string
- product_name: string (drug name + strength + form, e.g., "Amoxicillin 500mg Tablets")
- batch_number: string (lot/batch number)
- manufacturing_date: string
- expiry_date: string
- quantity_affected: string
- date_received: string (today if not specified, format: YYYY-MM-DD)
- category: one of [Quality, Packaging, Efficacy, Safety, Labeling, Other]
- description: string (full complaint description)
- severity: one of [Critical, Major, Minor] based on patient safety risk
- assigned_to: string (if mentioned)

User input: {user_input}

Return ONLY the JSON object, no other text."""

async def log_complaint_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(LOG_PROMPT)
    chain = prompt | llm
    
    response = chain.invoke({"user_input": state["user_input"]})
    
    try:
        # Parse the LLM JSON response
        content = response.content.strip()
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        form_data = json.loads(content)
        state["form_data"] = form_data
        state["processing_notes"] = state.get("processing_notes", [])
        state["processing_notes"].append("Log node: Successfully extracted complaint fields")
    except json.JSONDecodeError as e:
        state["error"] = f"Failed to parse AI response: {str(e)}"
        state["form_data"] = {}
    
    return state