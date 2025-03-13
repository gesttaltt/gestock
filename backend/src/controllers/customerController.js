import Customer from "../models/Customer.js"; // Adjust according to your model path

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // Check for duplicate customer by email
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "Customer with this email already exists" });
    }
    const customer = new Customer({ name, email, phone });
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    // Optionally, you can check for duplicates here if needed
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error updating customer" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
};
