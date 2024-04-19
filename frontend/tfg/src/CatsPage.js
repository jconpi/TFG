import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./Axios";

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

    useEffect(() => {
        getCats();
    }, [])


    return (
        <div className="row">
        {cats.map((cat, index) => (
            <div key={cat.id}>
                <img src={require(`.${cat.image_url}`)} alt={cat.name} />
                <h1>{cat.name}</h1>
                <h4>Edad: {cat.age}</h4>
                <p>{cat.description}</p>
                <button>Adoptar</button>
            </div>
        ))}
        </div>
    )
}

export default CatsPage;