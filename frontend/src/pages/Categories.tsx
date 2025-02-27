import CategoriesHeader from "./CategoriesHeader";
import { useEffect, useState } from "react";
import { fetchCategories, createCategory } from "../api/categoryApi"; // Se importa createCategory
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para la nueva categoría
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Cargar categorías desde el backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Handler de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación simple
    if (!newCategory.name) {
      setError("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      // Llamada a la API para crear la nueva categoría
      const createdCat = await createCategory(newCategory);
      if (createdCat) {
        // Actualizar el estado local agregando la nueva categoría
        setCategories([...categories, createdCat]);
        // Reiniciar el formulario
        setNewCategory({ name: "", description: "" });
        setIsModalOpen(false);
      } else {
        setError("Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      setError("Error al crear la categoría");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <CategoriesHeader />
      <Button onClick={() => setIsModalOpen(true)} className="mt-4">
        Agregar Categoría
      </Button>

      {loading && <Loader />}
      {error && <Alert message={error} type="error" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {categories.map((category) => (
          <Card
            key={category._id}
            title={category.name}
            description={category.description}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Nueva Categoría"
      >
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nombre de la categoría"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Descripción"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
