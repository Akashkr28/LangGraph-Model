import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import '../App.css';
import './ChatPage.css';

// Simple SVG Icons components to keep it zero-dependency
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const bottomRef = useRef(null);

  const [threadId] = useState(() => {
    const stored = localStorage.getItem('thread_id');
    if (stored) return stored;
    const newId = "thread-" + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());
    localStorage.setItem('thread_id', newId);
    return newId;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // Scroll when loading starts too

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // Cap height at 200px
    }
  }, [input]);

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
      e.preventDefault();
      askBackend();
    }
  }

  async function askBackend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('https://langgraph-model.onrender.com/api/memory-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message: userMessage }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.response }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I encountered an error connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-text">
          LangBot<span className="logo-highlight">.io</span>
        </div>
      </header>
      
      {/* Messages Area */}
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="avatar bot-avatar" style={{width: 60, height: 60, marginBottom: 20}}>
               <BotIcon />
            </div>
            <h2>How can I help you today?</h2>
            <p>Start a conversation to create a new memory thread.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            {/* Avatar only for Bot messages, or both if you prefer */}
            <div className={`avatar ${msg.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
            </div>
            
            <div className={`message-bubble ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text)}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="avatar bot-avatar">
              <BotIcon />
            </div>
            <div className="message-bubble bot-msg">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef}></div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-box">
          <textarea 
            placeholder='Message LangBot...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <button 
            onClick={askBackend} 
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            <SendIcon />
          </button>
        </div>
        <p className="footer-info">
          Session ID: <span style={{fontFamily: 'monospace'}}>{threadId.slice(0, 8)}...</span>
        </p>
      </div>
    </div>
  )
}