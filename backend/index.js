const express = require('express');
const mongoose = require('mongoose');
const Course = require('./model/Course');
const app = express();
const port = 5000;
const { termEq, termToggle, termIsSmall } = require('./controllers/termFns');

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

app.get('/courses', async (req, res) => {
  const query = Course.find({});
  if (req.query.search != null) {
    const searchTerm = new RegExp(req.query.search, "i");
    query.find({$or: [{title: searchTerm}, {code: searchTerm}]});
  }
  if (req.query.term != null && termIsSmall(req.query.term)) {
    const term = termToggle(req.query.term);
    query.find({term: term});
  }
  if (req.query.year != null) {
    const year = Number(req.query.year);
    if (year !== NaN) {
      query.find({year: year});
    }
  }
  query.select(['title', 'code', 'term', 'year']);
  const courses = await query.exec();
  res.send(JSON.stringify(courses));
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

