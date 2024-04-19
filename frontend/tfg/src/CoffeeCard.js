// src/CoffeeCard.js
import './components/CoffeeCard.css';
import React from 'react';

const CoffeeCard = ({ cafe, onAddToCart }) => {
  return (
    <div className="cat-card">
      <img src={cafe.image} alt={cafe.name} />
      <h3>{cafe.name}</h3>
      <p>{cafe.description}</p>
      <p>Precio: ${cafe.price}</p>
      <button onClick={() => onAddToCart(cafe)}>Añadir al Carrito</button>
    </div>
  );
};

export default CoffeeCard;
