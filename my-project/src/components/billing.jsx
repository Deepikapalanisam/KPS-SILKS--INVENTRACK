import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/Billing.css";

const Billing = () => {
    const [stocks, setStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/stock");
            setStocks(response.data);
            setFilteredStocks(response.data);
        } catch (error) {
            console.error("Error fetching stocks:", error);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredStocks(
            term === "" ? stocks : stocks.filter(stock => stock.name.toLowerCase().includes(term))
        );
    };

    const handleSelectItem = (stock) => {
        if (!selectedItems.some(item => item._id === stock._id)) {
            setSelectedItems([...selectedItems, { ...stock, quantityToBuy: 1 }]);
        }
    };

    const handleQuantityChange = (id, quantity) => {
        setSelectedItems(selectedItems.map(item =>
            item._id === id ? { ...item, quantityToBuy: Math.min(quantity, item.quantity) } : item
        ));
    };

    const generateBill = async () => {
        if (selectedItems.length === 0) {
            alert("No items selected!");
            return;
        }

        try {
            for (const item of selectedItems) {
                await axios.put(`http://localhost:5000/stock/${item._id}`, {
                    quantity: item.quantity - item.quantityToBuy
                });
            }

            fetchStocks();
            generatePDF(selectedItems);
            setSelectedItems([]);
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Failed to update stock. Try again!");
        }
    };

    const generatePDF = (billItems) => {
        if (billItems.length === 0) {
            console.warn("No items selected for billing!");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("🧾 KPS Silks Bill Summary", 10, 15);

        const tableData = billItems.map((item, index) => [
            index + 1,
            item.name,
            item.quantityToBuy,
            `₹${item.pricePerUnit.toFixed(2)}`,
            `₹${(item.quantityToBuy * item.pricePerUnit).toFixed(2)}`
        ]);

        doc.autoTable({
            head: [["#", "Item", "Quantity", "Price", "Total"]],
            body: tableData,
            startY: 25
        });

        const total = billItems.reduce((sum, item) => sum + (item.quantityToBuy * item.pricePerUnit), 0).toFixed(2);
        doc.text(`Total Amount: ₹${total}`, 10, doc.autoTable.previous.finalY + 10);

        // Convert to Blob and open in a new tab
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const newWindow = window.open(pdfUrl, "_blank");

        if (!newWindow) {
            alert("⚠️ Pop-up blocked! Please allow pop-ups for this site.");
        }

        setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    };

    return (
        <div className="billing-container">
            <h2 className="text-5xl font-carattere">🛒 Billing System</h2>

            <input
                type="text"
                placeholder="Search for a stock..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />

            {filteredStocks.length > 0 ? (
                <div className="stock-list">
                    <h3>Select Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStocks.map(stock => (
                                <tr key={stock._id}>
                                    <td>{stock.name}</td>
                                    <td>{stock.category}</td>
                                    <td>{stock.supplier}</td>
                                    <td>{stock.quantity}</td>
                                    <td>₹{stock.pricePerUnit.toFixed(2)}</td>
                                    <td>
                                        <button 
                                            disabled={stock.quantity === 0}
                                            onClick={() => handleSelectItem(stock)}
                                        >
                                            ➕ Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No stock found!</p>
            )}

            {selectedItems.length > 0 && (
                <div className="selected-items">
                    <h3>Selected Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            max={item.quantity}
                                            value={item.quantityToBuy}
                                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td>₹{item.pricePerUnit.toFixed(2)}</td>
                                    <td>₹{(item.quantityToBuy * item.pricePerUnit).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={generateBill} className="generate-bill">🧾 Generate Bill</button>
                    <button onClick={() => generatePDF(selectedItems)} className="download-pdf">📄 Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default Billing;
