import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, href, type = 'button' }) => {
  if (href) {
    return (
      <a href={href} className={`btn btn-${variant}`}>
        <span className="btn-content">{children}</span>
      </a>
    );
  }

  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
      <span className="btn-content">{children}</span>
    </button>
  );
};

export default Button;
