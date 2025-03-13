import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Esta ruta está protegida: solo los usuarios autenticados con rol "admin" pueden acceder
router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    console.log(`[DashboardRoutes] Usuario ${req.user.id} accediendo al dashboard`);
    await getDashboardData(req, res);
  } catch (error) {
    console.error("[DashboardRoutes] Error:", error.message);
    next(error);
  }
});

export default router;
