import express from 'express';
import Course from '../model/Course.js';
import User from '../model/User.js';
import HasCourse from '../model/HasCourse.js';
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

courseRouter.get('/list', async (req, res) => {
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
  const userHasCourse = (await HasCourse.exists({userId: userId, courseId: courseId}).exec()) != null;
  if (userHasCourse) {
    return res.status(400).json({ message: 'userId courseId pair already exists' });
  }
  const result = await HasCourse.create({
    userId: userId,
    courseId: courseId,
    favorite: false
  });
  console.log(res);
  res.send('ok');
});

courseRouter.post('/delete', async (req, res) => {

});


export default courseRouter;
