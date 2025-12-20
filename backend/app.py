from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mem0 import Memory
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
# We use the config structure you provided earlier
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

mem0_config = {
    "version": "v1.1",
    "embedder": {
        "provider": "openai",
        "config": {
            "api_key": OPENAI_API_KEY,
            "model": "text-embedding-3-small"
        }
    },
    "llm": { 
        "provider": "openai", 
        "config": {
            "api_key": OPENAI_API_KEY, 
            "model": "gpt-4-turbo" 
        } 
    },
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "url": os.getenv("QDRANT_URL"),
            "api_key": os.getenv("QDRANT_API_KEY"),
        }
    },
    "graph_store": {
        "provider": "neo4j",
        "config": {
            "url": "bolt://localhost:7687", # Assumes local Docker
            "username": "neo4j",
            "password": "password", # UPDATE THIS
            "database": "neo4j"
        }
    }
}

# Initialize Clients
memory_client = Memory.from_config(mem0_config)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# --- Data Models ---
class ChatRequest(BaseModel):
    message: str
    user_id: str # Crucial: Mem0 attaches memories to a User ID

class ChatResponse(BaseModel):
    response: str

# --- API Endpoint ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        # 1. RETRIEVE MEMORIES (The "Second Brain" part)
        # Search for past memories relevant to the current user message
        relevant_memories = memory_client.search(query=req.message, user_id=req.user_id)
        
        # Format memories for the AI
        memories_text = [
            f"Memory: {mem.get('memory')}" for mem in relevant_memories.get("results", [])
        ]
        
        system_prompt = f"""
        You are a helpful assistant with access to the user's long-term memory.
        Use the following relevant memories to personalize your answer:
        {json.dumps(memories_text)}
        """

        # 2. GENERATE RESPONSE
        completion = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.message}
            ]
        )
        ai_response = completion.choices[0].message.content

        # 3. SAVE NEW MEMORY
        # Add the interaction to mem0 so it's remembered next time
        memory_client.add(
            [
                {"role": "user", "content": req.message},
                {"role": "assistant", "content": ai_response}
            ], 
            user_id=req.user_id
        )

        return ChatResponse(response=ai_response)

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)