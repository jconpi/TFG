import React from 'react';
import { Link } from 'react-router-dom';
import './components/Header.css'; // Asegúrate de que la ruta al archivo CSS es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onToggleCart, cartItemCount, isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        {/* Incluiría aquí el logo si tienes uno */}
        <Link to="/">Adoptus</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/gatitos">Gatitos</Link></li>
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
      <div className="cart-icon" onClick={onToggleCart}>
          🛒 {cartItemCount > 0 && <span>({cartItemCount})</span>}
      </div>
      
    </header>
  );
};

export default Header;
