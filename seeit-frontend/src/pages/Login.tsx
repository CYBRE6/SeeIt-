import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('wazuh');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    // Simulate login
    onLogin(username);
  };

  return (
    <div className="wz-login-bg">
      {/* Wazuh Logo and Title */}
      <div style={{ textAlign: 'center', zIndex: 10, marginBottom: 8 }}>
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: 700, 
          color: '#ffffff', 
          margin: 0, 
          letterSpacing: '-1.5px',
          fontFamily: "'Inter', sans-serif"
        }}>
          wazuh<span style={{ color: '#000000' }}>.</span>
        </h1>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '15px', 
          fontWeight: 500, 
          margin: '4px 0 0 0',
          letterSpacing: '0.2px'
        }}>
          The Open Source Security Platform
        </p>
      </div>

      {/* Login Card */}
      <div className="wz-login-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ color: '#cc0000', fontSize: '12.5px', fontWeight: 500 }}>
              {error}
            </div>
          )}
          
          {/* Username Input */}
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiUser size={16} />
            </span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiLock size={16} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 38px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2b8df1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d7fd8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2b8df1'}
          >
            Log in
          </button>
        </form>
      </div>

      {/* Decorative Off-screen Shield Design */}
      <div className="wz-login-shield-container">
        {/* Shield Icon Container */}
        <div style={{
          width: '150px',
          height: '150px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Blue Shield Graphic */}
          <svg viewBox="0 0 100 100" style={{ width: '130px', height: '130px', fill: '#3b82f6', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
            <path d="M50 10 L85 22 V55 C85 75 70 90 50 95 C30 90 15 75 15 55 V22 Z" />
          </svg>
          {/* Coding brackets inside shield */}
          <div style={{
            position: 'absolute',
            fontSize: '32px',
            color: '#ffffff',
            fontWeight: 600,
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span>&lt;</span>
            <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.7)' }}>/</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
