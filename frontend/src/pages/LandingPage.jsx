import React from "react";
import AuthForm from "../components/AuthForm";
import ThemeToggle from "../components/ThemeToggle";
import './LandingPage.css';

export default function LandingPage() {
    console.log("Landing page is attempting to render");

    return (
        <div className="landing-page">
            {/* <div className="landing-header">
                <ThemeToggle />
            </div> */}
            {/* Background decorative shapes */}
            <div className="landing-shapes">
                <div className="landing-blob landing-blob-1"></div>
                <div className="landing-blob landing-blob-2"></div>
                <div className="landing-sphere landing-sphere-1"></div>
                <div className="landing-sphere landing-sphere-2"></div>
                <div className="landing-sphere landing-sphere-3"></div>
            </div>

            {/* Content container */}
            <div className="landing-container">
                {/* Left side - Marketing content */}
                <div className="marketing-section">
                    <div className="logo-small">
                        <div className="logo-icon-small">
                            <div className="bubble bubble-1"></div>
                            <div className="bubble bubble-2"></div>
                            <div className="bubble bubble-3"></div>
                        </div>
                        <span>langbot</span>
                    </div>

                    <div className="marketing-text">
                        <h1>
                            Unlock your <br />
                            <span className="highlight-text">Second Brain</span>
                        </h1>
                        <p className="marketing-description">
                            Langbot helps you remember, organize and retrieve your thoughts instantly with AI-powered assistance.
                        </p>
                        
                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-icon">⚡</div>
                                <div>
                                    <h3>Instant Responses</h3>
                                    <p>Get answers in real-time with no waiting</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🧠</div>
                                <div>
                                    <h3>Smart Memory</h3>
                                    <p>AI remembers your conversations and context</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🔒</div>
                                <div>
                                    <h3>Secure & Private</h3>
                                    <p>Your data is encrypted and protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Auth form */}
                <div className="auth-section">
                    {/* FIXED: Removed the extra <div className="auth-card"> wrapper */}
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}