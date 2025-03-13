/*
 Dashboard.tsx
*/
import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import { getDashboardData } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dashboardPage.css";

// Importaciones para ChartJS
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Actualización de la interfaz para incluir stock en topProducts
interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  latestProducts: { name: string }[];
  topProducts: { name: string; stock: number }[];
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  // Configuración del gráfico Doughnut: Productos vs. Categorías
  const doughnutData = {
    labels: ["Productos", "Categorías"],
    datasets: [
      {
        data: data ? [data.totalProducts, data.totalCategories] : [0, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  // Configuración del gráfico de Barras: Top 5 productos con mayor stock
  const barData = {
    labels: data ? data.topProducts.map((prod) => prod.name) : [],
    datasets: [
      {
        label: "Stock",
        data: data ? data.topProducts.map((prod) => prod.stock) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

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
          {/* Sección de gráficos */}
          <section className="data-visualization">
            <div className="chart-container">
              <h2>Productos vs. Categorías</h2>
              <Doughnut className="doughnut" data={doughnutData} />
            </div>
            <div className="chart-container">
              <h2>Top 5 productos con mayor stock</h2>
              <Bar
                className="bar"
                data={barData}
                options={{ responsive: true, plugins: { legend: { position: "top" } } }}
              />
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-xl font-bold">Últimos 5 productos agregados</h2>
            <ul className="list-disc ml-6">
              {data?.latestProducts.map((prod, idx) => (
                <li key={idx}>{prod.name}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
