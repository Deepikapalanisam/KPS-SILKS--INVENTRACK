import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
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
    customerName: "",
    mobile: "",
  });

  const tableRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/stock")
      .then(res => setStockData(res.data))
      .catch(err => console.error("Error fetching stock:", err));

    axios.get("http://localhost:5000/billing")
      .then(res => {
        setBillingDetails(res.data);
        setTimeout(checkScrollHint, 100);
      })
      .catch(err => console.error("Error fetching billings:", err));
  }, []);

  const checkScrollHint = () => {
    const el = tableRef.current;
    setShowScrollHint(el && el.scrollHeight > el.clientHeight);
  };

  const handleItemChange = (e) => {
    const name = e.target.value;
    setSelectedItem(name);
    const item = stockData.find(item => item.name === name);
    if (item) {
      setFormData({
        ...formData,
        name: item.name,
        quantity: "",
        price: item.pricePerUnit || 0,
        totalPrice: 0,
      });
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10) || 0;
    setFormData(prev => ({
      ...prev,
      quantity,
      totalPrice: prev.price * quantity,
    }));
  };

  const handlePriceChange = (e) => {
    const price = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      price,
      totalPrice: price * prev.quantity,
    }));
  };

  const handleMobileChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (input.length <= 10) {
      setFormData((prev) => ({ ...prev, mobile: input }));
    }
  };

  const handleDownloadPDF = async () => {
    const item = stockData.find(i => i.name === formData.name);
    const quantity = parseInt(formData.quantity, 10);
    const price = parseFloat(formData.price);
    const totalPrice = price * quantity;
    const date = new Date().toISOString().split("T")[0];

    if (!item || !quantity || !price || !formData.customerName || !formData.mobile) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Enter a valid 10-digit mobile number.");
      return;
    }

    if (item.quantity < quantity) {
      alert("Not enough stock available!");
      return;
    }

    const updatedQuantity = item.quantity - quantity;

    try {
      // PDF Generation
      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("KPS SILKS", 20, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${date}`, 150, 20, { align: "right" });

      doc.setFontSize(10);
      doc.text("415 Uthukuli Road,", 20, 28);
      doc.text("Kunnnathur, Tamil Nadu - 638103", 20, 33);

      doc.setFontSize(12);
      doc.text(`Customer Name : ${formData.customerName}`, 20, 45);
      doc.text(`Mobile Number : +91 ${formData.mobile}`, 20, 50);

      doc.text("-------------------------------------------------------------", 20, 55);

      doc.text(`Product Name  : ${formData.name}`, 20, 65);
      doc.text(`Quantity      : ${formData.quantity}`, 20, 75);
      doc.text(`Price / Unit  : Rs. ${formData.price.toFixed(2)}`, 20, 85);
      doc.text(`Total Price   : Rs. ${formData.totalPrice.toFixed(2)}`, 20, 95);

      doc.text("-------------------------------------------------------------", 20, 105);
      doc.text("Thank you for your purchase!", 20, 115);

      doc.save(`bill_${formData.name}_${date}.pdf`);

      // Update DBs
      await axios.put(`http://localhost:5000/stock/${item._id}`, {
        quantity: updatedQuantity,
      });

      const res = await axios.post("http://localhost:5000/billing", {
        name: formData.name,
        quantity,
        price,
        totalPrice,
        date,
        customerName: formData.customerName,
        mobile: formData.mobile,
      });

      setBillingDetails((prev) => [res.data, ...prev]);
      setSelectedItem("");
      setFormData({
        name: "",
        quantity: "",
        price: "",
        totalPrice: 0,
        customerName: "",
        mobile: "",
      });

      alert("Bill saved and downloaded successfully!");
      setTimeout(checkScrollHint, 100);
    } catch (err) {
      console.error("Error during PDF generation and save:", err);
      alert("Error saving and downloading bill. Check console.");
    }
  };

  return (
    <div className="container">
      <h2 className="gradient-heading">Billing Section</h2>

      <form className="form">
        <div className="filter-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, customerName: e.target.value }))
              }
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleMobileChange}
            />
          </div>

          <div className="input-group">
            <select value={selectedItem} onChange={handleItemChange}>
              <option value="">Select item</option>
              {Array.isArray(stockData) &&
                stockData.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleQuantityChange}
              placeholder="Quantity"
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handlePriceChange}
              placeholder="Price"
            />
          </div>

          <div className="input-group">
            <input type="text" value={formData.totalPrice} readOnly />
          </div>

          <button type="button" className="save-btn" onClick={handleDownloadPDF}>
            Generate Bill
          </button>
        </div>
      </form>

      <div className="table-container relative" ref={tableRef}>
        <table className="table-1">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Mobile</th>
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
                  <td>{bill.customerName}</td>
                  <td>+91 {bill.mobile}</td>
                  <td>{bill.name}</td>
                  <td>{bill.quantity}</td>
                  <td>₹{bill.price}</td>
                  <td>{bill.date}</td>
                  <td>₹{bill.totalPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-records">
                  No billing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
