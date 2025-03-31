import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Stock.css';

const Stock = () => {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/stock"); // ✅ Fixed API URL
            setStocks(response.data);
        } catch (error) {
            console.error("Error fetching stocks:", error);
        }
    };

    const filteredStocks = stocks.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category ? stock.category.toLowerCase() === category.toLowerCase() : true) &&
        (supplier ? stock.supplier.toLowerCase().includes(supplier.toLowerCase()) : true)
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-6xl font-carattere font-bold mb-4">Stock List</h2>

            <div className="flex gap-4 mb-4">
                <input type="text" placeholder="Search by name..." className="border p-2 rounded" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <input type="text" placeholder="Filter by category..." className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)} />
                <input type="text" placeholder="Filter by supplier..." className="border p-2 rounded" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Supplier</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Price Per Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStocks.length > 0 ? (
                        filteredStocks.map((stock) => (
                            <tr key={stock._id} className="text-center">
                                <td className="border p-2">{stock.name}</td>
                                <td className="border p-2">{stock.category}</td>
                                <td className="border p-2">{stock.supplier}</td>
                                <td className="border p-2">{stock.quantity}</td>
                                <td className="border p-2">${stock.pricePerUnit}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center p-4">No stock items found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Stock;
