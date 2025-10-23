import React, { useState, useEffect } from 'react';
import { FaCar, FaUser, FaBars, FaTimes, FaHome, FaList, FaShoppingCart, FaEnvelope, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
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
      e.stopPropagation();
    }
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = () => {
    // Just close the menu, allow navigation to happen
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
            aria-hidden="true"
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

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <a href="#/" className="bottom-nav-item">
          <FaHome className="bottom-nav-icon" />
          <span className="bottom-nav-label">Home</span>
        </a>
        <a href="#/listings" className="bottom-nav-item">
          <FaList className="bottom-nav-icon" />
          <span className="bottom-nav-label">Listings</span>
        </a>
        <a href="#/order" className="bottom-nav-item">
          <FaShoppingCart className="bottom-nav-icon" />
          <span className="bottom-nav-label">Order</span>
        </a>
        <a href="#/contact" className="bottom-nav-item">
          <FaEnvelope className="bottom-nav-icon" />
          <span className="bottom-nav-label">Contact</span>
        </a>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bottom-nav-item bottom-nav-btn">
            <FaSignOutAlt className="bottom-nav-icon" />
            <span className="bottom-nav-label">Logout</span>
          </button>
        ) : (
          <a href="#/login" className="bottom-nav-item">
            <FaSignInAlt className="bottom-nav-icon" />
            <span className="bottom-nav-label">Login</span>
          </a>
        )}
      </nav>
    </>
  );
};

export default Navbar;
