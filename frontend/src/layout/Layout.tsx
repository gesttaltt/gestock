/*
 Layout.tsx
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [inventarioOpen, setInventarioOpen] = useState<boolean>(false);
  const [clientesOpen, setClientesOpen] = useState<boolean>(false);
  const [cuentaOpen, setCuentaOpen] = useState<boolean>(false);

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <h1 className="layout-nav-heading">Gestock</h1>
        <ul className="layout-nav-list">
          <li className="layout-nav-item">
            <Link to="/" className="layout-dashboard-link">
              <img
                src="/gestock-favicon.svg"
                alt="Gestock Logo"
                className="layout-dashboard-img"
              />
              <span className="layout-dashboard-text">Dashboard</span>
            </Link>
          </li>
          <li className="layout-nav-item">
            <button
              onClick={() => setInventarioOpen(!inventarioOpen)}
              className="layout-nav-button"
            >
              Inventory
            </button>
            {inventarioOpen && (
              <ul className="layout-sub-nav-list">
                <li className="layout-sub-nav-item">
                  <Link to="/products" className="layout-nav-link">
                    Products
                  </Link>
                </li>
                <li className="layout-sub-nav-item">
                  <Link to="/categories" className="layout-nav-link">
                    Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="layout-nav-item">
            <button
              onClick={() => setClientesOpen(!clientesOpen)}
              className="layout-nav-button"
            >
              Customers
            </button>
            {clientesOpen && (
              <ul className="layout-sub-nav-list">
                <li className="layout-sub-nav-item">
                  <Link to="/clientes" className="layout-nav-link">
                    Customers Management
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="layout-nav-item">
            <button
              onClick={() => setCuentaOpen(!cuentaOpen)}
              className="layout-nav-button"
            >
              Account settings
            </button>
            {cuentaOpen && (
              <ul className="layout-sub-nav-list">
                <li className="layout-sub-nav-item">
                  <Link to="/profile" className="layout-nav-link">
                    Profile
                  </Link>
                </li>
                <li className="layout-sub-nav-item">
                  <Link to="/auth" className="layout-nav-link">
                    Log In / Register
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
