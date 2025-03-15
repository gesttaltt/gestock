import axiosInstance from "./axiosInstance";

/**
 * Registra un nuevo usuario en el sistema.
 */
export const registerUser = async (userData: any): Promise<any | null> => {
  try {
    console.log("[DEBUG] Registrando usuario...");
    const response = await axiosInstance.post("/auth/register", userData);
    console.log("[DEBUG] Usuario registrado correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] registerUser:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Inicia sesión y obtiene un token de autenticación.
 */
export const loginUser = async (credentials: any): Promise<any | null> => {
  try {
    console.log("[DEBUG] Iniciando sesión...");
    const response = await axiosInstance.post("/auth/login", credentials);
    const token = response.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      console.log("[DEBUG] Token guardado en localStorage.");
    }
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] loginUser:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Obtiene el perfil del usuario autenticado.
 */
export const getProfile = async (): Promise<any | null> => {
  try {
    console.log("[DEBUG] Obteniendo perfil del usuario...");
    const response = await axiosInstance.get("/auth/profile");
    console.log("[DEBUG] Perfil obtenido:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] getProfile:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Actualiza la información del usuario autenticado.
 */
export const updateProfile = async (updatedData: any): Promise<any | null> => {
  try {
    console.log("[DEBUG] Actualizando perfil del usuario...");
    const response = await axiosInstance.put("/auth/profile", updatedData);
    console.log("[DEBUG] Perfil actualizado correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] updateProfile:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Obtiene los datos del dashboard.
 */
export const getDashboardData = async (): Promise<any | null> => {
  try {
    console.log("[DEBUG] Obteniendo datos del dashboard...");
    const response = await axiosInstance.get("/dashboard");
    console.log("[DEBUG] Datos del dashboard obtenidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] getDashboardData:", error.response?.data || error.message);
    return null;
  }
};
