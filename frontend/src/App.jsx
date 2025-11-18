import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);


  async function testBackend() {
    const res =await fetch('http://localhost:8000/api/test', {
      method: 'POST',
    });
    const data = await res.json();
    console.log("Backend response: ", data);
  }

  async function askBackend() {
    setMessages(prev => [...prev, {role:"user", text: input}]);

    const res = await fetch('http://localhost:8000/api/ask', {
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

      <div>
        <input 
          type="text"
          placeholder='Ask a question...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '8px', width: '300px', marginTop: '20px' }}
          />

        <button onClick={askBackend} style={{marginLeft: '10px'}}>
          Ask
        </button>

      </div>

      <div style={{marginTop: "20px"}}>
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
                backgroundColor: msg.role === "user" ? "#d1e7dd" : "#f8d7da",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

      </div>

    </>
  )
}

export default App