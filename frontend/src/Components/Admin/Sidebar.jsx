import React from 'react'
import { Link } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>
                    <li>
                    <Link to="/product/new"><i className="fa fa-product-hunt"></i> Products</Link>
                    </li>
                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>
                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>
                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-star"></i> Reviews</Link>
                    </li>
                    <li>
                        <Link to="/admin/charts"><i className="fa fa-star"></i> Charts</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default Sidebar