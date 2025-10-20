import React, { useState, useEffect } from 'react';
import { FaCar, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMobileMenu();
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#/" className="navbar-logo" onClick={closeMobileMenu}>
          <FaCar className="navbar-logo-icon" />
          <h2>AutoDeals</h2>
        </a>

        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        ></div>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#/" onClick={handleMenuClick}>Home</a></li>
          <li><a href="#/listings" onClick={handleMenuClick}>Car Listings</a></li>
          <li><a href="#/order" onClick={handleMenuClick}>Order Now</a></li>
          <li><a href="#/contact" onClick={handleMenuClick}>Contact</a></li>
          
          {isAuthenticated ? (
            <>
              <li className="navbar-user">
                <FaUser className="user-icon" />
                <span>{user?.name || 'User'}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-auth-btn logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <a href="#/login" className="navbar-auth-btn login-btn" onClick={handleMenuClick}>
                Login
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
