import { Router } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../modules/adminmodule.mjs';
dotenv.config();
//admin login
const router=Router();
router.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;
    const secretKey = process.env.SECRET_KEY;
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send({ message: "Invalid username " });
      }
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid password " });
      }
      // Generate JWT token
      const token = jwt.sign({ username: user.username }, secretKey);
      res.json({ token });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  
  // Register route
  router.post(
    "/admin-register",
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('Please provide a valid email address'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, email, password } = req.body;
      try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.status(400).json({ message: "Username or Email already exists" });
        }
  
        // Hash the password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
  
        // Create a new user with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });
  
        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
// Reset password - Update password with new one
router.post("/reset-password", async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;
  
  try {
      // Find user by username (or you can use email, whichever is suitable)
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Validate new password
      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash the new password
      const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      console.error("Reset password failed:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


  export default router;
