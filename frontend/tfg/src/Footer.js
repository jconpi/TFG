// src/Footer.js
import React from "react";
import "./components/Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-column">
          <h3>CONTACT</h3>
          <ul>
            <li>Cesur Plaza Eliptica</li>
            <li>Madrid</li>
            <li><a href="https://gmail.com">info@catcafe.com</a></li>
            <li>+34 123 456 789</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>CONECTA CON NOSOTROS</h3>
          <ul>
            <li><a href="https://facebook.com/">Facebook</a></li>
            <li><a href="https://instagram.com/">Instagram</a></li>
            <li><a href="https://twitter.com/">Twitter</a></li>
          </ul>
        </div>
        <div className="footer-column-1">
        </div>
      </footer>
      <div className="footer-copyright">
        &copy; 2024 CatCafe
      </div>
    </>
  );
};

export default Footer;  