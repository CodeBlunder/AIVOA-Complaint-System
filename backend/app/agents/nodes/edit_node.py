
import json
import re
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
from app.agents.state import AgentState

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="openai/gpt-oss-20b",
    temperature=0.1,
)

EDIT_PROMPT = """You are a QMS data editor. A user wants to modify specific fields in an existing complaint record.

Current complaint data:
{current_data}

User's edit instruction:
{edit_instruction}

Return ONLY a JSON object with ONLY the fields that need to be changed.
Do not include fields that are not being changed.

IMPORTANT RULES:
- All dates must be in YYYY-MM-DD format (e.g., 2026-03-15)
- severity must be one of: Critical, Major, Minor
- status must be one of: Open, Under Investigation, Pending CAPA, Closed
- category must be one of: Quality, Packaging, Efficacy, Safety, Labeling, Other

Valid field names: complainant_name, complainant_company, complainant_email, complainant_phone,
product_name, batch_number, manufacturing_date, expiry_date, quantity_affected, date_received,
category, description, severity, assigned_to, status

Return ONLY the JSON object. No thinking. No explanation. No markdown."""


def extract_json_from_text(text: str) -> dict:
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    text = re.sub(r'```(?:json)?', '', text)
    text = re.sub(r'```', '', text)
    text = text.strip()

    start = text.find('{')
    if start == -1:
        raise ValueError(f"No JSON object found: {text[:300]}")

    depth = 0
    in_string = False
    escape_next = False
    end = -1

    for i, ch in enumerate(text[start:], start=start):
        if escape_next:
            escape_next = False
            continue
        if ch == '\\' and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = i
                break

    if end == -1:
        raise ValueError(f"No closing brace found: {text[:300]}")

    return json.loads(text[start:end+1])


async def edit_complaint_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(EDIT_PROMPT)
    chain = prompt | llm

    response = chain.invoke({
        "current_data": json.dumps(state.get("current_complaint_data", {})),
        "edit_instruction": state["user_input"]
    })

    try:
        edit_fields = extract_json_from_text(response.content)
        print("EDIT SUCCESS — fields changed:", list(edit_fields.keys()))
        state["edit_instructions"] = edit_fields
        merged = {**state.get("current_complaint_data", {}), **edit_fields}
        state["form_data"] = merged

    except (json.JSONDecodeError, ValueError) as e:
        print("EDIT JSON ERROR:", str(e))
        print("RAW CONTENT:", response.content[:800])
        state["error"] = f"Edit parsing failed: {str(e)}"

    return state