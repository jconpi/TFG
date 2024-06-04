import React from "react";
import "./components/ContactPage.css"; // Asegúrate de que la ruta al archivo CSS es correcta

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1>Escríbenos</h1>
      <form>
        <label>
          Nombre:
          <input type="text" name="name" />
        </label>
        <label>
          Correo:
          <input type="email" name="email" />
        </label>
        <label>
          Mensaje:
          <textarea name="message" />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ContactPage;
