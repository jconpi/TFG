// src/AdoptionForm.js
import React, { useState } from 'react';
import './components/AdoptionForm.css';

const AdoptionForm = () => {
  // Puedes añadir estados para manejar los valores de los inputs si necesitas procesar el formulario
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    address: '',
    hasPets: '',
    petExperience: '',
    petPreference: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías el envío del formulario, por ejemplo, enviando los datos a un servidor
    console.log(formValues);
  };

  return (
    <div>
      <h2>Formulario de Adopción</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre Completo:
          <input type="text" name="name" value={formValues.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formValues.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Dirección:
          <input type="text" name="address" value={formValues.address} onChange={handleChange} required />
        </label>
        <br />
        <label>
          ¿Tienes otras mascotas?
          <select name="hasPets" value={formValues.hasPets} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </label>
        <br />
        <label>
          Experiencia previa con mascotas:
          <textarea name="petExperience" value={formValues.petExperience} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Preferencia de mascota:
          <input type="text" name="petPreference" value={formValues.petPreference} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default AdoptionForm;
