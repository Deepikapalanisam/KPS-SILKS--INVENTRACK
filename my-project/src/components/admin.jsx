import { Outlet, Link, useLocation } from "react-router-dom";

function Admin() {
  const location = useLocation();

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
              const isActive = location.pathname === `/${path}`; // Only match the exact path
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 shadow-sm ${
                      isActive
                        ? "bg-white text-[#1976d2] font-semibold"
                        : "bg-[#2196f3] text-white hover:bg-white hover:text-[#1976d2]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isActive ? "text-[#1976d2]" : "text-white"
                      }`}
                    >
                      {icon}
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
