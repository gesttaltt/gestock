import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

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
      select: false, // No se retorna por defecto en las consultas para mayor seguridad
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Excluir la contraseña al convertir a JSON (por ejemplo, al enviar respuestas en API)
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
    // Hashea la contraseña y la asigna al campo 'password'
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar la contraseña ingresada con la almacenada
// Nota: Cuando uses este método, asegúrate de que la consulta incluya explícitamente el campo 'password'
// (por ejemplo, usando .select("+password"))
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Método para verificar si el usuario es administrador
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

export default mongoose.model("User", userSchema);
