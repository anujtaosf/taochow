import React from 'react';
import './Logo.css';

function Logo({ size = 'medium' }) {
  return (
    <div className={`logo logo-${size}`}>
      <img src="/logo_taochow.png" alt="Tao Chow" className="logo-image" />
    </div>
  );
}

export default Logo;
