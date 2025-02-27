import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

/**
 * Obtains every product of the authenticated user
 * including the category information that is associated with
 */
export const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    // Obtain only the products that belong to the authenticated user
    const products = await Product.find({ user: userId }).populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error("[getProducts] Error:", error.message);
    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

/**
 * Creates a new product in database that belongs the authenticated user
 */
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category, price, stock } = req.body;

    // Fields validation (name, category, price and stock)
    if (!name || !category || price == null || stock == null) {
      return res.status(400).json({
        message: "Todos los campos (name, category, price, stock) son obligatorios",
      });
    }


    // Category ObjectID from mongoDB valid format verification
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "El ID de la categoría no es válido" });
    }

    // Verifies that the category exists and is from the authenticated user
    const existingCategory = await Category.findOne({ _id: category, user: userId });
    if (!existingCategory) {
      return res.status(404).json({ message: "La categoría especificada no existe o no pertenece al usuario" });
    }

    // Verifies that a same name product already exists in the same category from the user
    const existingProduct = await Product.findOne({ name, category, user: userId });
    if (existingProduct) {
      return res.status(400).json({ message: "Ya existe un producto con este nombre en la misma categoría" });
    }

    // Create the product and assign it to the authenticated user
    const newProduct = new Product({ name, category, price, stock, user: userId });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("[createProduct] Error:", error.message);
    res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

/**
 * Updates an existent product, verifying if it belongs to the authenticated user
 */
export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Validates the ObjectID from the product
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID del producto no es válido" });
    }

    // Verifies if the product exist and belong to the user
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (product.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado para actualizar este producto" });
    }

    //If the category gets updated, verifies if the new category exist and belong to the user
    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({ message: "El ID de la nueva categoría no es válido" });
      }
      const categoryCheck = await Category.findOne({ _id: req.body.category, user: userId });
      if (!categoryCheck) {
        return res.status(404).json({ message: "La nueva categoría especificada no existe o no pertenece al usuario" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("[updateProduct] Error:", error.message);
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

/**
 * The function deletes a product from the database while verifying whether it belongs to the authenticated user or not.
 */
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID del producto no es válido" });
    }

    // Verifies that the product exist and belong to the user
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (product.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado para eliminar este producto" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("[deleteProduct] Error:", error.message);
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};
