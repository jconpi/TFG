import React from 'react';
import { Link } from 'react-router-dom';
import './components/Header.css'; // Verifica la ruta al archivo CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './images/catcafe.jpeg'; // Verifica que la ruta al logo sea correcta

const Header = ({ onToggleCart, cartItemCount, isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="CATCAFE Logo" className="logo-image" /> CATCAFE
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/cats">Gatos</Link></li>
          <li><Link to="/cafes">Cafés</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/my-profile"><FontAwesomeIcon icon={faUser}/></Link></li>
              <li><Link onClick={onLogout} to="/"><FontAwesomeIcon icon={faSignOutAlt}/> Cerrar sesión</Link></li>
            </>
          ) : (
            <li><Link to="/login"><FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión</Link></li>
          )}
        </ul>
      </nav>
      <div className="header-actions">
        <div className="divider"></div>
        <a href="https://paypal.me/nagc92" className="donate-button">COLABORA</a>
      </div>
    </header>
  );
};

export default Header;
