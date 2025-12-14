import React from "react";

export default function LandingPage() {
    <div
        className="app-container"
        style={{
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <h1>Welcome to LangBot.io</h1>
        <p>Your AI companion</p>

        <div
            style={{
                display: 'flex',
                gap: '20px',
                marginTop: '30px',
            }}
        >
            <button
                className="send-button"
                style={{
                    borderRadius: '8px',
                    width: 'auto',
                    padding: '10px 20px',
                }}
            >
                Log In
            </button>
            <button
                className="send-button"
                style={{
                    borderRadius: '8px',
                    width: 'auto',
                    padding: '10px 20px',
                    background: '#333'
                }}
                Sign In
            ></button>
        </div>
    </div>
}