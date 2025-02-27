import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas de categorías requieren autenticación
router.use(authMiddleware);

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
