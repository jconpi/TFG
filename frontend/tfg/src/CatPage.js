import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "./Axios";

const API = process.env.REACT_APP_API;

export const CatPage = () => {
    const [cat, setCat] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCat = async () => {
            try {
                const cat_id = localStorage.getItem('cat_id')
                const res = await axiosInstance.get(`/cat/${cat_id}`);
                console.log(res.data)
                setCat(res.data)
            } catch (error) {
                console.error("Error getting cats:", error);
            } finally {
                setLoading(false);
            };

        }

        getCat();
    }, []);

    const handleClick = async (cat) => {
        try {
            console.log(cat)
            localStorage.setItem('cat_id', cat.cat_id);
            localStorage.setItem('cat_name', cat.name);
        } catch (error) {
            console.error("Error:", error)
        }
    }


    return (
        <div className="cat-card">
        {loading ? (
            <div>Loading...</div>
        ) : (
            <>
                <img
                    src={require(`.${cat.image_url}`)}
                    alt={cat.name}
                    onLoad={() => setLoading(false)}
                />
                <h1>{cat.name}</h1>
                <h4>Edad: {cat.age}</h4>
                <p>{cat.description}</p>
                <Link className="btn btn-secondary btn-block" onClick={() => handleClick(cat)} to={`/cats/form`}>
                    Adóptame
                </Link>
            </>
        )}
        </div>
    );
}

export default CatPage;