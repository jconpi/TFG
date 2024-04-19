import React from 'react';
import { useNavigate } from 'react-router-dom';
import './components/CatCard.css';

const CatCard = ({ cat }) => {
  const navigate = useNavigate();

  // Función para manejar el clic en el botón "Adoptar"
  const handleAdopt = () => {
    // Esto redirigirá al usuario a la ruta del formulario
    // Debes reemplazar '/formulario-adoptar' con la ruta real donde tienes el formulario
    navigate('/adoptar', { state: { cat } });
  };

  return (
    <div className="cat-card">
      <img src={cat.image} alt={cat.name} />
      <h3>{cat.name}</h3>
      <p>{cat.description}</p>
      <button onClick={handleAdopt}>Adoptar</button>
    </div>
  );
};

export default CatCard;
