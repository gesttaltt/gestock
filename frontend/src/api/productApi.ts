import axiosInstance from "./axiosInstance";

/**
 * Obtiene todos los productos desde el backend.
 */
export const fetchProducts = async () => {
  try {
    console.log("[DEBUG] Llamando a /products desde frontend...");
    const response = await axiosInstance.get("/products");
    console.log("[DEBUG] Productos recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudieron obtener productos:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Crea un nuevo producto en la base de datos.
 */
export const createProduct = async (productData) => {
  try {
    console.log("[DEBUG] Creando producto:", productData);
    const response = await axiosInstance.post("/products", productData);
    console.log("[DEBUG] Producto creado:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudo crear el producto:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Actualiza un producto existente.
 */
export const updateProduct = async (id, updatedData) => {
  try {
    console.log(`[DEBUG] Actualizando producto con ID ${id}:`, updatedData);
    const response = await axiosInstance.put(`/products/${id}`, updatedData);
    console.log("[DEBUG] Producto actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("[ERROR] No se pudo actualizar el producto:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Elimina un producto de la base de datos.
 */
export const deleteProduct = async (id) => {
  try {
    console.log(`[DEBUG] Eliminando producto con ID ${id}...`);
    await axiosInstance.delete(`/products/${id}`);
    console.log("[DEBUG] Producto eliminado con éxito.");
    return true;
  } catch (error) {
    console.error("[ERROR] No se pudo eliminar el producto:", error.response?.data || error.message);
    return false;
  }
};
