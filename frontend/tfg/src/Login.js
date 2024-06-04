import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "./Axios"; // Importa la instancia de Axios configurada
import "./components/Login.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axiosInstance.post("/login", { email, password });
            const data = res.data;
            
            if (res.status === 200) {
                const notify = () => toast(`Bienvenido ${data.name}! 🐾`)
                notify(); 
                setLoggedIn(true)
                onLogin(data);
            } else {
                setError("Credenciales incorrectas. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    if (loggedIn) {
        return <Navigate to="/" />; // Redirige a la página principal después de iniciar sesión
    }

    return (
        <div className="login-container">
          <div className="login-card">
            <h2>Iniciar sesión</h2>
            <p>Por favor, introduce tu correo electrónico y contraseña:</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="login-form-group">
                <input
                  type="email"
                  className="login-form-control"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="login-form-group">
                <input
                  type="password"
                  className="login-form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="login-button" type="submit">
                Iniciar sesión
              </button>
            </form>
            <Link className="secondary-button" to="/register">
              Registrarse
            </Link>
          </div>
        </div>
      );
}

export default Login;
