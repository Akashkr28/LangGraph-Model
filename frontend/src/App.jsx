import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Loading State

  useEffect(() => {
    const unsubscribe =  onAuthStateChanged(auth, (user) => {
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
        style = {{
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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Navigate to='/chat'/> : <LandingPage/>}/>

        {/* If Authenticated show chat page, else redirect to landing page */}
        <Route
          path='/chat'
          element={user ? <ChatPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App