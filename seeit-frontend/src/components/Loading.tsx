import React from 'react';

const Loading: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 700,
          color: '#1a1c21',
          margin: 0,
          letterSpacing: '-1.5px'
        }}>
          wazuh<span style={{ color: '#2b8df1' }}>.</span>
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          marginTop: '12px',
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}>
          Loading ...
        </p>
      </div>
    </div>
  );
};

export default Loading;
