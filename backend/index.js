const express = require('express');
const mongoose = require('mongoose');
const Course = require('./model/Course');
const User = require('./model/User');
const HasCourse = require('./model/HasCourse');
const app = express();
const port = 5000;
const { termEq, termToggle, termIsSmall } = require('./controllers/termFns');

// Middleware
app.use(express.json());

// MongoDB connection
try { 
 //  mongoose.connect('mongodb://localhost:27017/mydatabase', {
  mongoose.connect('mongodb+srv://alixaz031:TZZzJPXi1e8HN61E@3900database.owuq2ud.mongodb.net/', {
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

app.get('/course/:code/:year/:term/', async (req, res) => {
  const query = Course.find({});
  query.find({code: req.params.code});
  query.find({year: Number(req.params.year)});
  query.find({term: termToggle(req.params.term)});
  const course = await query.exec();
  res.json(course);
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
  query.select(['_id', 'title', 'code', 'term', 'year']);
  const courses = await query.exec();
  console.log(courses);
  res.json(courses);
});

app.post('/add-course', async (req, res) => {
  const userId = req.body.userId;
  if (userId == null) {
    // we have a problem here i think
    throw new Error('Need a user to add to');
  }
  const userExists = (await User.exists({_id: userId}).exec()) != null;
  if (!userExists) {
    throw new Error('User id doesn\'t exist in db');
  }
  const courseId = req.body.courseId;
  if (courseId == null) {
    // we also have a problem here
    throw new Error('Need a course to add to the user');
  }
  const courseExists = (await Course.exists({_id: courseId}).exec()) != null;
  if (!courseExists) {
    throw new Error('User id doesn\'t exist in db');
  }
  const userHasCourse = (await HasCourse.exists({userId: userId, courseId: courseId}).exec()) != null;
  if (userHasCourse) {
    throw new Error('User should not have the same one twice');
  }
  const result = await HasCourse.create({
    userId: userId,
    courseId: courseId,
    favorite: false
  });
  console.log(res);
  res.send('ok');
});

app.post('/delete-course', async (req, res) => {

});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

