const express = require('express');
const mongoose = require('mongoose');
const Course = require('./model/Course');
const app = express();
const port = 5000;
const qs = require('qs');

// Middleware
app.use(express.json());

app.set('query parser', (str) => {
  return qs.parse(str, {});
});

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

app.get('/courses', (req, res) => {
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

