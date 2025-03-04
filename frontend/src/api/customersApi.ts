import axiosInstance from "./axiosInstance";

// Fetch all customers
export const getCustomers = async () => {
  try {
    console.log("[DEBUG] Fetching customers...");
    const response = await axiosInstance.get("/customers");
    return response.data;
  } catch (error) {
    console.error("[ERROR] getCustomers:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new customer
export const addCustomer = async (customerData: { name: string; email: string; phone: string }) => {
  try {
    console.log("[DEBUG] Adding customer...");
    const response = await axiosInstance.post("/customers", customerData);
    return response.data;
  } catch (error) {
    console.error("[ERROR] addCustomer:", error.response?.data || error.message);
    throw error;
  }
};

// Update an existing customer
export const updateCustomer = async (
  customerId: number,
  updatedData: { name: string; email: string; phone: string }
) => {
  try {
    console.log("[DEBUG] Updating customer...");
    const response = await axiosInstance.put(`/customers/${customerId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("[ERROR] updateCustomer:", error.response?.data || error.message);
    throw error;
  }
};
