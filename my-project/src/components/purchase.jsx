import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";

function Purchase() {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [supplier, setSupplier] = useState("");
    const [category, setCategory] = useState("");
    const [dateOfPurchase, setDateOfPurchase] = useState("");

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
            alert("All fields including date are required!");
            return;
        }

        if (isNaN(quantity) || isNaN(pricePerUnit)) {
            alert("Quantity and Price Per Unit must be valid numbers.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/purchases/add", {
                name,
                quantity: Number(quantity),
                pricePerUnit: Number(pricePerUnit),
                supplier,
                category,
                dateOfPurchase: new Date(dateOfPurchase).toISOString() // 🔥 Ensure valid date format
            });

            alert("Purchase added successfully!");
            fetchPurchases();

            // Clear form
            setName("");
            setQuantity("");
            setPricePerUnit("");
            setSupplier("");
            setCategory("");
            setDateOfPurchase("");
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
            <h2 className="title">Purchase Entry</h2>

            <form onSubmit={handleAddPurchase} className="form">
                <div className="filter-form">
                    <div className="input-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Children">Children</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Price Per Unit</label>
                        <input
                            type="number"
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(e.target.value)}
                            placeholder="Enter price"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Supplier</label>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((sup) => (
                                <option key={sup._id} value={sup._id}>
                                    {sup.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Date of Purchase</label>
                        <input
                            type="date"
                            value={dateOfPurchase}
                            onChange={(e) => setDateOfPurchase(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="save-btn">Save</button>
                </div>
            </form>

            <div className="table-container">
                <table className="table-1">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price/Unit</th>
                            <th>Supplier</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length > 0 ? (
                            purchases.map((purchase) => (
                                <tr key={purchase._id}>
                                    <td>{purchase.name}</td>
                                    <td>{purchase.category}</td>
                                    <td>{purchase.quantity}</td>
                                    <td>₹{purchase.pricePerUnit.toFixed(2)}</td>
                                    <td>{purchase.supplier?.name || "Unknown"}</td>
                                    <td>
                                        {purchase.dateOfPurchase
                                            ? new Date(purchase.dateOfPurchase).toLocaleDateString()
                                            : "No Date"}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeletePurchase(purchase._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-records">
                                    No purchase records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Purchase;
