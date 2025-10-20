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
      // Don't prevent if clicking on menu toggle button or overlay
      if (e.target.closest('.mobile-menu-toggle') || 
          e.target.closest('.mobile-menu-overlay') ||
          e.target.closest('.navbar-menu')) {
        return;
      }
      
      // Disable swipe-to-open behavior
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        
        // Prevent swipe from right edge only when menu is closed
        if (startX > window.innerWidth - 50 && !isMobileMenuOpen) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', preventSwipe, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipe);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          onTouchEnd={(e) => {
            e.preventDefault();
            toggleMobileMenu(e);
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
          onTouchEnd={(e) => {
            e.preventDefault();
            closeMobileMenu(e);
          }}
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
