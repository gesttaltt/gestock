import express from "express";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all customer routes
router.use(authMiddleware);

router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
