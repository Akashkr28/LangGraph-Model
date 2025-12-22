import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Homepage.css';

const SynapseLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    strokeLinecap='round'
    strokeLinejoin='round'  
  >
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="6" r="3"></circle>
    <path d="M6 15v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"></path>
  </svg>
);

const Homepage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/landing');
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon" style={{ width: '30px', height: '30px', marginRight: '10px' }}>
            <SynapseLogo />
          </div>
          <span className='logo-text'>SYNAPSE</span>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#support">Graph Memory</a></li>
            <li><a href="#waiting">Instant Recall</a></li>
            <li><a href="#here">Private</a></li>
            <li><a href="#interaction">Personalized Interaction</a></li>
          </ul>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ThemeToggle />
            <button className="sign-in-btn" onClick={handleSignIn}>
            Sign In
            </button>
          </div>

        </div>
      </nav>

      <section className="hero">
        <div className="shapes-container">
          {[...Array(7)].map((_, index) => (
            <div key={index} className={`shape shape-${index + 1}`}></div>
          ))}
        </div>

        <div className="main-logo">
          <div className="main-logo-icon">
            <SynapseLogo />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 className="main-logo-text" style={{ margin: 0, lineHeight: 1 }}>SYNAPSE</h1>
            <p style={{ 
              margin: '5px 0 0 0', 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)',
              fontWeight: 500 
            }}>
              Your Second Brain, Connected.
            </p>
          </div>
        </div>

        <button className="cta-button" onClick={handleSignIn}>
          Get Started
        </button>
      </section>

      <footer className="footer">
        <div className="footer-left">
          <span>MAIN FONT</span>
          <span>HEITI TC</span>
        </div>
        <div className="footer-right">
          <span>chatbot</span>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;