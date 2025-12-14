import { useState } from 'react';
import '../App.css';

const GoogleIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox='0 0 24 24'    
    >
        <path
            fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.64 2 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.19 0 8.8-3.72 8.8-9.04c0-.79-.08-1.42-.25-1.86z"
        />
    </svg>
);

const PhoneIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        ></path>
    </svg>
);

const EmailIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
            <polyline points="22,6 12,13 2,6"></polyline>
        </path>
    </svg>
)

const LockIcon = () => (
    <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <rect x="3" y="11" 
            width="18" 
            height="11" 
            rx="2" 
            ry="2"
        ></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isLogin ? 'Logging in' : 'Signing up', { email, password });
    }

    return (
        <div className='auth-card'>
            <div className='auth-header'>
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{isLogin ? 'Enter your credentials to sign in.' : 'Start your journey with Langbot.'}</p>
            </div>

            <form onSubmit={handleSubmit} className='form-group'>

                <div className='input-wrapper'>
                    <div className='input-icon'>
                        <EmailIcon/>
                    </div>
                        <input 
                        type="email"
                        placeholder='Email Address'
                        className='auth-input with-icon'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required    
                    />
                </div>

                <div className='input-wrapper'>
                    <div className='input-icon'>
                        <LockIcon/>
                    </div>
                        <input 
                        type="password"
                        placeholder='Password'
                        className='auth-input with-icon'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>


                {!isLogin && (
                    <div className='input-wrapper'>
                        <div className='input-icon'>
                            <LockIcon/>
                        </div>
                            <input 
                            type="password"
                            placeholder='Confirm Password'
                            className='auth-input with-icon'
                            required
                        />
                    </div>
                )}

                <button type='submit' className='primary-btn'>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <div className='divider'>OR CONTINUE WITH</div>

            <div className='social-buttons'>
                <button className='social-btn'>
                    <GoogleIcon/> Google
                </button>
                <button className='social-btn'>
                    <PhoneIcon/> Mobile
                </button>
            </div>

            <div className='toggle-text'>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span
                    className='toggle-link'
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? ' Sign Up' : ' Log In'}
                </span>
            </div>
        </div>
    )
}