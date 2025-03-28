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
import { fetchCategories } from "../api/categoryApi";
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
        setError("Error loading data");
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
    // Simple validation
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      setError("All fields are required");
      return;
    }
    try {
      // Convert price and stock to numbers
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
        setError("Error creating product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Error creating product");
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
      editProduct.price === undefined ||
      editProduct.stock === undefined
    ) {
      setError("All fields are required");
      return;
    }
    try {
      // Ensure price and stock are numbers
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
        setError("Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error updating product");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    try {
      const deleted = await deleteProduct(id);
      if (deleted) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        setError("Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Error deleting product");
    }
  };

  if (loading) return <Loader />;
  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <ProductsHeader />
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Product
        </Button>
      </div>
      {error && <Alert message={error} type="error" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <Card
            key={product._id}
            title={product.name}
            description={`Price: $${product.price} | Stock: ${product.stock}`}
          >
            <div className="flex justify-between mt-2">
              <Button onClick={() => handleEditClick(product)}>Edit</Button>
              <Button onClick={() => handleDelete(product._id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {/* Modal for creating a product */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Product"
      >
        <Form onSubmit={handleCreateSubmit}>
          <Input
            type="text"
            placeholder="Product name"
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
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Price"
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
            Save
          </Button>
        </Form>
      </Modal>
      {/* Modal for editing a product */}
      {isEditModalOpen && editProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditProduct(null);
          }}
          title="Edit Product"
        >
          <Form onSubmit={handleEditSubmit}>
            <Input
              type="text"
              placeholder="Product name"
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
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Price"
              value={String(editProduct.price)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditProduct({ ...editProduct, price: Number(e.target.value) })
              }
              name="editProductPrice"
            />
            <Input
              type="number"
              placeholder="Stock"
              value={String(editProduct.stock)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditProduct({ ...editProduct, stock: Number(e.target.value) })
              }
              name="editProductStock"
            />
            <Button type="submit" className="w-full mt-4">
              Save Changes
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
