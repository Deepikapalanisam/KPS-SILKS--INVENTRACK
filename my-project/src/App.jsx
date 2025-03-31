import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Adduser from "./components/adduser";
import Admin from "./components/admin";
import Billdesk from "./components/billdesk";
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
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Stock />} />
          <Route path="stock" element={<Stock />} />
          <Route path="adduser" element={<Adduser />} />
          <Route path="billing" element={<Billing />} />
          <Route path="criticalstock" element={<CriticalStock />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="suppliers" element={<Suppliers />} />
        </Route>
        <Route path="/billdesk" element={<Billdesk />}>
          <Route path="billing" element={<Billing />} />
          <Route path="stock" element={<Stock />} />
          <Route path="criticalstock" element={<CriticalStock />} />
          <Route path="purchase" element={<Purchase />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
