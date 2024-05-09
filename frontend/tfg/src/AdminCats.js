import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./Axios";

const API = process.env.REACT_APP_API;

export const AdminCats = () => {
    const [isAdmin, setIsAdmin] = useState(true); 
    
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [age, setAge] = useState('')
    const [breed, setBreed] = useState('')
    const [file, setFile] = useState(null)
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false)
    const [id, setID] = useState('')

    const [cats, setCats] = useState([])

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const res = await axiosInstance.get("/admin/checkAdminStatus");
                const data = res.data;
                setIsAdmin(data.admin);
                if(isAdmin){
                    getCats();
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('age', age);
            formData.append('breed', breed);
            formData.append('image_url', file);

            if (!editing) {
                const res = await fetch(`${API}/admin/cats`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (res.ok){
                    console.log("Gato creado")
                } else {
                    setError(`Hubo un error. ${data.error}`);
                }
            } else {
                const res = await axiosInstance.put(`/admin/cat/${id}`, formData);
                console.log(res.data);
                setEditing(false);
                setID('');
            }
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            await getCats();

            setName('');
            setDescription('');
            setAge('');
            setBreed('');
            setFile(null);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getCats = async () => {
        try {
            const res = await axiosInstance.get(`/admin/cats`);
            setCats(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error getting cats:", error);
        }
    }

    

    
    const editCat = async (id) => {
        try {
            const res = await axiosInstance.get(`/admin/cat/${id}`);
            const data = res.data;
            setEditing(true);
            setID(data._id);
            setName(data.name);
            setDescription(data.description);
            setAge(data.age);
            setBreed(data.breed);
        } catch (error) {
            console.error("Error editing cat:", error);
        }
    }

    const deleteCat = async (id) => {
        const catResponse = window.confirm('¿Estás seguro de que quieres eliminarlo?')

        if(catResponse) {
            try {
                const res = await axiosInstance.delete(`/admin/cat/${id}`);
                console.log(res.data);
                await getCats();
            } catch (error) {
                console.error("Error deleting cat:", error);
            }
        }
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body" encType="multipart/form-data">
                    {error && <p className="text-center mb-4" style={{ color: "red" }}>{error}</p>}
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setName(e.target.value)} 
                            value={name} 
                            className="form-control"
                            placeholder="Nombre"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setDescription(e.target.value)} 
                            value={description} 
                            className="form-control"
                            placeholder="Descripción"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setAge(e.target.value)} 
                            value={age} 
                            className="form-control"
                            placeholder="Edad"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setBreed(e.target.value)} 
                            value={breed} 
                            className="form-control"
                            placeholder="Raza"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="file" 
                            onChange={e => setFile(e.target.files[0])}
                            className="form-control"
                        />
                    </div>
                    <button className="btn btn-primary btn-block">
                        {editing ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
            </div>
            <div className="col-md-6">
                <table className="table table-strip">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Edad</th>
                            <th>Raza</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cats.map(cat => (
                                <tr key={cat._id}>
                                    <td><img src={require(`.${cat.image_url}`)}  width="100" height="100" alt="gato"/></td>  
                                    <td>{cat.name}</td>
                                    <td>{cat.description}</td>
                                    <td>{cat.age}</td>
                                    <td>{cat.breed}</td>
                                    <td>
                                        <button 
                                            className="btn btn-secondary btn-sm btn-block"
                                            onClick={e => editCat(cat._id)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm btn-block"
                                            onClick={(e) => deleteCat(cat._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminCats;