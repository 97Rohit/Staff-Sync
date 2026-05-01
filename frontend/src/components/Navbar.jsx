import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">🔄</div>
                <h1>StaffSync</h1>
            </div>

            <ul className="nav-menu">
                <li>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">🏠</span>
                        Overview
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">👥</span>
                        Team
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">✓</span>
                        Check-ins
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
