import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ThemeProvider } from './context/ThemeContext';
import Homepage from './pages/HomePage'; // NEW - aihelp homepage
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Loading State

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
        setIsFetching(false);
      } else {
        setUser(null);
        setIsFetching(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (isFetching) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Homepage - accessible to everyone */}
          <Route 
            path='/' 
            element={user ? <Navigate to='/chat'/> : <Homepage />}
          />

          {/* Landing/Auth Page - redirect if already logged in */}
          <Route 
            path='/landing' 
            element={user ? <Navigate to='/chat'/> : <LandingPage />}
          />

          {/* Chat Page - only for authenticated users */}
          <Route
            path='/chat'
            element={user ? <ChatPage /> : <Navigate to="/landing" />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App