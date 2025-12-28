import React, { useState } from 'react';
import { useChatHistory } from '../context/ChatContext';
import './ChatSidebar.css';

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ChatSidebar = ({ isOpen, onClose }) => {
  const { chats, activeChat, createNewChat, switchChat, deleteChat, renameChat } = useChatHistory();
  const [hoveredChat, setHoveredChat] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = async () => {
    await createNewChat();
    if (window.innerWidth <= 768) onClose();
  };

  const handleSwitchChat = (chatId) => {
    switchChat(chatId);
    if (window.innerWidth <= 768) onClose();
  };

  const startEdit = (chat, e) => {
    e.stopPropagation();
    setEditingChat(chat.id);
    setEditTitle(chat.title);
  };

  const saveEdit = async (chatId) => {
    if (editTitle.trim()) {
      await renameChat(chatId, editTitle.trim());
    }
    setEditingChat(null);
  };

  const cancelEdit = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <span className="sidebar-title">Chats</span>
            <button className="close-sidebar-btn" onClick={onClose} title="Close sidebar">
              <XIcon />
            </button>
          </div>
          
          <button className="new-chat-btn" onClick={handleNewChat}>
            <PlusIcon />
            <span>New Chat</span>
          </button>
        </div>

        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="empty-chats">
              <MessageIcon />
              <p>No chats yet</p>
              <span>Start a new conversation</span>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => !editingChat && handleSwitchChat(chat.id)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <div className="chat-item-icon">
                  <MessageIcon />
                </div>
                
                {editingChat === chat.id ? (
                  <div className="chat-item-edit">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(chat.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(chat.id)} className="edit-btn save">
                      <CheckIcon />
                    </button>
                    <button onClick={cancelEdit} className="edit-btn cancel">
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="chat-item-content">
                      <div className="chat-item-title">{chat.title}</div>
                      <div className="chat-item-meta">
                        {chat.messages?.length || 0} messages · {formatDate(chat.updatedAt)}
                      </div>
                    </div>
                    
                    {(hoveredChat === chat.id || activeChat === chat.id) && (
                      <div className="chat-item-actions">
                        <button
                          className="action-btn edit"
                          onClick={(e) => startEdit(chat, e)}
                          title="Rename"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this chat?')) deleteChat(chat.id);
                          }}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;