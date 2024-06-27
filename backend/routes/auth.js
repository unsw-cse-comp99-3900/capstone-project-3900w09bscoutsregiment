import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

// Manual Signup
authRouter.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  console.log('hi');
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('user already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    console.log('created user');

    const saveUser = await user.save();
    console.log('saved user');

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

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log(process.env);

    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET_KEY}`, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default authRouter;
