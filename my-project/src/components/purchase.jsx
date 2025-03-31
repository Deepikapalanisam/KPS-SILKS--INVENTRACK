import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Purchase.css";

function Purchase() {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [supplier, setSupplier] = useState("");
    const [category, setCategory] = useState("");
    const [dateOfPurchase, setDateOfPurchase] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
    }, []);

    const fetchPurchases = async () => {
        try {
            const response = await axios.get("http://localhost:5000/purchases");
            setPurchases(response.data);
        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/suppliers");
            setSuppliers(response.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const handleAddPurchase = async (e) => {
        e.preventDefault();
        if (!name || !quantity || !pricePerUnit || !supplier || !category || !dateOfPurchase) {
            alert("All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/purchases/add", {
                name, quantity: Number(quantity), pricePerUnit: Number(pricePerUnit), supplier, category, dateOfPurchase
            });
            fetchPurchases();
            setShowForm(false);
            setName(""); setQuantity(""); setPricePerUnit(""); setSupplier(""); setCategory(""); setDateOfPurchase("");
        } catch (error) {
            alert(error.response?.data?.error || "Error adding purchase");
        }
    };

    const handleDeletePurchase = async (id) => {
        if (!window.confirm("Are you sure you want to delete this purchase?")) return;

        try {
            await axios.delete(`http://localhost:5000/purchases/${id}`);
            fetchPurchases();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting purchase");
        }
    };

    return (
        <div className="container">
            <h2 className="text-5xl font-carattere">Purchases</h2>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close Form" : "Add Purchase"}
            </button>

            {showForm && (
                <form onSubmit={handleAddPurchase} className="form">
                    <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    <input type="number" placeholder="Price Per Unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} required />
                    
                    <select value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map((sup) => (
                            <option key={sup._id} value={sup._id}>{sup.name}</option>
                        ))}
                    </select>

                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select Category</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Children">Children</option>
                    </select>

                    <input type="date" value={dateOfPurchase} onChange={(e) => setDateOfPurchase(e.target.value)} />

                    <button type="submit">Add Purchase</button>
                </form>
            )}

            <table className="purchase-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price Per Unit</th>
                        <th>Supplier</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                            <td>{purchase.name}</td>
                            <td>{purchase.quantity}</td>
                            <td>{purchase.pricePerUnit}</td>
                            <td>{purchase.supplier?.name || "Unknown"}</td>
                            <td>{purchase.category}</td>
                            <td>{new Date(purchase.dateOfPurchase).toLocaleDateString()}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDeletePurchase(purchase._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Purchase;
