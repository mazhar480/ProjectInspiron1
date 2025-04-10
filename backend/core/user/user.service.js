// backend/core/user/user.service.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../database/db'); // Import the database connection pool
const saltRounds = 10;
const JWT_SECRET = 'your-secret-key'; // **IMPORTANT:** Use a strong, secure secret

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

        const [existingUserByUsername] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUserByUsername.length > 0) {
            throw new Error('Username already exists.');
        }

        const [existingUserByEmail] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUserByEmail.length > 0) {
            throw new Error('Email already exists.');
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.execute('INSERT INTO users (username, email, passwordHash, registrationDate) VALUES (?, ?, ?, ?)', [username, email, passwordHash, new Date()]);
        const userId = result.insertId;

        const [newUser] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        return newUser[0];
    }

    async verifyPassword(plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }

    generateToken(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            email: user.email
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    async getUserById(id) {
        const [rows] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async getUserByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    async getUserByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new UserService();