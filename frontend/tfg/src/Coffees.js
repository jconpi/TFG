// src/CoffeeCard.js
import './components/CoffeeCard.css';
import React, { useState, useEffect } from 'react';
import axiosInstance from "./Axios";


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
    <div className="row">
      {coffees.map((coffee, index) => (
        <div key={coffee.id}>
            <img
              src={require(`.${coffee.image}`)}
              alt={coffee.name}           
            />
            <h1>{coffee.name}</h1>
            <h4>Precio: {coffee.price} €</h4>
            <p>{coffee.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Coffees;
