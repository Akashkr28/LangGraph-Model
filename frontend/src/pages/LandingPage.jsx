import React from "react";
import AuthForm from "../components/AuthForm";
import '../App.css';

export default function LandingPage() {
    console.log("Landing page is attempting to render");

    return (
        <div className="landing-container">
            
            <div className="marketing-text">
                <h1>
                    Unlock your <br />
                    <span style={{ color: '#2f81f7'}}>Second Brain</span>
                </h1>
                <p>
                    Langbot helps you remember, organize and retrieve your thoughts instantly.
                </p>
            </div>

            <div>
                <AuthForm />
            </div>
        </div>
    );
}