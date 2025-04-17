// core/user/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field
  // Add other fields as necessary
});

const User = mongoose.model('User', userSchema);

module.exports = User;
