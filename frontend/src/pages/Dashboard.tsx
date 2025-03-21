import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import { getDashboardData } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dashboardPage.css";

// Importations for ChartJS
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { fetchCategories } from "../api/categoryApi";
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Interfaces for Dashboard and Category data
interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  latestProducts: { name: string }[];
  topProducts: { name: string; stock: number }[];
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      setError(err.message || "Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data when token is available or when refreshed
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [token]);

  // Fetch all categories for additional display
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setAllCategories(categoriesData);
      } catch (err: any) {
        console.error("Error fetching categories for dashboard:", err.message);
      }
    };
    fetchAllCategories();
  }, []);

  // Configuration for the Doughnut chart: Products vs. Categories
  const doughnutData = {
    labels: ["Products", "Categories"],
    datasets: [
      {
        data: data ? [data.totalProducts, data.totalCategories] : [0, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  // Configuration for the Bar chart: Top 5 products with highest stock
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

  // New: Configuration for the Line chart: Product Trend (dummy data)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Product Trend",
        data: [10, 15, 20, 18, 25, 30],
        fill: false,
        borderColor: "rgba(63, 179, 237, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="flex justify-end mb-4">
        {/* Refresh button is rendered at the bottom as well */}
      </div>

      {user && user.name && (
        <h1 className="section-heading">Welcome, {user.name}!</h1>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <>
          <Alert
            message="In your dashboard page you can easily view your data & analytics, scroll down to see all the groups of information and their labels"
            type="info"
          />

          {/* Data Visualizations Section */}
          <div className="dashboard-summary-visual charts">
            <div className="charts-grid">
              <div className="chart-container">
                <h3 className="section-heading">Products vs. Categories</h3>
                <Doughnut className="doughnut" data={doughnutData} />
              </div>
              <div className="chart-container">
                <h3 className="section-heading">Top 5 Products with Highest Stock</h3>
                <Bar
                  className="bar"
                  data={barData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
              <div className="chart-container">
                <h3 className="section-heading">Product Trend</h3>
                <Line
                  className="line-chart"
                  data={lineData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Summary Grid Section */}
          <div className="dashboard-summary-grid">
            {/* General Data */}
            <div className="dashboard-summary-item general-data">
              <h3 className="section-heading">General Data</h3>
              <p>Total products: {data?.totalProducts}</p>
              <p>Total categories: {data?.totalCategories}</p>
            </div>

            {/* Last 5 Added Products */}
            <div className="dashboard-summary-item recent-products">
              <h3 className="section-heading">Last 5 Added Products</h3>
              <ul className="list-disc ml-6">
                {data?.latestProducts.map((prod, idx) => (
                  <li key={idx}>{prod.name}</li>
                ))}
              </ul>
            </div>

            {/* All Categories */}
            <div className="dashboard-summary-item all-categories">
              <h3 className="section-heading">All Categories</h3>
              {allCategories.length > 0 ? (
                <ul className="list-disc ml-6">
                  {allCategories.map((cat) => (
                    <li key={cat._id}>
                      <strong>{cat.name}</strong>:{" "}
                      {cat.description || "No description available"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setError("");
              fetchDashboardData();
            }}
            className="refresh-button"
          >
            Refresh Data
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;