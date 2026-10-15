
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
- manufacturing_date: string (YYYY-MM-DD format only)
- expiry_date: string (YYYY-MM-DD format only)
- quantity_affected: string
- date_received: string (today if not specified, YYYY-MM-DD format only)
- category: one of [Quality, Packaging, Efficacy, Safety, Labeling, Other]
- description: string (full complaint description)
- severity: one of [Critical, Major, Minor] based on patient safety risk
- assigned_to: string (if mentioned)

User input: {user_input}

Return ONLY the JSON object. No thinking. No explanation. No markdown."""


def extract_json_from_text(text: str) -> dict:
    """
    Extracts the first valid JSON object from LLM output.
    Handles <think> blocks, markdown fences, trailing text, multiple JSON objects.
    """
    # Step 1: Remove <think>...</think> blocks
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)

    # Step 2: Remove markdown fences
    text = re.sub(r'```(?:json)?', '', text)
    text = re.sub(r'```', '', text)
    text = text.strip()

    # Step 3: Find the first { and extract a balanced JSON object
    start = text.find('{')
    if start == -1:
        raise ValueError(f"No JSON object found in text: {text[:300]}")

    # Walk through characters counting braces to find the matching }
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
        raise ValueError(f"Could not find matching closing brace: {text[:300]}")

    json_str = text[start:end+1]
    print("EXTRACTED JSON STRING:", json_str[:300])

    return json.loads(json_str)


async def log_complaint_node(state: AgentState) -> AgentState:
    prompt = ChatPromptTemplate.from_template(LOG_PROMPT)
    chain = prompt | llm

    response = chain.invoke({"user_input": state["user_input"]})

    try:
        form_data = extract_json_from_text(response.content)
        print("LOG SUCCESS — fields:", list(form_data.keys()))
        state["form_data"] = form_data
        state["processing_notes"] = state.get("processing_notes", [])
        state["processing_notes"].append("Log node: Successfully extracted complaint fields")

    except (json.JSONDecodeError, ValueError) as e:
        print("LOG JSON ERROR:", str(e))
        print("RAW CONTENT:", response.content[:800])
        state["error"] = f"Failed to parse AI response: {str(e)}"
        state["form_data"] = {}

    return state
