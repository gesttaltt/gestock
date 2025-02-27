import axiosInstance from "./axiosInstance";

/**
 * Obtiene todas las categorías desde el backend.
 */
export const fetchCategories = async () => {
  try {
    console.log("[DEBUG] Llamando a /categories desde frontend...");
    const response = await axiosInstance.get("/categories");
    console.log("[DEBUG] Categorías recibidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudieron obtener categorías:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Crea una nueva categoría en la base de datos.
 */
export const createCategory = async (categoryData) => {
  try {
    console.log("[DEBUG] Creando categoría:", categoryData);
    const response = await axiosInstance.post("/categories", categoryData);
    console.log("[DEBUG] Categoría creada:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudo crear la categoría:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Actualiza una categoría existente.
 */
export const updateCategory = async (id, updatedData) => {
  try {
    console.log(`[DEBUG] Actualizando categoría con ID ${id}:`, updatedData);
    const response = await axiosInstance.put(`/categories/${id}`, updatedData);
    console.log("[DEBUG] Categoría actualizada:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudo actualizar la categoría:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Elimina una categoría de la base de datos.
 */
export const deleteCategory = async (id) => {
  try {
    console.log(`[DEBUG] Eliminando categoría con ID ${id}...`);
    await axiosInstance.delete(`/categories/${id}`);
    console.log("[DEBUG] Categoría eliminada con éxito.");
    return true;
  } catch (error) {
    console.error("[ERROR] No se pudo eliminar la categoría:", error.response?.data || error.message);
    return false;
  }
};
