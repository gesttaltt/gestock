/*
 Customers.tsx
*/
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import "../styles/customersPage.css";
import { getCustomers, addCustomer, updateCustomer } from "../api/customersApi";

// Define the interface for Customer
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch customers from the backend when the component mounts
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError("Error loading customers.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomersData();
  }, []);

  // Handler for inputs in the add customer form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Function to add a new customer
  const handleAddCustomer = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError("Please fill in all fields.");
      return;
    }
    // Check for duplicate by email
    const duplicate = customers.find((c) => c.email === newCustomer.email);
    if (duplicate) {
      setError("A customer with this email already exists.");
      return;
    }
    try {
      const addedCustomer = await addCustomer(newCustomer);
      setCustomers([...customers, addedCustomer]);
      setNewCustomer({ name: "", email: "", phone: "" });
      setError("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError("Error adding customer.");
    }
  };

  // Open modal to edit customer
  const openEditModal = (customer: Customer): void => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Function to update customer
  const handleUpdateCustomer = async (updatedCustomer: Customer): Promise<void> => {
    try {
      const updatedData = await updateCustomer(updatedCustomer.id, updatedCustomer);
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedData.id ? updatedData : c))
      );
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } catch (err: any) {
      setError("Error updating customer.");
    }
  };

  return (
    <div className="customers-container p-6 bg-gray-800 min-h-screen text-white">
      <div className="customers-card max-w-5xl mx-auto">
        <h1 className="customers-header text-3xl font-bold mb-4">
          Customer Management
        </h1>
        {error && <Alert message={error} type="error" />}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Grid of cards for each customer */}
            <div className="customers-list">
              {customers.map((customer) => (
                <div key={customer.id} className="sortable-customer-card">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm">{customer.email}</p>
                  <p className="text-sm">{customer.phone}</p>
                  <Button onClick={() => openEditModal(customer)} className="mt-2">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Button to open add new customer modal */}
      <div className="mt-8 flex justify-center">
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Customer</Button>
      </div>

      {/* Modal for adding a new customer */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Customer"
        >
          <form onSubmit={handleAddCustomer} className="modal-form space-y-4 p-4">
            <Input
              label="Name"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Enter name"
            />
            <Input
              label="Email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
            <Input
              label="Phone"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            <div className="flex justify-end gap-4">
              <Button type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for editing customer */}
      {isEditModalOpen && selectedCustomer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Customer"
        >
          <CustomerEditForm
            customer={selectedCustomer}
            onUpdate={handleUpdateCustomer}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

interface CustomerEditFormProps {
  customer: Customer;
  onUpdate: (updatedCustomer: Customer) => void;
  onCancel: () => void;
}

const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  customer,
  onUpdate,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Customer>(customer);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form space-y-4 p-4">
      <h2 className="text-xl font-bold text-gray-800">Edit Customer</h2>
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <div className="flex justify-end gap-4">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default CustomersPage;
