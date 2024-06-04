import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import axiosInstance from "./Axios";
import './components/CatsPage.css'
const API = process.env.REACT_APP_API;

export const CatsPage = () => {
    const [cats, setCats] = useState([])

    const getCats = async () => {
        try {
            const res = await axiosInstance.get(`/cats`);
            setCats(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error getting cats:", error);
        }
    }

    const setCat = async (id) => {
        try {
            localStorage.setItem('cat_id', id);
        } catch (error) {
            console.error("Error:", error)
        }
    }


    useEffect(() => {
        getCats();
    }, [])


    return (
        <div className="card-grid">
        {cats.map((cat, index) => (
            <div className="cat-card">
                <img className="card-image" src={require(`.${cat.image_url}`)} alt={cat.name} />
                <h1 className="card-title">{cat.name}</h1>
                <h4 className="card-text">Edad: {cat.age}</h4>
                <Link className="card-link" onClick={e => setCat(cat.cat_id)} to={`/cat/${cat.cat_id}`}>
                    Más Info
                </Link>
            </div>
        ))}
        </div>
    )
}

export default CatsPage;