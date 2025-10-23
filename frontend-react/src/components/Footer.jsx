import React from 'react';
import { FaCar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <FaCar className="footer-logo-icon" />
              <span>AutoDeals</span>
            </div>
            <p className="footer-tagline">Your trusted partner in finding the perfect vehicle since 2000.</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#/">Home</a></li>
              <li><a href="#/listings">Inventory</a></li>
              <li><a href="#/order">Order</a></li>
              <li><a href="#/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Get In Touch</h4>
            <div className="footer-contact">
              <a href="tel:1-800-AUTO-DEAL" className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span>1-800-AUTO-DEAL</span>
              </a>
              <a href="mailto:info@autodeals.com" className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@autodeals.com</span>
              </a>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Car Street, Auto City</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 AutoDeals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
