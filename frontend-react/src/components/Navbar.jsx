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

  useEffect(() => {
    // Prevent swipe gestures from opening menu
    const preventSwipe = (e) => {
      // Disable swipe-to-open behavior
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        
        // Prevent swipe from right edge
        if (startX > window.innerWidth - 50) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', preventSwipe, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipe);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#/" className="navbar-logo" onClick={closeMobileMenu}>
          <FaCar className="navbar-logo-icon" />
          <h2>AutoDeals</h2>
        </a>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#/" onClick={closeMobileMenu}>Home</a></li>
          <li><a href="#/listings" onClick={closeMobileMenu}>Car Listings</a></li>
          <li><a href="#/order" onClick={closeMobileMenu}>Order Now</a></li>
          <li><a href="#/contact" onClick={closeMobileMenu}>Contact</a></li>
          
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
              <a href="#/login" className="navbar-auth-btn login-btn" onClick={closeMobileMenu}>
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
