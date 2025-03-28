// File: /backend/src/controllers/userController.js

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword } from "../utils/passwordHasher.js"; // <-- New import, not directly used

dotenv.config({ path: "./.env" });

/**
 * Register a new user in the database
 * Relies on the User model's pre-save hook to hash the password
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido" });
    }

    // Password length validation (Min: 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verifies if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }

    // User creation in MongoDB; the pre-save hook in User.js will hash the password
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "user", // por defecto, asigna rol "user"
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("[registerUser] Error:", error.message);
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

/**
 * Logs in by validating credentials and returning a JWT token
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email and password validations
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido" });
    }

    // Finds user by email and includes the password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Compare password using the model's method (handles bcrypt/argon2/scrypt)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // JWT secret verification
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET no está definido en el entorno");
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    // Generate JWT token (1 hour expiration)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[loginUser] Error:", error.message);
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * Obtains the authenticated user's profile
 * Assumes that the authentication middleware assigns userID in req.user
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("[getProfile] Error:", error.message);
    res.status(500).json({
      message: "Error al obtener el perfil del usuario",
      error: error.message,
    });
  }
};

/**
 * Updates the authenticated user's profile
 * Allows updating name, email, and password (the pre-save hook handles hashing)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email.toLowerCase();
    if (req.body.password) user.password = req.body.password; // triggers hashing in pre-save

    await user.save();

    res.status(200).json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("[updateProfile] Error:", error.message);
    res.status(500).json({
      message: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};

/**
 * Obtains a list of all users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("[getAllUsers] Error:", error.message);
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message,
    });
  }
};

/**
 * Deletes a user by ID (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("[deleteUser] Error:", error.message);
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};
