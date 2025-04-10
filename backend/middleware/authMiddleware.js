// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // **IMPORTANT:** Use the same secret key

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (invalid token)
        }
        req.user = user; // Attach the user payload to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;