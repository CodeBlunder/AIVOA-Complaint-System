# backend/app/agents/nodes/edit_node.py
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.agents.state import AgentState

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.1,
)

EDIT_PROMPT = """You are a QMS data editor. A user wants to modify specific fields in an existing complaint record.

Current complaint data:
{current_data}

User's edit instruction:
{edit_instruction}

Return ONLY a JSON object with ONLY the fields that need to be changed.
Do not include fields that aren't being changed.
Use the same field names as in the current data.

Valid field names: complainant_name, complainant_company, complainant_email, complainant_phone,
product_name, batch_number, manufacturing_date, expiry_date, quantity_affected, date_received,
category, description, severity, assigned_to, status

Example output if user says "assign to Dr. Patel and mark as Critical":
{{"assigned_to": "Dr. Patel", "severity": "Critical"}}

Return ONLY the JSON."""

async def edit_complaint_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(EDIT_PROMPT)
    chain = prompt | llm
    
    response = chain.invoke({
        "current_data": json.dumps(state.get("current_complaint_data", {})),
        "edit_instruction": state["user_input"]
    })
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        edit_fields = json.loads(content)
        state["edit_instructions"] = edit_fields
        
        # Merge changes into form_data
        merged = {**state.get("current_complaint_data", {}), **edit_fields}
        state["form_data"] = merged
    except json.JSONDecodeError as e:
        state["error"] = f"Edit parsing failed: {str(e)}"
    
    return state