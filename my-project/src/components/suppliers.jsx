import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/styles.css";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedContactNo, setEditedContactNo] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    checkTableScroll();
    window.addEventListener("resize", checkTableScroll);
    return () => window.removeEventListener("resize", checkTableScroll);
  }, [suppliers]);

  const checkTableScroll = () => {
    if (tableRef.current) {
      const { scrollHeight, clientHeight } = tableRef.current;
      setShowScrollHint(scrollHeight > clientHeight);
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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[0-9]{10}$/;

  const handleAddSupplier = async (e) => {
    e.preventDefault();

    if (!name || !email || !contactNo) return alert("All fields are required!");
    if (!emailRegex.test(email)) return alert("Invalid email format!");
    if (!mobileRegex.test(contactNo)) return alert("Contact number must be exactly 10 digits!");

    if (suppliers.some(s => s.name.toLowerCase() === name.toLowerCase())) return alert("Supplier name already exists!");
    if (suppliers.some(s => s.email === email)) return alert("Email already exists!");
    if (suppliers.some(s => s.contactNo === contactNo)) return alert("Contact number already exists!");

    try {
      await axios.post("http://localhost:5000/suppliers", { name, email, contactNo });
      setName(""); setEmail(""); setContactNo("");
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
    if (!emailRegex.test(editedEmail)) return alert("Invalid email format!");
    if (!mobileRegex.test(editedContactNo)) return alert("Contact number must be exactly 10 digits!");

    if (suppliers.some(s => s.name.toLowerCase() === editedName.toLowerCase() && s._id !== id)) return alert("Supplier name already exists!");
    if (suppliers.some(s => s.email === editedEmail && s._id !== id)) return alert("Email already exists!");
    if (suppliers.some(s => s.contactNo === editedContactNo && s._id !== id)) return alert("Contact number already exists!");

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
      <h2 className="title">Add Supplier</h2>
      <form
        onSubmit={handleAddSupplier}
        className="horizontal-form"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
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
        <button type="submit" className="save-btn">Add</button>
      </form>

      <h2 className="title">Supplier List</h2>
      <div className="table-container" ref={tableRef}>
        <table className="table-1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">No suppliers found</td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  {editMode === supplier._id ? (
                    <>
                      <td><input value={editedName} onChange={(e) => setEditedName(e.target.value)} /></td>
                      <td><input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} /></td>
                      <td><input value={editedContactNo} onChange={(e) => setEditedContactNo(e.target.value)} /></td>
                      <td>
                        <button className="save-btn" onClick={() => handleSaveEdit(supplier._id)}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditMode(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{supplier.name}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.contactNo}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditClick(supplier)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(supplier._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showScrollHint && <div className="scroll-hint-icon">↓</div>}
    </div>
  );
}

export default Supplier;
