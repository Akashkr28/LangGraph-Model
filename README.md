# 🚀 LangGraph + OpenAI AI Workflow Engine

A collection of AI workflows built using **LangGraph** and **OpenAI**, demonstrating:

* A minimal conversational chatbot
* A multi-agent AI router
* Automatic code classification
* Code generation
* Code accuracy validation

This repository contains two executable workflow examples (`graph.py` and `code_graph.py`) to help you understand how to create LLM pipelines using graph-based architectures.

## 📁 Project Structure

```
.
├── graph.py           # Simple AI chatbot workflow
├── code_graph.py      # Multi-step coding assistant workflow
├── .env               # Your OpenAI API key (not included)
└── README.md
```

# 🔧 Requirements

Install dependencies:

```bash
pip install openai langgraph python-dotenv pydantic typing-extensions
```

You must also set your **OpenAI API key** inside a `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

# 🟦 Example 1 — Simple ChatBot Workflow (`graph.py`)

This example demonstrates the simplest possible LangGraph pipeline:

```
START → chat_bot → END
```

### 🧠 Features

* Takes user input
* Sends it to OpenAI
* Returns a clean response using LangGraph stateful workflow

### ▶ Run

```bash
python graph.py
```

### 🧩 Node Logic

```python
def chat_bot(state: State):
    query = state["query"]
    llm_response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": query}]
    )
    state["llm_result"] = llm_response.choices[0].message.content
    return state
```

# 🟨 Example 2 — Multi-Agent Coding Assistant (`code_graph.py`)

This example shows how LangGraph can manage complex workflows.

It performs:

1. **Message classification:** detect if a query is coding-related
2. **Conditional routing:** route to coding agent or general agent
3. **Code generation:** only for coding questions
4. **Accuracy validation:** checks quality of generated code

## 🧭 Workflow Architecture

```
START
  ↓
classify_message
  ↓
route_query ────────────────┐
  ↓                         │
coding_query → validate_code│
  ↓                         │
 END ←──────── general_query┘
```

## 🔥 Nodes Overview

### 1️⃣ classify_message

Uses a Pydantic model to parse structured output (`is_coding_question: bool`).

```python
response = client.beta.chat.completions.parse(
    model="gpt-4.1-nano",
    response_format=ClassifyMessageResponse,
    ...
)
```

### 2️⃣ route_query

Returns `"coding_query"` or `"general_query"`.

```python
return "coding_query" if state["is_coding_question"] else "general_query"
```

### 3️⃣ general_query

Uses standard model to answer general questions.


### 4️⃣ coding_query

Powered by `gpt-4.1` with a specialized system prompt to generate code.


### 5️⃣ coding_validate_query

Validates accuracy of generated code via structured output.

## ▶ Run

```bash
python code_graph.py
```

# 📌 Example Outputs

### ❓ Query:

```
How do I center a div in CSS?
```

### ✔ Result:

* classified as coding
* routed to coding_query
* answer generated
* accuracy percentage evaluated

### ❓ Query:

```
Who is the CEO of Apple?
```

### ✔ Result:

* classified as non-coding
* routed to general_query


# 🛠 Customization

You can extend this workflow by adding more nodes:

* 🔍 Code optimization
* 🧪 Test-case generation
* 🐞 Bug detection
* 📚 Explanation generator
* 🔁 Looping workflows

Just add new nodes and edges in the LangGraph builder.

# 🤝 Contributing

Pull requests and feature suggestions are welcome!
If you want help adding new workflow nodes, feel free to open an issue.

# ⭐ Support

If this project helps you, please ⭐ star the repository!
