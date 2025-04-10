import React, { useState, useEffect, useRef } from "react";
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
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const checkScrollHint = () => {
      const el = tableRef.current;
      setShowScrollHint(el && el.scrollHeight > el.clientHeight);
    };

    checkScrollHint();
    window.addEventListener("resize", checkScrollHint);
    return () => window.removeEventListener("resize", checkScrollHint);
  }, [purchases]);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:5000/purchases");
      setPurchases(res.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/suppliers");
      setSuppliers(res.data);
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
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/purchases/add", {
        name,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit),
        supplier,
        category,
        dateOfPurchase: new Date(dateOfPurchase).toISOString(),
      });

      console.log("Saved purchase:", response.data);
      alert("Purchase added successfully!");
      fetchPurchases();

      // Reset form
      setName("");
      setQuantity("");
      setPricePerUnit("");
      setSupplier("");
      setCategory("");
      setDateOfPurchase("");
    } catch (error) {
      console.error("Error adding purchase:", error);
      alert(error.response?.data?.error || "Error adding purchase");
    } finally {
      setIsLoading(false);
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
      <h2 className="gradient-heading">Purchase Entry</h2>

      <form onSubmit={handleAddPurchase} className="form">
        <div className="filter-form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="input-group">
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
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="input-group">
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
            <input
              type="date"
              value={dateOfPurchase}
              onChange={(e) => setDateOfPurchase(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <div className="table-container" ref={tableRef}>
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

        {showScrollHint && (
          <span className="material-symbols-outlined scroll-hint-icon">
            arrow_downward_alt
          </span>
        )}
      </div>
    </div>
  );
}

export default Purchase;
