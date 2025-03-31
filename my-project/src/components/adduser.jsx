import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/AddUser.css';

function AddUser() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedPassword, setEditedPassword] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const usernameRegex = /^[a-zA-Z]+@(admin|billdesk)$/;

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!username || !password) return alert("All fields are required!");

        if (!usernameRegex.test(username)) {
            alert("Invalid username! Use only alphabets followed by @admin or @billdesk.");
            return;
        }

        if (users.some(user => user.username === username)) {
            alert("Username already exists! Please choose a different username.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/users", { username, password });
            setUsername("");
            setPassword("");
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || "Error adding user");
        }
    };

    const handleEditClick = (user) => {
        setEditMode(user._id);
        setEditedUsername(user.username);
        setEditedPassword(user.password);
    };

    const handleSaveEdit = async (id) => {
        if (!editedUsername || !editedPassword) return alert("Fields cannot be empty!");

        if (!usernameRegex.test(editedUsername)) {
            alert("Invalid username! Use only alphabets followed by @admin or @billdesk.");
            return;
        }

        if (users.some(user => user.username === editedUsername && user._id !== id)) {
            alert("Username already exists! Please choose a different username.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/users/${id}`, {
                username: editedUsername,
                password: editedPassword,
            });
            setEditMode(null);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || "Error updating user");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting user");
        }
    };

    return (
        <div className="container">
            <h2 className="text-5xl font-carattere">Add User</h2>
            <form onSubmit={handleAddUser} className="form">
                <input 
                    type="text" 
                    placeholder="Username (e.g., name@admin or name@billdesk)" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Add User</button>
            </form>

            <h2 className="text-5xl font-carattere">User List</h2>
            <table border="1" className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            {editMode === user._id ? (
                                <>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={editedUsername} 
                                            onChange={(e) => setEditedUsername(e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="password" 
                                            value={editedPassword} 
                                            onChange={(e) => setEditedPassword(e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(user._id)}>Save</button>
                                        <button onClick={() => setEditMode(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.username}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(user)}>Edit</button>
                                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddUser;
