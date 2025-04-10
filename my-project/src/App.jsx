import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./components/adduser";
import Admin from "./components/admin";
import Billing from "./components/billing";
import CriticalStock from "./components/criticalstock";
import Login from "./components/login";
import Stock from "./components/stock";
import Suppliers from "./components/suppliers";
import Purchase from "./components/purchase";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Section */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Stock />} />
          <Route path="stock" element={<Stock />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="billing" element={<Billing />} />
          <Route path="criticalstock" element={<CriticalStock />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="suppliers" element={<Suppliers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
