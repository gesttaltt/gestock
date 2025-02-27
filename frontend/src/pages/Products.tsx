import { useEffect, useState } from "react";
import ProductsHeader from "./ProductsHeader";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import { fetchCategories } from "../api/categoryApi"; // Obtiene categorías reales
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Categorías reales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para crear un nuevo producto
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "" });
  // Estado para editar producto
  const [editProduct, setEditProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Validación simple
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
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

  const handleEditClick = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editProduct.name || !editProduct.category || !editProduct.price || !editProduct.stock) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      const productToUpdate = {
        ...editProduct,
        price: Number(editProduct.price),
        stock: Number(editProduct.stock),
      };
      const updated = await updateProduct(editProduct._id, productToUpdate);
      if (updated) {
        setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto?");
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
        <Button onClick={() => setIsCreateModalOpen(true)}>Agregar Producto</Button>
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
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
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
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
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
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
            <select
              value={editProduct.category}
              onChange={(e) =>
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
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Stock"
              value={editProduct.stock}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
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
