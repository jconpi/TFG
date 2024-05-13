import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosInstance from "./Axios";

function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(true); 

   
    const checkAdminStatus = async () => {
        try {
            const res = await axiosInstance.get("/admin/checkAdminStatus");
            const data = res.data;
            setIsAdmin(data.admin)
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    };
    checkAdminStatus();
    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="card formulario-login text-center" style={{ maxWidth: "800px", margin: "auto" }}>
            <h2 className="mb-4">Panel de Administrador</h2>
            <div className="d-flex justify-content-between">
                <Link to="/admin/cats" className="btn btn-primary">Administrar Gatos</Link>
                <Link to="/admin/users" className="btn btn-primary">Administrar Usuarios</Link>
                <Link to="/admin/cafes" className="btn btn-primary">Administrar Cafés</Link>
            </div>
        </div>
    );
}

export default AdminPage;
