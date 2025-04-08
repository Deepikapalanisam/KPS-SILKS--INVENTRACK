import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const Billing = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    totalPrice: 0,
  });
  const [billingDetails, setBillingDetails] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/stock")
      .then((res) => setStockData(res.data))
      .catch((err) => console.error(err));

    axios.get("http://localhost:5000/billing")
      .then((res) => setBillingDetails(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleItemChange = (e) => {
    const name = e.target.value;
    setSelectedItem(name);
    const item = stockData.find((item) => item.name === name);

    if (item) {
      setFormData({
        name: item.name,
        quantity: "",
        price: "",
        totalPrice: 0,
      });
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      quantity,
      totalPrice: prev.price * quantity,
    }));
  };

  const handlePriceChange = (e) => {
    const price = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      price,
      totalPrice: price * prev.quantity,
    }));
  };

  const handleGenerateBill = () => {
    const item = stockData.find((item) => item.name === formData.name);

    if (item && item.quantity >= formData.quantity) {
      const updatedQuantity = item.quantity - formData.quantity;

      axios.put(`http://localhost:5000/stock/${item._id}`, {
        quantity: updatedQuantity,
      }).then(() => {
        const currentDate = new Date().toISOString().split('T')[0];

        axios.post("http://localhost:5000/billing", {
          name: formData.name,
          quantity: formData.quantity,
          price: formData.price,
          totalPrice: formData.totalPrice,
          date: currentDate,
        }).then((response) => {
          setBillingDetails((prev) => [...prev, response.data]);
          setSelectedItem("");
          setFormData({
            name: "",
            quantity: "",
            price: "",
            totalPrice: 0,
          });
        }).catch((err) => {
          console.error("Error saving the bill:", err);
        });
      }).catch((err) => {
        console.error("Error updating stock:", err);
      });
    } else {
      alert("Not enough stock available!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container">
      <h2 className="title">Billing</h2>

      <form className="form">
        <div className="filter-form">
          <div className="input-group">
            <label>Item</label>
            <select value={selectedItem} onChange={handleItemChange}>
              <option value="">Select item</option>
              {stockData.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={handleQuantityChange}
              placeholder="Quantity"
            />
          </div>

          <div className="input-group">
            <label>Price (per unit)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handlePriceChange}
              placeholder="Price"
            />
          </div>

          <div className="input-group">
            <label>Total Price</label>
            <input type="text" value={formData.totalPrice} readOnly />
          </div>

          <button type="button" className="save-btn" onClick={handleGenerateBill}>
            Generate Bill
          </button>
        </div>
      </form>

      <div className="table-container">    
        <table className="table-1">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billingDetails.length > 0 ? (
              billingDetails
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.name}</td>
                    <td>{bill.quantity}</td>
                    <td>₹{bill.price}</td>
                    <td>{formatDate(bill.date)}</td>
                    <td>₹{bill.totalPrice}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="no-records">
                  No billing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
