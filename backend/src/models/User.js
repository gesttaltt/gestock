// File: /backend/src/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // keep for verifying bcrypt-hashed passwords
import dotenv from "dotenv";
import { hashPassword } from "../utils/passwordHasher.js";

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Formato de correo electrónico inválido"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // no se retorna por defecto en las consultas para mayor seguridad
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Excluir la contraseña al convertir a JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Pre-save hook para hashear la contraseña si es nueva o ha sido modificada
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const { hash } = await hashPassword(this.password);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Si el hash comienza con "$argon2", es Argon2id
  if (this.password.startsWith("$argon2")) {
    const argon2 = require("argon2");
    return argon2.verify(this.password, enteredPassword);
  }
  // Si el hash contiene ":", asumimos scrypt (almacenado como "salt:derivedKey")
  if (this.password.includes(":")) {
    const [saltHex, keyHex] = this.password.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const keyLength = Buffer.from(keyHex, "hex").length;

    return new Promise((resolve, reject) => {
      require("crypto").scrypt(
        enteredPassword,
        salt,
        keyLength,
        { cost: 217, blockSize: 8 },
        (err, derivedKey) => {
          if (err) return reject(err);
          resolve(derivedKey.toString("hex") === keyHex);
        }
      );
    });
  }
  // De lo contrario, asumimos que es bcrypt
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

export default mongoose.model("User", userSchema);
