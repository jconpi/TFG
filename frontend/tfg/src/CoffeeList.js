// src/CoffeeList.js
import React from 'react';
import CoffeeCard from './CoffeeCard'; // Asegúrate de haber creado este componente

const CoffeeList = ({ cafes, onAddToCart }) => {
  return (
    <div className="cat-list">
      {cafes.map((cafe) => (
        <CoffeeCard key={cafe.id} cafe={cafe} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default CoffeeList;
