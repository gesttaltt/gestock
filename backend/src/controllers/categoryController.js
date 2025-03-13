import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import User from "../models/User.js";

dotenv.config();

/**
 * Obtiene todas las categorías del usuario autenticado.
 */
export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({ user: userId });
    res.status(200).json(categories);
  } catch (error) {
    console.error("[getCategories] Error:", error.message);
    res.status(500).json({
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};

/**
 * Crea una nueva categoría para el usuario autenticado.
 */
export const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    // Validación: el campo 'name' es obligatorio
    if (!name) {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }

    // Se trimea el nombre y la descripción
    const trimmedName = name.trim();
    const trimmedDescription = description ? description.trim() : "";

    // Verificar que no exista una categoría con el mismo nombre para este usuario
    const existingCategory = await Category.findOne({ name: trimmedName, user: userId });
    if (existingCategory) {
      return res.status(400).json({ message: "La categoría ya existe para este usuario" });
    }

    // Crear la categoría asignándole el usuario autenticado
    const newCategory = new Category({ name: trimmedName, description: trimmedDescription, user: userId });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("[createCategory] Error:", error.message);
    res.status(500).json({
      message: "Error al crear categoría",
      error: error.message,
    });
  }
};

/**
 * Actualiza los datos de una categoría existente, verificando que pertenezca al usuario autenticado.
 */
export const updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID de la categoría no es válido" });
    }

    // Verificar que la categoría exista y pertenezca al usuario
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    if (category.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado para actualizar esta categoría" });
    }

    // Si se actualiza el nombre, se trimea y se verifica duplicado para este usuario
    if (req.body.name) {
      const trimmedName = req.body.name.trim();
      const duplicate = await Category.findOne({
        name: trimmedName,
        user: userId,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({ message: "Ya existe una categoría con ese nombre para este usuario" });
      }
      category.name = trimmedName;
    }
    if (req.body.description !== undefined) {
      category.description = req.body.description.trim();
    }

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("[updateCategory] Error:", error.message);
    res.status(500).json({
      message: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

/**
 * Elimina una categoría del usuario autenticado.
 */
export const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID de la categoría no es válido" });
    }

    // Verificar que la categoría exista y pertenezca al usuario
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    if (category.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado para eliminar esta categoría" });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("[deleteCategory] Error:", error.message);
    res.status(500).json({
      message: "Error al eliminar categoría",
      error: error.message,
    });
  }
};
