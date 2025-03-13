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
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Gestock</h1>
        <ul className="nav-list mt-4">
          <li>
            <Link to="/" className="dashboard-link">
              <img src="/gestock-favicon.svg" alt="Gestock Logo" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setInventarioOpen(!inventarioOpen)}
              className="w-full text-left block p-2 hover:bg-gray-700 rounded focus:outline-none"
            >
              Inventario
            </button>
            {inventarioOpen && (
              <ul className="mt-2 ml-4 space-y-1">
                <li>
                  <Link
                    to="/products"
                    className="block p-2 hover:bg-gray-700 rounded"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="block p-2 hover:bg-gray-700 rounded"
                  >
                    Categorías
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setClientesOpen(!clientesOpen)}
              className="w-full text-left block p-2 hover:bg-gray-700 rounded focus:outline-none"
            >
              Clientes
            </button>
            {clientesOpen && (
              <ul className="mt-2 ml-4 space-y-1">
                <li>
                  <Link
                    to="/clientes"
                    className="block p-2 hover:bg-gray-700 rounded"
                  >
                    Gestión de Clientes
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setCuentaOpen(!cuentaOpen)}
              className="w-full text-left block p-2 hover:bg-gray-700 rounded focus:outline-none"
            >
              Cuenta
            </button>
            {cuentaOpen && (
              <ul className="mt-2 ml-4 space-y-1">
                <li>
                  <Link
                    to="/profile"
                    className="block p-2 hover:bg-gray-700 rounded"
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    className="block p-2 hover:bg-gray-700 rounded"
                  >
                    Iniciar Sesión / Registro
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
