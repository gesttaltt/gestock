/*
 Products.tsx
*/
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import ProductsHeader from "./ProductsHeader";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { fetchCategories } from "../api/categoryApi"; // Obtiene categorías reales
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";

// Define interfaces for Product and Category
interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for creating a new product (all values as strings initially)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  // State for editing a product
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    // Validación simple: chequea que ningún campo esté vacío
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      // Convertir price y stock a números
      const productToCreate = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      };
      const createdProduct = await createProduct(productToCreate);
      if (createdProduct) {
        setProducts([...products, createdProduct]);
        setNewProduct({ name: "", category: "", price: "", stock: "" });
        setIsCreateModalOpen(false);
      } else {
        setError("Error al crear el producto");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      setError("Error al crear el producto");
    }
  };

  const handleEditClick = (product: Product): void => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (
      !editProduct ||
      !editProduct.name ||
      !editProduct.category ||
      !editProduct.price ||
      !editProduct.stock
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      // Asegurarse de que price y stock sean números
      const productToUpdate = {
        ...editProduct,
        price: Number(editProduct.price),
        stock: Number(editProduct.stock),
      };
      const updated = await updateProduct(editProduct._id, productToUpdate);
      if (updated) {
        setProducts(
          products.map((p) => (p._id === updated._id ? updated : p))
        );
        setIsEditModalOpen(false);
        setEditProduct(null);
      } else {
        setError("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setError("Error al actualizar el producto");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (!confirmDelete) return;
    try {
      const deleted = await deleteProduct(id);
      if (deleted) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        setError("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError("Error al eliminar el producto");
    }
  };

  if (loading) return <Loader />;
  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <ProductsHeader />
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Agregar Producto
        </Button>
      </div>
      {error && <Alert message={error} type="error" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <Card
            key={product._id}
            title={product.name}
            description={`Precio: $${product.price} | Stock: ${product.stock}`}
          >
            <div className="flex justify-between mt-2">
              <Button onClick={() => handleEditClick(product)}>Editar</Button>
              <Button onClick={() => handleDelete(product._id)}>Eliminar</Button>
            </div>
          </Card>
        ))}
      </div>
      {/* Modal para crear producto */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Agregar Nuevo Producto"
      >
        <Form onSubmit={handleCreateSubmit}>
          <Input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            name="productName"
          />
          <select
            value={newProduct.category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="p-2 m-2 bg-gray-800 text-white rounded"
          >
            <option value="" className="p-2 m-2 gap-4">
              Seleccione una categoría
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Precio"
            value={newProduct.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            name="productPrice"
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            name="productStock"
          />
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </Form>
      </Modal>
      {/* Modal para editar producto */}
      {isEditModalOpen && editProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditProduct(null);
          }}
          title="Editar Producto"
        >
          <Form onSubmit={handleEditSubmit}>
            <Input
              type="text"
              placeholder="Nombre del producto"
              value={editProduct.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              name="editProductName"
            />
            <select
              value={editProduct.category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setEditProduct({ ...editProduct, category: e.target.value })
              }
              className="p-2 bg-gray-800 text-white rounded"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Precio"
              value={String(editProduct.price)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              name="editProductPrice"
            />
            <Input
              type="number"
              placeholder="Stock"
              value={String(editProduct.stock)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
              name="editProductStock"
            />
            <Button type="submit" className="w-full mt-4">
              Guardar Cambios
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
