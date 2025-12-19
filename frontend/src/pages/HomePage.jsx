import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/landing');
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
          </div>
          <span>langbot</span>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#support">ai chatbot support</a></li>
            <li><a href="#waiting">no waiting</a></li>
            <li><a href="#here">always here</a></li>
            <li><a href="#interaction">personalized interaction</a></li>
          </ul>
          <button className="sign-in-btn" onClick={handleSignIn}>
            Sign In
          </button>
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
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
          </div>
          <h1 className="main-logo-text">langbot</h1>
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