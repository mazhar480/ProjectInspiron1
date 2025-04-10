// backend/server.js

const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const userService = require('./core/user/user.service');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // Use middleware to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello from Project Inspiron 1 Backend!');
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // In a real application, you would check if the username or email already exists.

  const newUser = userService.createUser(username, email, password);
  res.status(201).json({ message: 'User registered successfully!', user: newUser });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = userService.getUserById(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});