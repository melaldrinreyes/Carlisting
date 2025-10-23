import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import AlertModal from '../components/AlertModal';
import { carsData } from '../data/carsData';
import './Order.css';

const Order = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    carModel: '',
    paymentMethod: 'cash',
    address: '',
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
    console.log('Order submitted:', formData);
    setSubmitted(true);
  };

  const handleAlertClose = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      carModel: '',
      paymentMethod: 'cash',
      address: '',
      message: ''
    });
  };

  return (
    <div className="order-page">
      <Navbar />
      
      <div className="order-container">
        <h1 className="order-title">Order Your Dream Car</h1>
        <p className="order-subtitle">Fill out the form below and we'll get back to you shortly</p>

        <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
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
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carModel">Select Car Model *</label>
                <select
                  id="carModel"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a car...</option>
                  {carsData.map((car) => (
                    <option key={car.id} value={car.model}>
                      {car.model} - {car.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="cash">Cash</option>
                <option value="financing">Financing</option>
                <option value="lease">Lease</option>
                <option value="credit-card">Credit Card</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests or questions..."
              />
            </div>

            <div className="form-actions">
              <Button variant="primary" type="submit">
                Submit Order
              </Button>
              <Button variant="secondary" href="#/listings">
                Browse More Cars
              </Button>
            </div>
          </form>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={submitted}
        onClose={handleAlertClose}
        type="success"
        title="Order Submitted!"
        message="Thank you for your order. We'll contact you soon."
        autoClose={true}
        autoCloseDuration={3000}
      />

      <Footer />
    </div>
  );
};

export default Order;
