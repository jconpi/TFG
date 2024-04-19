import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "./Axios"; // Importa la instancia de Axios configurada

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
        
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card formulario-login">
                <div className="card-body p-4">
                <h2 className="text-center mb-4">Iniciar sesión</h2>
                <p className="text-center mb-4">Por favor, introduzca su correo electrónico y contraseña:</p>
                {error && <p className="text-center mb-4" style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="form-group mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <button className="btn btn-primary btn-block mb-3" type="submit">Iniciar sesión</button>
                </form>
                <Link className="btn btn-secondary btn-block" to="/register">
                    Registrarse
                </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
