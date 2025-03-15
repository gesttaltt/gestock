// File: /backend/src/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcrypt"; // for verifying bcrypt-hashed passwords
import dotenv from "dotenv";
import { hashPassword } from "../utils/passwordHasher.js";
import crypto from "crypto"; // ESM import for crypto

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
      select: false, // do not return by default for security
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Exclude the password when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Pre-save hook to hash the password if it's new or modified
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

// Method to compare an entered password with the stored password hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  // If the stored hash starts with "$argon2", assume it's Argon2id
  if (this.password.startsWith("$argon2")) {
    const argon2Module = await import("argon2");
    return argon2Module.default.verify(this.password, enteredPassword);
  }
  // If the stored hash contains ":", assume it's scrypt (stored as "salt:derivedKey")
  if (this.password.includes(":")) {
    const [saltHex, keyHex] = this.password.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const keyLength = Buffer.from(keyHex, "hex").length;

    return new Promise((resolve, reject) => {
      crypto.scrypt(
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
  // Otherwise, assume it's bcrypt
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

export default mongoose.model("User", userSchema);
