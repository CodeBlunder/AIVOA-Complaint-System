# backend/app/agents/nodes/extract_node.py
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

EXTRACT_PROMPT = """You are a pharmaceutical QMS data extraction specialist.
The following text was extracted from a customer complaint document (email, PDF, or letter).
Extract all relevant complaint information and return it as a JSON object.

If a field cannot be found in the text, use null.

Required fields:
- complainant_name, complainant_company, complainant_email, complainant_phone
- product_name, batch_number, manufacturing_date, expiry_date, quantity_affected
- date_received, category (Quality/Packaging/Efficacy/Safety/Labeling/Other)
- description (comprehensive summary of the complaint)
- severity (Critical/Major/Minor based on content)
- assigned_to

Document text:
{document_text}

Return ONLY the JSON object."""

async def extract_document_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(EXTRACT_PROMPT)
    chain = prompt | llm
    
    text_to_process = state.get("extracted_text") or state.get("user_input", "")
    
    response = chain.invoke({"document_text": text_to_process})
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        form_data = json.loads(content)
        state["form_data"] = form_data
    except json.JSONDecodeError as e:
        state["error"] = f"Document extraction failed: {str(e)}"
        state["form_data"] = {}
    
    return state