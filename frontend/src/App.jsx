import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleKeyPress(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      askBackend();
    }
  }

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto"; //reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust height
    }
  }, [input]);

  async function testBackend() {
    const res =await fetch('https://langgraph-model.onrender.com/api/test', {
      method: 'POST',
    });
    const data = await res.json();
    console.log("Backend response: ", data);
  }

  async function askBackend() {
    setMessages(prev => [...prev, {role:"user", text: input}]);

    const res = await fetch('https://langgraph-model.onrender.com/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: input }),
  });

  const data = await res.json();

  setMessages(prev => [...prev, {role:"assistant", text: data.response}])
  setInput("");
  }

  return (
    <>
      <h1>LangBot.io</h1>
      
      <div style={{display: "flex", alignItems: "baseline"}}>
        <textarea 
          type="text"
          placeholder='Ask a question...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          style={{ padding: '8px', width: '300px', marginTop: '20px', resize: 'none', overflow: 'hidden' }}
          />

        <button onClick={askBackend} style={{marginLeft: '10px'}}>
          Ask
        </button>

      </div>

      <div style={{marginTop: "20px", maxHeight: "400px", overflowY: "auto"}}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.role === "user" ? "right" : "left"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                textAlign: msg.role === "user" ? "right" : "left",
                backgroundColor: msg.role === "user" ? "black" : "blue",
                textColor: msg.role === "user" ? "white" : "white",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

      </div>

      <div ref={bottomRef}></div>

    </>
  )
}

export default App