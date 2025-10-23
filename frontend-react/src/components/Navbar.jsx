import React, { useState } from 'react';
import { FaCar, FaUser, FaHome, FaList, FaShoppingCart, FaEnvelope, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleLoginClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#/" className="navbar-logo">
            <FaCar className="navbar-logo-icon" />
            <h2>AutoDeals</h2>
          </a>

          <ul className="navbar-menu">
            <li><a href="#/">Home</a></li>
            <li><a href="#/listings">Car Listings</a></li>
            <li><a href="#/order">Order Now</a></li>
            <li><a href="#/contact">Contact</a></li>
            
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
                <button onClick={handleLoginClick} className="navbar-auth-btn login-btn">
                  Login
                </button>
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
          <button onClick={handleLoginClick} className="bottom-nav-item bottom-nav-btn">
            <FaSignInAlt className="bottom-nav-icon" />
            <span className="bottom-nav-label">Login</span>
          </button>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
