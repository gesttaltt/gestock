/*
 Categories.tsx
*/
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import CategoriesHeader from "./CategoriesHeader";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // State for creating a new category
  const [newCategory, setNewCategory] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  // State for the category being edited
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load categories from the backend
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

  // Handler for creating a new category
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!newCategory.name.trim()) {
      setError("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const createdCat = await createCategory(newCategory);
      if (createdCat) {
        setCategories([...categories, createdCat]);
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

  // Open the edit modal with the selected category's data
  const handleEditClick = (category: Category): void => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
    setError(null);
  };

  // Handler for updating a category
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!editingCategory || !editingCategory.name.trim()) {
      setError("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const updated = await updateCategory(editingCategory._id, editingCategory);
      if (updated) {
        setCategories(
          categories.map((cat) => (cat._id === updated._id ? updated : cat))
        );
        setEditingCategory(null);
        setIsEditModalOpen(false);
      } else {
        setError("Error al actualizar la categoría");
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      setError("Error al actualizar la categoría");
    }
  };

  // Handler for deleting a category
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;
    try {
      const result = await deleteCategory(id);
      if (result) {
        setCategories(categories.filter((cat) => cat._id !== id));
      } else {
        setError("Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setError("Error al eliminar la categoría");
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
          >
            <div className="flex justify-end mt-2">
              <Button onClick={() => handleEditClick(category)}>Editar</Button>
              <Button
                onClick={() => handleDelete(category._id)}
                className="ml-2"
                type="button"
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for adding a new category */}
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            name="categoryName"
          />
          <Input
            type="text"
            placeholder="Descripción"
            value={newCategory.description}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            name="categoryDescription"
          />
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </Form>
      </Modal>

      {/* Modal for editing an existing category */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Categoría"
      >
        <Form onSubmit={handleEditSubmit}>
          <Input
            type="text"
            placeholder="Nombre de la categoría"
            value={editingCategory?.name || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEditingCategory({
                ...editingCategory!,
                name: e.target.value,
              })
            }
            name="editCategoryName"
          />
          <Input
            type="text"
            placeholder="Descripción"
            value={editingCategory?.description || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEditingCategory({
                ...editingCategory!,
                description: e.target.value,
              })
            }
            name="editCategoryDescription"
          />
          <Button type="submit" className="w-full">
            Actualizar
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
