import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const Billing = () => {
  const [stockData, setStockData] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    totalPrice: 0,
  });

  const tableRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/stock")
      .then((res) => setStockData(res.data))
      .catch((err) => console.error("Error fetching stock:", err));

    axios.get("http://localhost:5000/billings")
      .then((res) => {
        setBillingDetails(res.data);
        setTimeout(checkScrollHint, 100); // Give DOM time to render
      })
      .catch((err) => console.error("Error fetching billings:", err));
  }, []);

  const checkScrollHint = () => {
    const el = tableRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      setShowScrollHint(true);
    } else {
      setShowScrollHint(false);
    }
  };

  const handleItemChange = (e) => {
    const name = e.target.value;
    setSelectedItem(name);
    const item = stockData.find((item) => item.name === name);

    if (item) {
      setFormData({
        name: item.name,
        quantity: "",
        price: item.pricePerUnit || 0,
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

  const handleGenerateBill = async () => {
    const item = stockData.find((item) => item.name === formData.name);
    const quantity = parseInt(formData.quantity);
    const price = parseFloat(formData.price);
    const totalPrice = price * quantity;

    if (!item || !quantity || !price) {
      alert("Please select a valid item, quantity, and price.");
      return;
    }

    if (item.quantity < quantity) {
      alert("Not enough stock available!");
      return;
    }

    const updatedQuantity = item.quantity - quantity;

    try {
      await axios.put(`http://localhost:5000/stock/${item._id}`, {
        quantity: updatedQuantity,
      });

      const res = await axios.post("http://localhost:5000/billings", {
        name: formData.name,
        quantity,
        price,
        totalPrice,
      });

      setBillingDetails((prev) => [res.data, ...prev]);
      setSelectedItem("");
      setFormData({ name: "", quantity: "", price: "", totalPrice: 0 });
      alert("Bill generated successfully!");
      setTimeout(checkScrollHint, 100);
    } catch (err) {
      console.error("Error saving the bill:", err);
      alert("Error generating bill. Check console.");
    }
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
              min="1"
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

      <div className="table-container relative" ref={tableRef}>
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
              billingDetails.map((bill, index) => (
                <tr key={index}>
                  <td>{bill.name}</td>
                  <td>{bill.quantity}</td>
                  <td>₹{bill.price}</td>
                  <td>{bill.date}</td>
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

        {/* Scroll hint icon */}
        {showScrollHint && (
          <span className="material-symbols-outlined scroll-hint-icon">
            arrow_downward_alt
          </span>
        )}
      </div>
    </div>
  );
};

export default Billing;
