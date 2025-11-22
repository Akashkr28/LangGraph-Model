from fastapi import FastAPI
from pydantic import BaseModel
from code_graph import graph as code_graph
from fastapi.middleware.cors import CORSMiddleware
from graph import graph

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/api/ask")
def ask_question(request: QueryRequest):
    state = {
        "query": request.query,
        "llm_result": None
    }
    result = graph.invoke(state)
    return {"response": result["llm_result"]}

@app.post("/api/code")
def ask_code(request: QueryRequest):
    state = {
        "user_query": request.query,
        "llm_result": None,
        "accuracy_percentage": None,
        "is_coding_question": False
    }
    result = code_graph.invoke(state)
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
@app.post("/api/test")
def test_api():
    return {"message": "API is working!"}