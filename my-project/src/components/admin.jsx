import { Outlet, Link } from "react-router-dom";

function Admin() {
  return (
    <div className="flex min-h-screen font-poppins">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1e3f] text-white fixed top-0 left-0 bottom-0 p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-10 text-center text-white tracking-wide">
          KPS Silks
        </h2>
        <nav>
          <ul className="space-y-4 text-base">
            {[
              { label: "Billing", path: "billing" },
              { label: "Stock", path: "stock" },
              { label: "Purchase", path: "purchase" },
              { label: "Critical Stock", path: "criticalstock" },
              { label: "Suppliers", path: "suppliers" },
              { label: "Add User", path: "adduser" },
            ].map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="block px-5 py-2 rounded-lg bg-[#122b55] hover:bg-white hover:text-[#0b1e3f] transition duration-300 font-medium shadow-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
