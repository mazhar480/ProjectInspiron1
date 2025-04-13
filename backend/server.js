require('dotenv').config();

const express = require('express');
const cors = require('cors');


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable if you need to send cookies or authentication headers
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Import routes
const userRoutes = require('./routes/user.routes');
const assetRoutes = require('./modules/itam/routes/asset.routes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
