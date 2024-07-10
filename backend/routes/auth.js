import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

const JWT_SECRET_KEY =
  'a64574ab370ef9fb3f5d5b21ed91f092a8f51713b84f34be67641d14e2b9c83f18860d21caf5dcfed5e04d216cbef38f07c75d3de60098b7af42351d21c7f408';

// Manual Signup
authRouter.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('caught error');
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Manual Login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const doPasswordsMatch = await user.matchPassword(password);

    if (!doPasswordsMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default authRouter;
