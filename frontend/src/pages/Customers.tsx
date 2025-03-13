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

// Define la interfaz para Customer
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

  // Obtener clientes del backend al montar el componente
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError("Error al cargar los clientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomersData();
  }, []);

  // Manejador de inputs para el formulario de agregar cliente
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Función para agregar un nuevo cliente
  const handleAddCustomer = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    // Verificar duplicado por email
    const duplicate = customers.find((c) => c.email === newCustomer.email);
    if (duplicate) {
      setError("Ya existe un cliente con este correo electrónico.");
      return;
    }
    try {
      const addedCustomer = await addCustomer(newCustomer);
      setCustomers([...customers, addedCustomer]);
      setNewCustomer({ name: "", email: "", phone: "" });
      setError("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError("Error al agregar cliente.");
    }
  };

  // Abrir modal para editar cliente
  const openEditModal = (customer: Customer): void => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Función para actualizar cliente
  const handleUpdateCustomer = async (updatedCustomer: Customer): Promise<void> => {
    try {
      const updatedData = await updateCustomer(updatedCustomer.id, updatedCustomer);
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedData.id ? updatedData : c))
      );
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } catch (err: any) {
      setError("Error al actualizar cliente.");
    }
  };

  return (
    <div className="customers-container p-6 bg-gray-800 min-h-screen text-white">
      <div className="customers-card max-w-5xl mx-auto">
        <h1 className="customers-header text-3xl font-bold mb-4">
          Administración de Clientes
        </h1>
        {error && <Alert message={error} type="error" />}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Grid de tarjetas para cada cliente */}
            <div className="customers-list">
              {customers.map((customer) => (
                <div key={customer.id} className="sortable-customer-card">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm">{customer.email}</p>
                  <p className="text-sm">{customer.phone}</p>
                  <Button onClick={() => openEditModal(customer)} className="mt-2">
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Botón para abrir modal de agregar nuevo cliente */}
      <div className="mt-8 flex justify-center">
        <Button onClick={() => setIsAddModalOpen(true)}>Agregar Nuevo Cliente</Button>
      </div>

      {/* Modal para agregar un nuevo cliente */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Agregar Nuevo Cliente"
        >
          <form onSubmit={handleAddCustomer} className="modal-form space-y-4 p-4">
            <Input
              label="Nombre"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre"
            />
            <Input
              label="Correo Electrónico"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              placeholder="Ingrese el correo electrónico"
            />
            <Input
              label="Teléfono"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              placeholder="Ingrese el teléfono"
            />
            <div className="flex justify-end gap-4">
              <Button type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agregar</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal para editar cliente */}
      {isEditModalOpen && selectedCustomer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Cliente"
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
      <h2 className="text-xl font-bold text-gray-800">Editar Cliente</h2>
      <Input
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        label="Correo Electrónico"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <div className="flex justify-end gap-4">
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default CustomersPage;
