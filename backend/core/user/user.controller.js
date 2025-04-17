// backend/core/user/user.controller.js

const userService = require('./user.service');

exports.registerUser = async (req, res) => {
  try {
    // We need the actual data from req.body, not the whole object
    const { username, email, password } = req.body;

    console.log('Login input received:', usernameOrEmail, password);
    // Pass individual arguments as expected by the service
    const newUser = await userService.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    // --- Add this line to explicitly log the error ---
    console.error('Registration Error:', error);
    // -------------------------------------------------
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Keep the loginUser function as it was
exports.loginUser = async (req, res) => {
  // ... (loginUser code remains the same)
};

// backend/core/user/user.controller.js
exports.loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Check if user exists by username or email
    const user =
      (await userService.getUserByUsername(usernameOrEmail)) ||
      (await userService.getUserByEmail(usernameOrEmail));

    console.log('User lookup result:', user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await userService.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = userService.generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id, // Assuming your user object has an '_id'
        name: user.username, // Or user.name, depending on your model
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};
