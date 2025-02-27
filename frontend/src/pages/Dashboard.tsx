import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import { getDashboardData } from "../api/authApi"; // Importante: se asume que esta función no requiere token como parámetro
import { useAuth } from "../contexts/AuthContext";

// Definición de la interfaz de los datos que retorna el backend
interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  latestProducts: {
    name: string;
    price: number;
    category: string;
    createdAt: string;
  }[];
  topProducts: {
    name: string;
    price: number;
    stock: number;
    category: string;
  }[];
}

const Dashboard = () => {
  // Obtenemos el token del contexto, aunque no lo pasamos explícitamente, ya que el interceptor lo utiliza
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamada al endpoint de dashboard; axiosInstance adjunta el token automáticamente
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("Usuario no autenticado");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <DashboardHeader />
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <>
          <Alert message="¡Bienvenido al Dashboard!" type="info" />
          <section className="mt-4">
            <h2 className="text-xl font-bold">Datos Generales</h2>
            <p>Total de productos: {data?.totalProducts}</p>
            <p>Total de categorías: {data?.totalCategories}</p>
          </section>
          <section className="mt-6">
            <h2 className="text-xl font-bold">Últimos 5 productos agregados</h2>
            <ul className="list-disc ml-6">
              {data?.latestProducts.map((prod, idx) => (
                <li key={idx}>
                  {prod.name} - ${prod.price} - {prod.category} -{" "}
                  {new Date(prod.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-xl font-bold">Top 5 productos con mayor stock</h2>
            <ul className="list-disc ml-6">
              {data?.topProducts.map((prod, idx) => (
                <li key={idx}>
                  {prod.name} - ${prod.price} - Stock: {prod.stock} - {prod.category}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
