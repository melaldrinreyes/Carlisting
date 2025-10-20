import React from 'react';
import Button from './Button';
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <img src={car.image} alt={car.model} className="car-card-image" />
      <div className="car-card-content">
        <h3 className="car-card-model">{car.model}</h3>
        <p className="car-card-description">{car.description}</p>
        <div className="car-card-footer">
          <span className="car-card-price">{car.price}</span>
          <Button variant="primary" href="#/order">Order Now</Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
