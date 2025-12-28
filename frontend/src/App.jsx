import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Homepage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setIsFetching(false);
    });

    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <ThemeProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path='/' 
              element={user ? <Navigate to='/chat'/> : <Homepage />}
            />
            <Route 
              path='/landing' 
              element={user ? <Navigate to='/chat'/> : <LandingPage />}
            />
            <Route
              path='/chat'
              element={user ? <ChatPage /> : <Navigate to="/landing" />}
            />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App