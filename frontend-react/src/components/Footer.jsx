import React from 'react';
import { FaCar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">
            <FaCar className="footer-logo-icon" />
            AutoDeals
          </h3>
          <p>Your trusted partner in finding the perfect vehicle since 2000.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/listings">Inventory</a></li>
            <li><a href="#/order">Order</a></li>
            <li><a href="#/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p><FaPhoneAlt className="footer-icon" /> 1-800-AUTO-DEAL</p>
          <p><FaEnvelope className="footer-icon" /> info@autodeals.com</p>
          <p><FaMapMarkerAlt className="footer-icon" /> 123 Car Street, Auto City</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 AutoDeals. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
