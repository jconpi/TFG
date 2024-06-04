// src/CoffeeCard.js
import './components/CoffeeCard.css';
import React, { useState, useEffect } from 'react';
import axiosInstance from "./Axios";
import './components/Cafes.css'
const Coffees = () => {
  const [coffees, setCoffees] = useState([])
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const getCoffees = async () => {
      try {
          const res = await axiosInstance.get(`/cafes`);
          setCoffees(res.data);
      } catch (error) {
          console.error("Error getting coffees:", error);
      } finally {
        setLoading(false);
      };
    }
    getCoffees();

    
  }, [])

  return (
    <div className="card-grid">
      {coffees.map((coffee, index) => (
        <div className='cafe-card' key={coffee.id}>
            <img
              className='card-image'
              src={require(`.${coffee.image}`)}
              alt={coffee.name}           
            />
            <h1 className='card-title'>{coffee.name}</h1>
            <h4 className='card-text'>Precio: {coffee.price} €</h4>
            <p className='card-text'>{coffee.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Coffees;
