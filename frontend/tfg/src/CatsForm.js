import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "./Axios";

const API = process.env.REACT_APP_API;

export const CatsForm = () => {
    const [cat, setCat] = useState([])
    const [cats, setCats] = useState([])
    const [selectCat, setSelectCat] = useState('')

    useEffect(() => {
        const getCat = async () => {
            const res = await axiosInstance.get(`/cats`);
            setCats(res.data);
            
            const cat_id = localStorage.getItem('cat_id')
            setSelectCat(cat_id)
        }

        getCat();
    }, []);

    const setCatID = async (id) => {
        try {
            localStorage.setItem('cat_id', id);
        } catch (error) {
            console.error("Error:", error)
        }
    }


    return (
        <div className="row">
            <div >
                <h2>Formulario de Adopción</h2>
                <form action="/submit_adopcion" method="post">
                    <div>
                        <label for="nombre">Nombre de Usuario:</label>
                        <input type="text" id="nombre" name="nombre" required/>
                    </div>
                    <div>
                        <label for="edad">Edad:</label>
                        <input type="number" id="edad" name="edad" required/>
                    </div>
                    <div>
                        <label for="mail">Mail:</label>
                        <input type="email" id="mail" name="mail" required/>
                    </div>
                    <div>
                        <label for="telefono">Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" required/>
                    </div>
                    <div>
                        <label for="selector">Selecciona una opción:</label>
                        <select id="selector" name="selector">
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                            <option value="opcion3">Opción 3</option>
                        </select>
                    </div>
                    <div>
                        <label for="razon">Razón para la adopción:</label>
                        <textarea id="razon" name="razon" required></textarea>
                    </div>
                    <div>
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CatsForm; 