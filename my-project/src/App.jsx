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
    <Login></Login>
  );
}

export default App;
