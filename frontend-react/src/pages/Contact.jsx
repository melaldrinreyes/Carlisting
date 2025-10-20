import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you. Reach out to our team for any inquiries.</p>
        </div>

        <div className="contact-content">
          {/* Contact Information Cards */}
          <div className="contact-info-section">
            <h2 className="section-heading">Contact Information</h2>
            
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-card-icon">
                  <FaPhone />
                </div>
                <h3>Phone</h3>
                <p>+1 (555) 987-6543</p>
                <p className="contact-hours">Mon-Fri: 9AM - 6PM</p>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <FaEnvelope />
                </div>
                <h3>Email</h3>
                <p>info@luxurycars.com</p>
                <p className="contact-hours">Response within 24 hours</p>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Location</h3>
                <p>456 Business Ave, Suite 200</p>
                <p className="contact-hours">New York, NY 10001</p>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <FaClock />
                </div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9AM - 6PM</p>
                <p className="contact-hours">Saturday: 10AM - 4PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-heading">Send Us a Message</h2>
            
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <div className="form-actions">
                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                  <Button variant="secondary" href="#/">
                    Back to Home
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
