import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();  // Track current location to manage active state
  const [activeLink, setActiveLink] = useState("");

  // Set active link based on the current path
  useEffect(() => {
    setActiveLink(location.pathname.split("/").pop());  // Set the active link based on the current route
  }, [location]);

  useEffect(() => {
    // If the user is not logged in, navigate to the login page and prevent back navigation
    if (!localStorage.getItem("loggedIn")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    // Show confirmation message before logging out
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Clear login state and redirect to login page
      localStorage.removeItem("loggedIn");
      navigate("/", { replace: true });
    }
  };

  const navItems = [
    { label: "Billing", path: "billing", icon: "receipt_long" },
    { label: "Stock", path: "stock", icon: "inventory_2" },
    { label: "Purchase", path: "purchase", icon: "shopping_cart" },
    { label: "Critical Stock", path: "criticalstock", icon: "production_quantity_limits" },
    { label: "Suppliers", path: "suppliers", icon: "local_shipping" },
    { label: "Add User", path: "adduser", icon: "person_add" },
  ];

  return (
    <div className="flex min-h-screen font-poppins bg-[#f4f6f8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1976d2] text-white fixed top-0 left-0 bottom-0 p-6 shadow-lg z-10">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-wide">
          KPS Silks
        </h2>
        <nav>
          <ul className="space-y-3">
            {navItems.map(({ label, path, icon }) => {
              const isActive = activeLink === path;  // Check if the link is active
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 shadow-sm 
                      ${isActive ? "bg-white text-[#1976d2]" : "bg-[#2196f3] text-white"} 
                      hover:bg-white hover:text-[#1976d2]`}
                    onClick={() => setActiveLink(path)} // Set the active link on click
                  >
                    <span className={`material-symbols-outlined text-xl ${isActive ? "text-[#1976d2]" : "text-white"}`}>
                      {icon}
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="flex items-center gap-4 px-5 py-3 mt-8 rounded-lg bg-[#f44336] text-white hover:bg-[#d32f2f] w-full transition-all duration-300 shadow-sm"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-xl">exit_to_app</span>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
