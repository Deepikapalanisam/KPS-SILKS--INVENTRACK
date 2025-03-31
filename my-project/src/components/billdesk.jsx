import { Outlet, Link } from "react-router-dom";

function Billdesk() {
    return (
        <div>
            <h2>This is Billdesk</h2>
            <nav>
                <ul>
                    <li><Link to="stock">Stock</Link></li>
                    <li><Link to="billing">Billing</Link></li>
                    <li><Link to="criticalstock">Critical Stock</Link></li>
                    <li><Link to="purchase">Purchase</Link></li>
                </ul>
            </nav>
            <Outlet />  {/* Ensures nested components are rendered */}
        </div>
    );
}

export default Billdesk;
