import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "./components/Register.css";
const API = process.env.REACT_APP_API;

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [registered, setRegistered] = useState(false);


    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        const data = await res.json();
        console.log(data)
        if (res.ok) {
            setRegistered(true);
        } else {
            setError(`Hubo un error durante el registro. ${data.error}`);
        }
    };
    if (registered) {
        return <Navigate to="/login" />; // Redirigir a la página principal después de iniciar sesión
    }

    return (
        <div className="register-container">
          <div className="register-card">
            <h2 className="text-center mb-4">Registro</h2>
            <p>Por favor, introduce tu nombre, correo electrónico y contraseña:</p>
            {error && <p className="text-danger text-center mb-4">{error}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
              <button className="btn btn-primary btn-block" type="submit">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      );
}

export default Register;
