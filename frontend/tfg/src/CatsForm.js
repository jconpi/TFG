import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "./Axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const API = process.env.REACT_APP_API;

export const CatsForm = () => {
    const [catID, setCatId] = useState("")
    const [catName, setCatName] = useState("")
    const [userName, setUserName] = useState("")
    const [userAge, setUserAge] = useState("")
    const [userMail, setUserMail] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [userReason, setUserReason] = useState("")
    const [error, setError] = useState("")
    const [adoptSuccess, setAdoptSuccess] = useState(false)

    useEffect(() => {
        const getCat = async () => {
            const cat_id = localStorage.getItem('cat_id')
            const cat_name = localStorage.getItem('cat_name')
            setCatId(cat_id)
            setCatName(cat_name)
        }

        getCat();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch(`${API}/cats/form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                userMail,
                userAge,
                userPhone,
                userReason,
                catID,
                catName
            })
        })
        const data = await res.json();
        console.log(data)
        if (res.ok) {
            const notify = () => toast(`Formulario para ${catName}. Enviado correctamente! 🐾`)
            notify(); 
            setAdoptSuccess(true)
        } else {
            setError(`Hubo un error durante el registro. ${data.error}`);
        }
    };

    if (adoptSuccess) {
        return <Navigate to="/" />; // Redirige a la página principal después de Formulario
    }

    return (
        <div className="adoption-form-container">
            <h2>Formulario de Adopción</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre de Usuario:</label>
                    <input type="text" id="nombre" name="nombre" onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" onChange={(e) => setUserAge(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="mail">Mail:</label>
                    <input type="email" id="mail" name="mail" onChange={(e) => setUserMail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" name="telefono" onChange={(e) => setUserPhone(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="gato">Gato:</label>
                    <input type="text" id="gato" name="gato" value={catName} readOnly required />
                </div>
                <div>
                    <label htmlFor="razon">Razón para la adopción:</label>
                    <textarea id="razon" name="razon" onChange={(e) => setUserReason(e.target.value)} required></textarea>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default CatsForm; 