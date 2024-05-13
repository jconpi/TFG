import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./Axios";

const API = process.env.REACT_APP_API;

export const AdminCafes = () => {
    const [isAdmin, setIsAdmin] = useState(true); 
    
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [file, setFile] = useState(null)
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false)
    const [id, setID] = useState('')

    const [cafes, setCafes] = useState([])
    const [editingImage, setEditingImage] = useState(false)

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const res = await axiosInstance.get("/admin/checkAdminStatus");
                const data = res.data;
                setIsAdmin(data.admin);
                if(isAdmin){
                    getCafes();
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
            formData.append('price', price);
            formData.append('image_url', file);
            if (editingImage === true){
                formData.append('image_url', file);
            }

            if (!editing) {
                const res = await fetch(`${API}/admin/cafes`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (res.ok){
                    console.log("Cafe creado")
                } else {
                    setError(`Hubo un error. ${data.error}`);
                }
            } else {
                const res = await axiosInstance.put(`/admin/cafe/${id}`, formData);
                console.log(res.data);
                setEditing(false);
                setID('');
                setFile(null)
            }
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            await getCafes();

            setName('');
            setDescription('');
            setPrice('');
            setFile(null);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getCafes = async () => {
        try {
            const res = await axiosInstance.get(`/admin/cafes`);
            setCafes(res.data);
        } catch (error) {
            console.error("Error getting cafes:", error);
        }
    }
    
    const editCafe = async (id) => {
        try {
            const res = await axiosInstance.get(`/admin/cafe/${id}`);
            const data = res.data;
            setEditing(true);
            setID(data._id);
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        } catch (error) {
            console.error("Error editing cafe:", error);
        }
    }

    const deleteCafe = async (id) => {
        const cafeResponse = window.confirm('¿Estás seguro de que quieres eliminarlo?')
        if(cafeResponse) {
            try {
                const res = await axiosInstance.delete(`/admin/cafe/${id}`);
                console.log(res.data);
                await getCafes();
            } catch (error) {
                console.error("Error deleting cafe:", error);
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
                            onChange={e => setPrice(e.target.value)} 
                            value={price} 
                            className="form-control"
                            placeholder="Precio"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="file" 
                            onChange={e => {
                                setFile(e.target.files[0])
                                setEditingImage(true)
                            }}
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
                            <th>Precio</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cafes.map(cafe => (
                                <tr key={cafe._id}>
                                    <td><img src={require(`.${cafe.image_url}`)}  width="100" height="100" alt="cafe"/></td>  
                                    <td>{cafe.name}</td>
                                    <td>{cafe.description}</td>
                                    <td>{cafe.price}</td>
                                    <td>
                                        <button 
                                            className="btn btn-secondary btn-sm btn-block"
                                            onClick={e => editCafe(cafe._id)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm btn-block"
                                            onClick={(e) => deleteCafe(cafe._id)}
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

export default AdminCafes;