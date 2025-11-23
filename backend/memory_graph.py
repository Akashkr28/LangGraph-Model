from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.redis import RedisSaver
from redis import Redis
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))
REDIS_USER = os.getenv("REDIS_USER")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")

if not all([REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD]):
    raise ValueError("Missing Redis env variables")

REDIS_URL = f"redis://{REDIS_USER}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}"

redis_conn = Redis.from_url(REDIS_URL)
print("Using Redis URL:", REDIS_URL)
checkpointer = RedisSaver(redis_client=redis_conn)

checkpointer.setup()

class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = init_chat_model(model_provider="openai", model="gpt-4o")

def chat_node(state: State):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph_builder = StateGraph(State)
graph_builder.add_node("chat_node", chat_node)
graph_builder.add_edge(START, "chat_node")
graph_builder.add_edge("chat_node", END)

memory_graph = graph_builder.compile(checkpointer=checkpointer)