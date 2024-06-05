import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosInstance from "./Axios";
import './components/Admin.css'
import image_profile from './images/profile.png'
import image_cat from './images/cat.png'
import image_cafe from './images/coffee-cup.png'

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
        <div className="card-admin">
            <h2 className="card-header">Panel de Administrador</h2>
            <div className="card-buttons">
                <div className="article-container">
                    <img src={image_cat} alt="Cat" />
                    <Link to="/admin/cats" className="card-button">Administrar Gatos</Link>
                </div>
                <div className="article-container">
                    <img src={image_profile} alt="Profile" />
                    <Link to="/admin/users" className="card-button">Administrar Usuarios</Link>
                </div>
                <div className="article-container">
                    <img src={image_cafe} alt="Cafe" />
                    <Link to="/admin/cafes" className="card-button">Administrar Cafés</Link>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
