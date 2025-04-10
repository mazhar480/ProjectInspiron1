// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const userService = require('./core/user/user.service');
const authenticateToken = require('./middleware/authMiddleware'); // Import the middleware
const assetRoutes = require('./modules/itam/routes/asset.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Mount the asset routes under the /api path
app.use('/api', assetRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Project Inspiron 1 Backend!');
});

app.post('/api/register', async (req, res) => {
  // ... (registration route remains the same) ...
});

app.post('/api/login', async (req, res) => {
  // ... (login route remains the same) ...
});

app.get('/api/users/:id', (req, res) => {
  // ... (get user by id route remains the same) ...
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});