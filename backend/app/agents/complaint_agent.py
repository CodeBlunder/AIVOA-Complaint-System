from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes.log_node import log_complaint_node
from app.agents.nodes.edit_node import edit_complaint_node
from app.agents.nodes.extract_node import extract_document_node
from app.agents.nodes.risk_node import risk_assessment_node

def route_action(state: AgentState) -> str:
    action = state.get("action", "log")
    if action == "log":
        return "log_node"
    elif action == "edit":
        return "edit_node"
    elif action == "extract":
        return "extract_node"
    return "log_node"

def build_complaint_graph():
    graph = StateGraph(AgentState)

    graph.add_node("router",       lambda s: s)
    graph.add_node("log_node",     log_complaint_node)
    graph.add_node("edit_node",    edit_complaint_node)
    graph.add_node("extract_node", extract_document_node)
    graph.add_node("risk_node",    risk_assessment_node)

    graph.set_entry_point("router")

    graph.add_conditional_edges(
        "router",
        route_action,
        {
            "log_node":     "log_node",
            "edit_node":    "edit_node",
            "extract_node": "extract_node",
        }
    )

    graph.add_edge("log_node",     "risk_node")
    graph.add_edge("extract_node", "risk_node")
    graph.add_edge("edit_node",    "risk_node")
    graph.add_edge("risk_node",    END)

    return graph.compile()

complaint_graph = build_complaint_graph()

def _base_state(action: str) -> AgentState:
    return {
        "user_input":             "",
        "action":                 action,
        "current_complaint_data": None,
        "extracted_text":         None,
        "form_data":              None,
        "risk_assessment":        None,
        "capa_data":              None,
        "edit_instructions":      None,
        "confidence_score":       None,
        "processing_notes":       [],
        "error":                  None,
    }

async def run_log_agent(prompt: str) -> dict:
    state = _base_state("log")
    state["user_input"] = prompt
    result = await complaint_graph.ainvoke(state)
    return {
        "form_data":        result.get("form_data", {}),
        "risk_assessment":  result.get("risk_assessment", {}),
        "processing_notes": result.get("processing_notes", []),
        "error":            result.get("error"),
    }

async def run_edit_agent(instruction: str, current_data: dict) -> dict:
    state = _base_state("edit")
    state["user_input"]             = instruction
    state["current_complaint_data"] = current_data
    result = await complaint_graph.ainvoke(state)
    return {
        "form_data":         result.get("form_data", {}),
        "edit_instructions": result.get("edit_instructions", {}),
        "risk_assessment":   result.get("risk_assessment", {}),
        "error":             result.get("error"),
    }

async def run_extract_agent(document_text: str) -> dict:
    state = _base_state("extract")
    state["user_input"]     = document_text
    state["extracted_text"] = document_text
    result = await complaint_graph.ainvoke(state)
    return {
        "form_data":       result.get("form_data", {}),
        "risk_assessment": result.get("risk_assessment", {}),
        "error":           result.get("error"),
    }
