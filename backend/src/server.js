import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import apiRoutes from "./routes/apiRoutes.js";

dotenv.config();

// Verificar variables de entorno necesarias
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
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestockDB";

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logs para debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} request to ${req.url} - Body:`, req.body);
  next();
});

// Configuración de CORS segura
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Función para conectar a MongoDB con reintentos
const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      console.log("✅ MongoDB Connected Successfully");
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      retries--;
      console.log(`Reintentando conexión... Intentos restantes: ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("❌ No se pudo conectar a MongoDB después de múltiples intentos. Saliendo...");
  process.exit(1);
};
connectDB();

// Rutas principales: la ruta global para la API ya está configurada aquí
app.use("/api", apiRoutes);

// Middleware de manejo global de errores
app.use((err, req, res, next) => {
  console.error("⚠️ Global Error Handler:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} - Accessible at ${CLIENT_URL}`);
});
