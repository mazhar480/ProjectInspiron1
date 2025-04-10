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

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await userService.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully!', user: { id: newUser.id, username: newUser.username, email: newUser.email } }); // Don't send the password hash
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Please provide username/email and password.' });
  }

  const user = userService.getUserByUsername(usernameOrEmail) || userService.getUserByEmail(usernameOrEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isPasswordValid = await userService.verifyPassword(password, user.passwordHash);

  if (isPasswordValid) {
    // In a real application, you would generate and send a JWT (JSON Web Token) here for authentication.
    res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email } }); // Don't send the password hash
  } else {
    res.status(401).json({ message: 'Invalid credentials.' });
  }
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = userService.getUserById(userId);
  if (user) {
    res.json({ id: user.id, username: user.username, email: user.email }); // Don't send the password hash
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});