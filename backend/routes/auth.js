import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import { initializeApp, cert } from 'firebase-admin/app';
import { readFile } from 'fs/promises';
import { getAuth } from 'firebase-admin/auth';
import bcrypt from 'bcryptjs';

const authRouter = express.Router();

const JWT_SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

// Manual Signup
authRouter.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(401).json({ message: 'User already exists' });
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
      return res
        .status(400)
        .json({ message: 'User with this email doesnt exist' });
    }

    const doPasswordsMatch = await user.matchPassword(password);

    if (!doPasswordsMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// variables needed for google log in
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CREDENTIALS,
);

initializeApp({
  credential: cert(serviceAccount),
});

const admin = getAuth();

// route that logs a user in with google
authRouter.post('/oauth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.verifyIdToken(token);
    let user = await User.findOne({ googleId: decodedToken.uid });

    // creates a user if one doesnt exist already
    if (!user) {
      user = new User({
        name: decodedToken.name,
        email: decodedToken.email,
        googleId: decodedToken.uid,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        isGoogleUser: true,
      },
      JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

    return res.json({ token: jwtToken });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
});

export const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // first try to verify as a firebase token incase they logged in
    // via google
    const decodedToken = await admin.verifyIdToken(token);
    req.userId = decodedToken.uid;
    req.authType = 'firebase';
    next();
  } catch (error) {
    // else user logged in manually, so try JWT verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      req.userId = decoded.id;
      req.authType = 'jwt';
      next();
    } catch (jwtError) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
  }
};

// Get username, email
authRouter.get('/details', authMiddleware, async (req, res) => {
  let user;
  try {
    if (req.authType === 'firebase') {
      user = await User.findOne({ googleId: req.userId });
    } else {
      // for a manual JWT login
      user = await User.findById(req.userId);
    }

    if (!user) {
      return res.status(400).json({ message: 'This user does not exist' });
    }

    return res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error retrieving user profile' });
  }
});

// Update email
authRouter.put('/update/email', authMiddleware, async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (oldEmail !== user.email) {
      return res.status(400).json({ message: 'Incorrect current email' });
    }

    await User.findByIdAndUpdate(req.userId, { $set: { email: newEmail } });

    return res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    return res.status(500).json({
      message: `Error. Email may already be in use or you are trying to change your gmail`,
    });
  }
});

// Update password
authRouter.put('/update/resetpassword', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: 'This user does not exist' });
    }

    const isOldPasswordCorrect = await user.matchPassword(oldPassword);

    if (!isOldPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.userId, {
      $set: { password: hashedPassword },
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occured while updating passwords' });
  }
});

export default authRouter;
