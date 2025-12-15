import { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
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
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    ><rect 
        width="20" 
        height="16" 
        x="2" 
        y="4" 
        rx="2"
    /><path 
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
    />
    </svg>
);

const LockIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" s
        strokeLinecap="round" 
        strokeLinejoin="round"
    ><rect 
        width="18" 
        height="11" 
        x="3" y="11" 
        rx="2" ry="2"
    /><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // To show login errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            if (isLogin) {
                // Log in Logic
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // Sign up Logic
                await createUserWithEmailAndPassword(auth, email, password);
            }            
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className='auth-card'>
            <div className='auth-header'>
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{isLogin ? 'Enter your credentials to sign in.' : 'Start your journey with Langbot.'}</p>
            </div>

            {error && 
                <p 
                    style={{
                        color: '#ff6b6b',
                        textAlign: 'center',
                        margin: '0',
                    }}
                >
                    {error}    
                </p>}

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
                <button 
                    type='button' 
                    className='social-btn'
                    onClick={handleGoogleLogin}    
                >
                    <GoogleIcon/> Google
                </button>
                <button  type='button' className='social-btn'>
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