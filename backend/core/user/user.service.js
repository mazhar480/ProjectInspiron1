// backend/core/user/user.service.js

const User = require('./user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; // Number of salt rounds for bcrypt

// **IMPORTANT:** Replace this with a strong, secret key from your environment variables in production
const JWT_SECRET = 'your-secret-key';

// In a real application, you would likely use a database to store users.
// For now, we'll use an in-memory array for simplicity.
const users = [];
let nextId = 1;

class UserService {
    async createUser(username, email, password) {
        // ... (rest of the createUser method from the previous step remains the same) ...
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User(nextId++, username, email, passwordHash, new Date());
        users.push(newUser);
        return newUser;
    }

    async verifyPassword(plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }

    generateToken(user) {
        // Create a JWT payload containing user information (excluding sensitive data like password hash)
        const payload = {
            userId: user.id,
            username: user.username,
            email: user.email
        };

        // Sign the token with the secret key and set an expiration time
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        return token;
    }

    getUserById(id) {
        return users.find(user => user.id === parseInt(id));
    }

    getUserByUsername(username) {
        return users.find(user => user.username === username);
    }

    getUserByEmail(email) {
        return users.find(user => user.email === email);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // In a real application, you would have methods for updating users, deleting users, etc.
}

module.exports = new UserService();