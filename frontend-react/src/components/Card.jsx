import React from 'react';
import './Card.css';

const Card = ({ icon, title, description }) => {
  return (
    <div className="card">
      <div className="card-icon-wrapper">
        <div className="card-icon">{icon}</div>
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default Card;
