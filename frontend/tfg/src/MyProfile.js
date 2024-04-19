import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "./Axios";

function MyProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axiosInstance.get("/my-profile");
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error al obtener el perfil del usuario.");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }

        try {
            await axiosInstance.put("/change-password", {
                newPassword: newPassword
            });
            setPasswordError(null);
            setNewPassword("");
            setConfirmPassword("");
            console.log("cambiada")
        } catch (error) {
            setPasswordError("Error al cambiar la contraseña.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="profile-container">
                <div className="card formulario-login">
                    <div className="card-body p-4">
                        <h2 className="text-center mb-4">Perfil de {userData && userData.name}</h2>
                        {userData && (
                            <div className="d-flex justify-content-center">
                                <p>Email: {userData.email}</p>
                                {/* Puedes mostrar más detalles del perfil aquí */}
                            </div>
                        )}
                        <div className="change-password">
                            <h3>Cambiar contraseña</h3>
                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordError && <p className="text-danger">{passwordError}</p>}
                            <div className="d-flex justify-content-sm-between">
                                <button className="btn btn-primary" onClick={handleChangePassword}>Guardar contraseña</button>
                                <Link className="btn btn-secondary btn-block" to="/admin">
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
