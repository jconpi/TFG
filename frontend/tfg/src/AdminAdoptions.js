import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosInstance from "./Axios";
import './components/AdminAdoptions.css';

const API = process.env.REACT_APP_API;

export const AdminAdoptions = () => {

    const [isAdmin, setIsAdmin] = useState(true); 
    const [adoptions, setAdoptions] = useState([])

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const res = await axiosInstance.get("/admin/checkAdminStatus");
                const data = res.data;
                setIsAdmin(data.admin);
                if(isAdmin){
                    getAdoptions();
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            } 
        };
        checkAdminStatus();
    }, []);

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    const getAdoptions = async () => {
        try {
            const res = await axiosInstance.get(`/admin/adoptions`);
            setAdoptions(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error getting adoptions:", error);
        }
    }

    const deleteAdoptions = async (id) => {
        const adoptionResponse = window.confirm('¿Estás seguro de que quieres eliminarlo?')

        if(adoptionResponse) {
            try {
                const res = await axiosInstance.delete(`/admin/adoption/${id}`);
                console.log(res.data);
                await getAdoptions();
            } catch (error) {
                console.error("Error deleting cat:", error);
            }
        }
    }
    return (
        <div className="adoptions-list-container">
            <h1>Lista de Adopciones</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID de Adopción</th>
                        <th>Nombre de Usuario</th>
                        <th>Email de Usuario</th>
                        <th>Edad de Usuario</th>
                        <th>Teléfono de Usuario</th>
                        <th>Razón de Adopción</th>
                        <th>Nombre del Gato</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {adoptions.map(adoption => (
                        <tr key={adoption._id}>
                            <td>{adoption._id}</td>
                            <td>{adoption.user_name}</td>
                            <td>{adoption.user_mail}</td>
                            <td>{adoption.user_age}</td>
                            <td>{adoption.user_phone}</td>
                            <td>{adoption.user_reason}</td>
                            <td>{adoption.cat_name}</td>
                            <td>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => deleteAdoptions(adoption._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminAdoptions;