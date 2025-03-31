import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Supplier.css';

function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedContactNo, setEditedContactNo] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/suppliers");
            setSuppliers(response.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[0-9]{10}$/;

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        if (!name || !email || !contactNo) return alert("All fields are required!");

        if (!emailRegex.test(email)) {
            alert("Invalid email format!");
            return;
        }

        if (!mobileRegex.test(contactNo)) {
            alert("Contact number must be exactly 10 digits!");
            return;
        }

        if (suppliers.some(supplier => supplier.name.toLowerCase() === name.toLowerCase())) {
            alert("Supplier name already exists! Please use a different name.");
            return;
        }

        if (suppliers.some(supplier => supplier.email === email)) {
            alert("Email already exists! Please use a different email.");
            return;
        }

        if (suppliers.some(supplier => supplier.contactNo === contactNo)) {
            alert("Contact number already exists! Please use a different number.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/suppliers", { name, email, contactNo });
            setName("");
            setEmail("");
            setContactNo("");
            fetchSuppliers();
        } catch (error) {
            alert(error.response?.data?.error || "Error adding supplier");
        }
    };

    const handleEditClick = (supplier) => {
        setEditMode(supplier._id);
        setEditedName(supplier.name);
        setEditedEmail(supplier.email);
        setEditedContactNo(supplier.contactNo);
    };

    const handleSaveEdit = async (id) => {
        if (!editedName || !editedEmail || !editedContactNo) return alert("Fields cannot be empty!");

        if (!emailRegex.test(editedEmail)) {
            alert("Invalid email format!");
            return;
        }

        if (!mobileRegex.test(editedContactNo)) {
            alert("Contact number must be exactly 10 digits!");
            return;
        }

        if (suppliers.some(supplier => supplier.name.toLowerCase() === editedName.toLowerCase() && supplier._id !== id)) {
            alert("Supplier name already exists! Please use a different name.");
            return;
        }

        if (suppliers.some(supplier => supplier.email === editedEmail && supplier._id !== id)) {
            alert("Email already exists! Please use a different email.");
            return;
        }

        if (suppliers.some(supplier => supplier.contactNo === editedContactNo && supplier._id !== id)) {
            alert("Contact number already exists! Please use a different number.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/suppliers/${id}`, {
                name: editedName,
                email: editedEmail,
                contactNo: editedContactNo,
            });
            setEditMode(null);
            fetchSuppliers();
        } catch (error) {
            alert(error.response?.data?.error || "Error updating supplier");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) return;

        try {
            await axios.delete(`http://localhost:5000/suppliers/${id}`);
            fetchSuppliers();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting supplier");
        }
    };

    return (
        <div className="container">
            <h2 className="text-5xl font-carattere">Add Supplier</h2>
            <form onSubmit={handleAddSupplier} className="form">
                <input 
                    type="text" 
                    placeholder="Supplier Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Contact No" 
                    value={contactNo} 
                    onChange={(e) => setContactNo(e.target.value)} 
                />
                <button type="submit">Add Supplier</button>
            </form>

            <h2 className="text-5xl font-carattere">Supplier List</h2>
            <table border="1" className="supplier-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact No</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier._id}>
                            {editMode === supplier._id ? (
                                <>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={editedName} 
                                            onChange={(e) => setEditedName(e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="email" 
                                            value={editedEmail} 
                                            onChange={(e) => setEditedEmail(e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={editedContactNo} 
                                            onChange={(e) => setEditedContactNo(e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(supplier._id)}>Save</button>
                                        <button onClick={() => setEditMode(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.contactNo}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(supplier)}>Edit</button>
                                        <button onClick={() => handleDelete(supplier._id)}>Delete</button>
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

export default Supplier;
