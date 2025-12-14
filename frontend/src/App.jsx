import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';

function App() {
  const isAuthenticated = false; // Replace with real authentication logic

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>

        {/* If Authenticated show chat page, else redirect to landing page */}
        <Route
          path='/chat'
          element={isAuthenticated ? <ChatPage/> : <Navigate to='/' />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App