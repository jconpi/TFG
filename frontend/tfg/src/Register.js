import React, { useState } from "react";
import { Navigate } from "react-router-dom";

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
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card formulario-login">
                <div className="card-body p-4">
                <h2 className="text-center mb-4">Registro</h2>
                {error && <p className="text-center mb-4" style={{ color: "red" }}>{error}</p>}
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
                    <button className="btn btn-primary btn-block mb-3" type="submit">Registrarse</button>
                </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
