// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // 👇 NUEVO: nombre del usuario
    name: {
      type: String,
      required: true,   // lo hacemos obligatorio para el registro
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      // si luego quieres, puedes poner required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model('User', userSchema);
