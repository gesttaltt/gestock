import { Link } from "react-router-dom";
import "../styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Gestock</h1>
        <ul className="mt-4 space-y-2">
          <li>
            <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" className="block p-2 hover:bg-gray-700 rounded">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/categories" className="block p-2 hover:bg-gray-700 rounded">
              Categorías
            </Link>
          </li>
          <li>
            <Link to="/profile" className="block p-2 hover:bg-gray-700 rounded">
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/auth" className="block p-2 hover:bg-gray-700 rounded">
              Iniciar Sesión / Registro
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
