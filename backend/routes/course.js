import express from 'express';
import Course from '../model/Course.js';
import User from '../model/User.js';
import { termEq, termToggle, termIsSmall } from '../controllers/termFns.js';
import { validIdString } from '../controllers/idFns.js';

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
  if (!validIdString(req.params.user)) {
    return res.status(400).json({ message: 'user is not a valid ObjectId' });
  }
  const user = await User.findOne({_id: req.params.user}).exec();  
  if (user == null) {
    return res.status(400).json({ message: 'Provided user does not exists' });
  }
  const searchList = new Array();
  for (const course of user.courses) {
    searchList.push({_id: course.courseId});
  }
  const courseList = await Course.find({$or: searchList}, '_id code year term').exec();
  const output = new Array();
  for (const course of courseList) {
    const tempCourse = user.courses.find((elem) => elem.courseId.toString() == course._id.toString());
    output.push({
      courseId: course._id,
      code: course.code,
      year: course.year,
      term: course.term,
      favorite: tempCourse.favorite,
      colour: tempCourse.colour
    });
  }
  console.log(output);
  return res.json(output);
});

courseRouter.post('/add', async (req, res) => {
  const userId = req.body.userId;
  if (!validIdString(userId)) {
    return res.status(400).json({ message: 'userId is not a valid ObjectId' });
  }
  const userExists = (await User.exists({_id: userId}).exec()) != null;
  if (!userExists) {
    return res.status(400).json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res.status(400).json({ message: 'courseId is not a valid ObjectId' });
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
  userList.courses.push({courseId: courseId, colour: "02b0f5", favorite: false});
  const result = await User.updateOne({_id: userId}, {courses: userList.courses}).exec();
  console.log(result);
  res.send('ok');
});

courseRouter.post('/delete', async (req, res) => {
  const userId = req.body.userId;
  if (!validIdString(userId)) {
    return res.status(400).json({ message: 'userId is not a valid ObjectId' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res.status(400).json({ message: 'courseId is not a valid ObjectId' });
  }
  const userList = await User.findOne({_id: userId}, 'courses').exec();
  console.log(userList.courses);
  const newList = new Array();
  for (const e of userList.courses) {
    if (e.courseId.toString() != courseId) {
      newList.push(e);
    }
  }
  const result = await User.updateOne({_id: userId}, {courses: newList}).exec();
  console.log(result);
  res.send('ok');
});

courseRouter.post('/favorite', async (req, res) => {
  const userId = req.body.userId;
  if (!validIdString(userId)) {
    return res.status(400).json({ message: 'userId is not a valid ObjectId' });
  }
  const userExists = (await User.exists({_id: userId}).exec()) != null;
  if (!userExists) {
    return res.status(400).json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res.status(400).json({ message: 'courseId is not a valid ObjectId' });
  }
  const courseExists = (await Course.exists({_id: courseId}).exec()) != null;
  if (!courseExists) {
    return res.status(400).json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({_id: userId}, 'courses').exec();
  for (const e of userList.courses) {
    if (e.courseId.toString() == courseId) {
      e.favorite = true;
    }
  }
  const result = await User.updateOne({_id: userId}, {courses: userList}).exec();
  console.log(result);
  res.send('ok');
});

courseRouter.post('/unfavorite', async (req, res) => {
  const userId = req.body.userId;
  if (!validIdString(userId)) {
    return res.status(400).json({ message: 'userId is not a valid ObjectId' });
  }
  const userExists = (await User.exists({_id: userId}).exec()) != null;
  if (!userExists) {
    return res.status(400).json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res.status(400).json({ message: 'courseId is not a valid ObjectId' });
  }
  const courseExists = (await Course.exists({_id: courseId}).exec()) != null;
  if (!courseExists) {
    return res.status(400).json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({_id: userId}, 'courses').exec();
  for (const e of userList.courses) {
    if (e.courseId.toString() == courseId) {
      e.favorite = false;
    }
  }
  const result = await User.updateOne({_id: userId}, {courses: userList}).exec();
  console.log(result);
  res.send('ok');
});

export default courseRouter;
