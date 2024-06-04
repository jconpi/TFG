// src/GridSection.js
import React from "react";
import "./components/GridSection.css";

const GridSection = () => {
  return (
    <div className="grid-container">
      <div className="grid-item neko-cafe">
        <h2>CAT CAFE</h2>
        <p>
          Nuestro Cat Cafe es el lugar perfecto para amantes de los gatos donde
          poder conocer más de cerca el maravilloso mundo de estos felinos
          mientras disfrutas de un delicioso café o una infusión ecológica, un
          pequeño trozo de edén donde reina la calma que solo los gatos son
          capaces de proporcionar.
        </p>
      </div>

      <div className="grid-item apa-neko">
        <h2>CATCAFE MADRID</h2>
        <p>
          En Cesur CATCAFE, dedicamos nuestras vidas al rescate de gatos
          abandonados, su rehabilitación y búsqueda de hogar.
        </p>
        <a href="/cats" className="see-more">
          Ver Gatos
        </a>
      </div>
    </div>
  );
};

export default GridSection;
