import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, PlusCircle, LayoutDashboard, Activity } from "lucide-react";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "nav-link active" : "nav-link";
    };

    return (
        <header className="navbar glass-panel">
            <div className="container nav-container">
                <Link to="/" className="brand">
                    <Package className="brand-icon" />
                    <span>OrderFlow</span>
                </Link>
                <nav className="nav-links">
                    <Link to="/" className={isActive("/")}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link to="/create" className={isActive("/create")}>
                        <PlusCircle size={18} />
                        New Order
                    </Link>
                    <Link to="/logs" className={isActive("/logs")}>
                        <Activity size={18} />
                        Logs
                    </Link>
                </nav>
            </div>
            
            <style>{`
                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    border-radius: 0;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    background: rgba(15, 23, 42, 0.8);
                }
                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: var(--spacing-sm);
                    padding-bottom: var(--spacing-sm);
                }
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-main);
                    text-decoration: none;
                    letter-spacing: 0.5px;
                }
                .brand-icon {
                    color: var(--accent-primary);
                }
                .nav-links {
                    display: flex;
                    gap: var(--spacing-md);
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-decoration: none;
                    color: var(--text-muted);
                    font-weight: 500;
                    padding: 8px 12px;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                }
                .nav-link:hover {
                    color: var(--text-main);
                    background-color: rgba(255, 255, 255, 0.05);
                }
                .nav-link.active {
                    color: var(--accent-primary);
                    background-color: rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </header>
    );
};

export default Navbar;
