import express from 'express';
import Course from '../model/Course.js';
import User from '../model/User.js';
import { termEq, termToggle, termIsSmall } from '../controllers/termFns.js';

const courseRouter = express.Router();

courseRouter.get('/:code/:year/:term', async (req, res) => {
  const query = Course.find({});
  query.find({code: req.params.code});
  query.find({year: Number(req.params.year)});
  query.find({term: termToggle(req.params.term)});
  const course = await query.exec();
  res.json(course);
});

courseRouter.get('/all', async (req, res) => {
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

courseRouter.get('/list/:user', async (req, res) => {
  
});

courseRouter.post('/add', async (req, res) => {
  const userId = req.body.userId;
  if (userId == null) {
    return res.status(400).json({ message: 'Provided userId is null' });
  }
  const userExists = (await User.exists({_id: userId}).exec()) != null;
  if (!userExists) {
    return res.status(400).json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (courseId == null) {
    return res.status(400).json({ message: 'Provided courseId is null' });
  }
  const courseExists = (await Course.exists({_id: courseId}).exec()) != null;
  if (!courseExists) {
    return res.status(400).json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({_id: userId}, 'courses').exec();
  console.log(userList);
  if (userList.courses.includes(courseId)) {
    return res.status(400).json({ message: 'User already added course' });
  }
  userList.courses.push(courseId);
  const result = await User.updateOne({_id: userId}, {courses: userList.courses}).exec();
  console.log(result);
  res.send('ok');
});

courseRouter.post('/delete', async (req, res) => {
  const userId = req.body.userId;
  if (userId == null) {
    return res.status(400).json({ message: 'Provided userId is null' });
  }
  const courseId = req.body.courseId;
  if (courseId == null) {
    return res.status(400).json({ message: 'Provided courseId is null' });
  }
  const userList = await User.findOne({_id: userId}, 'courses').exec();
  console.log(userList.courses);
  const newList = new Array();
  for (const i in userList.courses) {
    if (userList.courses[i].toString() != courseId) {
      newList.push(userList.courses[i]);
    }
  }
  const result = await User.updateOne({_id: userId}, {courses: newList}).exec();
  console.log(result);
  res.send('ok');
});


export default courseRouter;
