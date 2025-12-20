import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import './ChatPage.css';

// Simple SVG Icons components to keep it zero-dependency
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (confirmDelete && auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
        alert("Account deleted.");
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          alert("Security: Please log out and log back in before deleting your account.");
        } else {
          console.error("Error deleting account:", error);
          alert(error.message);
        }
      }
    }
  };

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askBackend();
    }
  }

  async function askBackend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    const uid = auth.currentUser ? auth.currentUser.uid : "anonymous";

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMessage, 
            user_id: uid 
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "assistant", text: data.response }]);
      
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: "assistant", text: "Error connecting to local backend. Is Python running?" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-content">
          <div className="chat-logo">
            <div className="chat-logo-icon">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <div className="bubble bubble-3"></div>
            </div>
            <span className="chat-logo-text">langbot</span>
          </div>
          
          <div className="header-actions">
            <button 
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MenuIcon />
            </button>

            <div className={`header-menu ${showMenu ? 'show' : ''}`}>
              <button 
                onClick={handleLogout} 
                className="btn-action btn-logout"
                title="Log Out"
              >
                <LogoutIcon /> 
                <span>Logout</span>
              </button>

              <button 
                onClick={handleDeleteAccount} 
                className="btn-action btn-delete"
                title="Delete Account"
              >
                <TrashIcon />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-inner">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <div className="empty-icon-bg">
                  <BotIcon />
                </div>
              </div>
              <h2 className="empty-title">How can I help you today?</h2>
              <p className="empty-subtitle">Start a conversation to unlock your second brain.</p>
              
              <div className="suggestion-cards">
                <button className="suggestion-card" onClick={() => setInput("What can you help me with?")}>
                  <span className="suggestion-icon">💡</span>
                  <span>What can you help me with?</span>
                </button>
                <button className="suggestion-card" onClick={() => setInput("Tell me about your capabilities")}>
                  <span className="suggestion-icon">🎯</span>
                  <span>Tell me about your capabilities</span>
                </button>
                <button className="suggestion-card" onClick={() => setInput("How does memory work?")}>
                  <span className="suggestion-icon">🧠</span>
                  <span>How does memory work?</span>
                </button>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role}`}>
              <div className="message-content">
                <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
                  {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
                </div>
                
                <div className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row assistant">
              <div className="message-content">
                <div className="message-avatar bot-avatar">
                  <BotIcon />
                </div>
                <div className="message-bubble bot-message">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <div className="input-container-box">
            <div className="input-box">
              <textarea 
                placeholder="Message aihelp..."
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
            <p className="input-footer">
              Session: <span className="session-id">{threadId.slice(0, 12)}...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}