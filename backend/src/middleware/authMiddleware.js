import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // If the user is already authenticated, skip verification
  if (req.user) {
    console.log("[AuthMiddleware] User already authenticated:", req.user);
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("[AuthMiddleware] Missing or malformed Authorization header:", authHeader);
    return res.status(401).json({ message: "Acceso denegado: Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id || !decoded.role) {
      console.error("[AuthMiddleware] Decoded token missing required fields:", decoded);
      return res.status(401).json({ message: "Acceso denegado: Token inválido" });
    }
    // Save user info to the request
    req.user = { id: decoded.id, role: decoded.role };
    console.log("[AuthMiddleware] Token verified successfully for user:", req.user);
    next();
  } catch (error) {
    console.error("[AuthMiddleware] Error verifying token:", error.message);
    console.error(error.stack);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Sesión expirada, por favor inicia sesión nuevamente" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido o mal formado" });
    }
    return res.status(500).json({ message: "Error en la autenticación", error: error.message });
  }
};

/**
 * Middleware para restringir el acceso solo a administradores.
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    console.error("[AuthMiddleware] Admin access required. Current user:", req.user);
    return res.status(403).json({ message: "Acceso denegado: Se requieren permisos de administrador" });
  }
  console.log("[AuthMiddleware] Admin access granted for user:", req.user);
  next();
};

export default authMiddleware;
