import Product from "../models/Product.js";
import Category from "../models/Category.js";

/**
 * Obtains general data for the authenticated user
 */
export const getDashboardData = async (req, res) => {
  try {
    // User authentication verification
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No autorizado: Usuario no autenticado" });
    }
    const userId = req.user.id;

    // Products and categories counting for the user
    const totalProducts = await Product.countDocuments({ user: userId });
    const totalCategories = await Category.countDocuments({ user: userId });

    //Last 5 products (added by the user)
    const latestProducts = await Product.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name price category createdAt");

    // Top 5 products with more stock (from the user)
    const topProducts = await Product.find({ user: userId })
      .sort({ stock: -1 })
      .limit(5)
      .select("name price stock category");

    res.status(200).json({
      totalProducts,
      totalCategories,
      latestProducts,
      topProducts,
    });
  } catch (error) {
    console.error("[getDashboardData] Error:", error.message);
    res.status(500).json({
      message: "Error al obtener datos del dashboard",
      error: error.message,
    });
  }
};
