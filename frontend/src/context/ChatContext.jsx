import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

const ChatContext = createContext();

export const useChatHistory = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatHistory must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setChats([]);
      setActiveChat(null);
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;
    const chatsRef = collection(db, 'users', userId, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setChats(chatList);
        
        if (!activeChat && chatList.length > 0) {
          setActiveChat(chatList[0].id);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error("Error loading chats:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const createNewChat = async () => {
    if (!auth.currentUser) return null;

    try {
      const userId = auth.currentUser.uid;
      const chatsRef = collection(db, 'users', userId, 'chats');
      
      const newChat = {
        title: 'New Chat',
        messages: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(chatsRef, newChat);
      setActiveChat(docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  const updateChatMessages = async (chatId, messages) => {
    if (!auth.currentUser || !chatId) return;

    try {
      const userId = auth.currentUser.uid;
      const chatRef = doc(db, 'users', userId, 'chats', chatId);

      const currentChat = chats.find(c => c.id === chatId);
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = (currentChat?.title === 'New Chat' && firstUserMessage)
        ? firstUserMessage.text.substring(0, 40) + (firstUserMessage.text.length > 40 ? '...' : '')
        : currentChat?.title || 'New Chat';

      await updateDoc(chatRef, {
        messages,
        title,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  };

  const deleteChat = async (chatId) => {
    if (!auth.currentUser) return;

    try {
      const userId = auth.currentUser.uid;
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      
      await deleteDoc(chatRef);

      if (activeChat === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setActiveChat(remainingChats[0].id);
        } else {
          const newChatId = await createNewChat();
          setActiveChat(newChatId);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const renameChat = async (chatId, newTitle) => {
    if (!auth.currentUser) return;

    try {
      const userId = auth.currentUser.uid;
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      
      await updateDoc(chatRef, {
        title: newTitle,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const getActiveChat = () => {
    return chats.find(chat => chat.id === activeChat) || null;
  };

  const switchChat = (chatId) => {
    setActiveChat(chatId);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      loading,
      createNewChat,
      updateChatMessages,
      deleteChat,
      renameChat,
      getActiveChat,
      switchChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};