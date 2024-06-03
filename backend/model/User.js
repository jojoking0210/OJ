const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: '', // Empty string by default
    required: true,
  },
  lastname: {
    type: String,
    default: '', // Empty string by default
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Allowed role values
    default: 'user', // Default role set to 'user'
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
