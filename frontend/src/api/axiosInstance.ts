import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptor para adjuntar el token de autenticación en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas de error (Si el token es inválido o esta expirado)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("[AUTH] Token inválido o expirado. Redirigiendo al login...");
      localStorage.removeItem("token");
      // Referencia a la ruta de autenticacion /auth
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

/**
 * Obtiene los datos del dashboard mediante Axios
 */
export const fetchDashboardData = async () => {
  try {
    console.log("[DEBUG] Llamando a /dashboard desde frontend...");
    const response = await axiosInstance.get("/dashboard");
    console.log("[DEBUG] Datos del Dashboard recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "[ERROR] No se pudieron obtener los datos del Dashboard:",
      error.response?.data || error.message
    );
    return null;
  }
};

export default axiosInstance;
