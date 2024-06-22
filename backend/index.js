const express = require('express');
const mongoose = require('mongoose');
const Course = require('./model/Course');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// MongoDB connection
try { 
  mongoose.connect('mongodb://localhost:27017/mydatabase', {
  });
} catch (err) {
  console.log(err);
}

const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express , this isss backend');
});

// app.put('/', async (req, res) => {
//   const result = await Course.create({
//     title: "Programming Fundamentals",
//     code: "COMP1511",
//     year: 2022,
//     term: 1,
//     outcomes: ["outcome 1", "outcome 2"]
//   });
//   console.log(result);
//   res.send();
// });

db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

