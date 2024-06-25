// const { register } = require('./testdb.js');
// const express = require('express');
// const mongoose = require('mongoose');
import express from 'express';
import mongoose from 'mongoose';
import { register } from './testdb.js';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// MongoDB connection
//mongodb://localhost:27017/
//mongodb://mongo:27017/
mongoose.connect('mongodb://localhost:27017/User').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  // process.exit(1); 
});;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express , this isss backend');
});

const router = express.Router();
router.post("/createuser", register);


app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
