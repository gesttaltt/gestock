import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {

  // Si ya se ha autenticado el usuario, saltar la verificación.
  if (req.user) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso denegado: Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Verifica que el token contenga datos válidos
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Acceso denegado: Token inválido" });
    }
    // Almacena los datos del usuario en la solicitud para uso posterior
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.error("[AuthMiddleware] Error de verificación del token:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Sesión expirada, por favor inicia sesión nuevamente" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido o mal formado" });
    }
    return res.status(500).json({ message: "Error en la autenticación" });
  }
};

/**
 * Middleware para restringir el acceso solo a administradores.
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: Se requieren permisos de administrador" });
  }
  next();
};

export default authMiddleware;
