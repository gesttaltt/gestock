import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
      minlength: [3, "El nombre del cliente debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre del cliente no puede exceder los 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      // You could add a regex to validate email format if needed.
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      // Optionally, you might add match validation for phone format.
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
