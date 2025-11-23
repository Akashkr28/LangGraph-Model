import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Initialize thread_id safely inside useState
  const [threadId] = useState(() => {
    const stored = localStorage.getItem('thread_id');
    if (stored) return stored;
    
    // Fallback if crypto is not available
    const newId = "thread-" + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());
    localStorage.setItem('thread_id', newId);
    return newId;
  });

  useEffect(() => {
    // Debug: Check if ID stays the same
    console.log("Current Thread ID:", threadId);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, threadId]);

  function handleKeyPress(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      askBackend();
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = textarea.scrollHeight + "px"; 
    }
  }, [input]);

  async function askBackend() {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(""); // Clear input immediately for better UX
    setMessages(prev => [...prev, {role:"user", text: userMessage}]);

    try {
      console.log(`Sending message with Thread ID: ${threadId}`);
      
      const res = await fetch('https://langgraph-model.onrender.com/api/memory-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          thread_id: threadId, // Uses the stable state variable
          message: userMessage 
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {role:"assistant", text: data.response}])
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, {role:"assistant", text: "Error connecting to server."}])
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>LangBot.io</h1>
      
      {/* Messages Area */}
      <div style={{
          marginTop: "20px", 
          maxHeight: "60vh", 
          overflowY: "auto", 
          border: "1px solid #333",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          backgroundColor: '#1a1a1a'
        }}>
        {messages.length === 0 && <p style={{opacity: 0.5, color: '#aaa', textAlign: 'center'}}>No messages yet.</p>}
        
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
                padding: "10px 15px",
                borderRadius: "10px",
                textAlign: "left",
                backgroundColor: msg.role === "user" ? "#007bff" : "#333",
                color: "white",
                maxWidth: "80%",
                wordWrap: "break-word"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input Area */}
      <div style={{display: "flex", alignItems: "flex-end", gap: "10px"}}>
        <textarea 
          placeholder='Ask a question...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '5px',
            resize: 'none', 
            minHeight: '45px',
            backgroundColor: '#222',
            color: 'white',
            border: '1px solid #444',
            outline: 'none'
          }}
          />

        <button 
          onClick={askBackend} 
          style={{
            height: '45px', 
            padding: '0 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Ask
        </button>
      </div>
      
      <p style={{fontSize: "10px", color: "#666", marginTop: "10px", textAlign: 'center'}}>
        Session ID: {threadId}
      </p>
    </div>
  )
}

export default App