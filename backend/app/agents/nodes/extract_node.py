
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

EXTRACT_PROMPT = """You are a pharmaceutical QMS data extraction specialist.
The following text was extracted from a customer complaint document (email, PDF, or letter).
Extract all relevant complaint information and return it as a JSON object.

If a field cannot be found in the text, use null.

Required fields:
- complainant_name, complainant_company, complainant_email, complainant_phone
- product_name, batch_number, quantity_affected
- manufacturing_date (YYYY-MM-DD format only, e.g., 2024-01-15)
- expiry_date (YYYY-MM-DD format only, e.g., 2026-03-01)
- date_received (YYYY-MM-DD format only)
- category (Quality/Packaging/Efficacy/Safety/Labeling/Other)
- description (comprehensive summary of the complaint)
- severity (Critical/Major/Minor based on content)
- assigned_to

IMPORTANT: All dates must be in YYYY-MM-DD format strictly.
Return ONLY the JSON object. No thinking. No explanation. No markdown.

Document text:
{document_text}"""


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


async def extract_document_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(EXTRACT_PROMPT)
    chain = prompt | llm

    text_to_process = state.get("extracted_text") or state.get("user_input", "")
    response = chain.invoke({"document_text": text_to_process})

    try:
        form_data = extract_json_from_text(response.content)
        print("EXTRACT SUCCESS — fields:", list(form_data.keys()))
        state["form_data"] = form_data

    except (json.JSONDecodeError, ValueError) as e:
        print("EXTRACT JSON ERROR:", str(e))
        print("RAW CONTENT:", response.content[:800])
        state["error"] = f"Document extraction failed: {str(e)}"
        state["form_data"] = {}

    return state
