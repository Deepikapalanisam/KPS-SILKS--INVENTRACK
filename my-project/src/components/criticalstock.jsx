import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CriticalStock.css";

const CriticalStock = () => {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/stock");
            setStocks(response.data);
        } catch (error) {
            console.error("Error fetching stocks:", error);
        }
    };

    // Filtering stocks with quantity less than 20
    const filteredStocks = stocks.filter(stock =>
        stock.quantity < 20 &&
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category ? stock.category.toLowerCase().includes(category.toLowerCase()) : true) &&
        (supplier ? stock.supplier.toLowerCase().includes(supplier.toLowerCase()) : true)
    );

    return (
        <div className="critical-container">
            <h2 className="text-6xl font-carattere font-bold mb-4 "> Critical Stock Items</h2>

            <div className="filters">
                <input type="text" placeholder=" earch by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <input type="text" placeholder="Filter by category..." value={category} onChange={(e) => setCategory(e.target.value)} />
                <input type="text" placeholder="Filter by supplier..." value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Supplier</th>
                        <th>Quantity</th>
                        <th>Price Per Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStocks.length > 0 ? (
                        filteredStocks.map((stock) => (
                            <tr key={stock._id} className={stock.quantity < 10 ? "critical" : "warning"}>
                                <td>{stock.name}</td>
                                <td>{stock.category}</td>
                                <td>{stock.supplier}</td>
                                <td>{stock.quantity}</td>
                                <td>${stock.pricePerUnit.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-stock">✅ No critical stock items found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CriticalStock;
