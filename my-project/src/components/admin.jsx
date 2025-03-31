import { Outlet, Link } from "react-router-dom";

function Admin() {
    return (
        <div>
            <h2>This is Admin</h2>
            <nav>
                <ul>
                    <li><Link to="stock">Stock</Link></li>
                    <li><Link to="adduser">Add User</Link></li>
                    <li><Link to="billing">Billing</Link></li>
                    <li><Link to="criticalstock">Critical Stock</Link></li>
                    <li><Link to="purchase">Purchase</Link></li>
                    <li><Link to="suppliers">Suppliers</Link></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default Admin;
