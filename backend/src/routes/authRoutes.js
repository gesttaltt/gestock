import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas para autenticación
router.post("/register", registerUser);
router.post("/login", loginUser);

// A partir de aquí, todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
