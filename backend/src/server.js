import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import apiRoutes from "./routes/apiRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

// Verify necessary environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: La variable MONGO_URI no está definida en el archivo .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: La variable JWT_SECRET no está definida en el archivo .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
// Normalize the CLIENT_URL (remove trailing slash) to ensure CORS matches exactly
const CLIENT_URL = (process.env.CLIENT_URL || "https://gestock-orpin.vercel.app").replace(/\/$/, "");
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestockDB";

// Middleware to parse JSON
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} request to ${req.url} - Body:`, req.body);
  next();
});

// Secure CORS configuration with origin normalization
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      // Normalize the incoming origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (normalizedOrigin === CLIENT_URL) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Custom header middleware for iframe embedding (allow only your portfolio domain)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://gesttaltt.github.io"
  );
  res.setHeader(
    "X-Frame-Options",
    "ALLOW-FROM https://gesttaltt.github.io"
  );
  next();
});

// Function to connect to MongoDB with retries
const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected Successfully");
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.error(error.stack);
      retries--;
      console.log(`Reintentando conexión... Intentos restantes: ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("❌ No se pudo conectar a MongoDB después de múltiples intentos. Saliendo...");
  process.exit(1);
};
connectDB();

// Use authMiddleware on protected routes, allowing public access to /api/auth endpoints
app.use(
  "/api",
  (req, res, next) => {
    if (req.path.startsWith("/auth")) {
      return next();
    }
    return authMiddleware(req, res, next);
  },
  apiRoutes
);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Global Error Handler:", err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} - Accessible at ${CLIENT_URL}`);
});
