// backend/core/user/user.service.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');


const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

class UserService {
  async createUser(username, email, password) {
    if (!username || !email || !password) {
      throw new Error('Missing required fields.');
    }
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const [existingUserByUsername] = await pool.execute(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    if (existingUserByUsername.length > 0) {
      throw new Error('Username already exists.');
    }

    const [existingUserByEmail] = await pool.execute(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (existingUserByEmail.length > 0) {
      throw new Error('Email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, passwordHash, registrationDate) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, new Date()]
    );

    const userId = result.insertId;
    const [newUser] = await pool.execute(
      'SELECT id, username, email FROM users WHERE id = ?', [userId]
    );
    return newUser[0];
  }

  async verifyPassword(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

  async getUserById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM users WHERE id = ?', [id]
    );
    return rows[0];
  }

  async getUserByUsername(username) {
    if (!username) return null;
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    return rows[0];
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    return rows[0];
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  generateToken(user) {
    console.log('🚨 JWT_SECRET:', JWT_SECRET); // Add this line
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = new UserService();
