import React, {useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./Axios";

const API = process.env.REACT_APP_API;

export const AdminUsers = () => {
    const [isAdmin, setIsAdmin] = useState(true); 
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("");
    const [admin, setAdmin] = useState(false)

    const [editing, setEditing] = useState(false)
    const [id, setID] = useState('')

    const [users, setUsers] = useState([])

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const res = await axiosInstance.get("/admin/checkAdminStatus");
                const data = res.data;
                setIsAdmin(data.admin);
                if(isAdmin){
                    getUsers();
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


    // Si el usuario no es un administrador, redirige a la página principal
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editing) {
            const res = await fetch(`${API}/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    admin
                })
            });
            const data = await res.json();
            console.log(data)

            if (res.ok){
                console.log("usuario creado")
            } else {
                setError(`Hubo un error. ${data.error}`);
            }
        } else {
            try {
                console.log(admin)
                const res = await axiosInstance.put(`/admin/users/${id}`, {
                    name,
                    email,
                    password,
                    admin
                });
                console.log(res.data);
                setEditing(false);
                setID('');
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }

        await getUsers();

        setName('');
        setEmail('');
        setPassword('');
        setAdmin(false)
    }

    const getUsers = async () => {
        try {
            const res = await axiosInstance.get(`/admin/users`);
            setUsers(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error getting users:", error);
        }
    }

    
    const editUser = async (id) => {
        try {
            const res = await axiosInstance.get(`/admin/user/${id}`);
            const data = res.data;
            setEditing(true);
            setID(data._id);
            setName(data.name);
            setEmail(data.email);
            const adminValue = data.admin === true ? true : false;
            setAdmin(adminValue)
        } catch (error) {
            console.error("Error editing user:", error);
        }
    }

    const deleteUser = async (id) => {
        const userResponse = window.confirm('Are you sure you want to delete it?')

        if(userResponse) {
            try {
                const res = await axiosInstance.delete(`/admin/users/${id}`);
                console.log(res.data);
                await getUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    {error && <p className="text-center mb-4" style={{ color: "red" }}>{error}</p>}
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setName(e.target.value)} 
                            value={name} 
                            className="form-control"
                            placeholder="Name"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            onChange={e => setEmail(e.target.value)} 
                            value={email} 
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-group">
                        Admin
                        <input
                            type="checkbox"
                            onChange={e => setAdmin(e.target.checked)}
                            checked={admin}
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.admin ? 'True' : 'False'}</td>
                                <td>
                                    <button 
                                        className="btn btn-secondary btn-sm btn-block"
                                        onClick={e => editUser(user._id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={(e) => deleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
