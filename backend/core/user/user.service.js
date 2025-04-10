// backend/core/user/user.service.js

const User = require('./user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

// In a real application, you would likely use a database to store users.
// For now, we'll use an in-memory array for simplicity.
const users = [];
let nextId = 1;

class UserService {
    async createUser(username, email, password) {
        // 1. Basic input validation (you might want more robust validation)
        if (!username || !email || !password) {
            throw new Error('Missing required fields.');
        }
        if (users.some(user => user.username === username)) {
            throw new Error('Username already exists.');
        }
        if (users.some(user => user.email === email)) {
            throw new Error('Email already exists.');
        }
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format.');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }

        // 2. Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User(nextId++, username, email, passwordHash, new Date());
        users.push(newUser);
        return newUser;
    }

    async verifyPassword(plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
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
        // Basic email format validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // In a real application, you would have methods for updating users, deleting users, etc.
}

module.exports = new UserService();