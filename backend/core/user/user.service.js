// backend/core/user/user.service.js

const User = require('./user.model');

// In a real application, you would likely use a database to store users.
// For now, we'll use an in-memory array for simplicity.
const users = [];
let nextId = 1;

class UserService {
    createUser(username, email, password) {
        // In a real application, you would:
        // 1. Validate the input (e.g., check for unique username/email, password strength).
        // 2. Hash the password before storing it.
        const newUser = new User(nextId++, username, email, password, new Date());
        users.push(newUser);
        return newUser;
    }

    getUserById(id) {
        return users.find(user => user.id === parseInt(id));
    }

    getUserByUsername(username) {
        return users.find(user => user.username === username);
    }

    // In a real application, you would have methods for updating users, deleting users, etc.
}

module.exports = new UserService();