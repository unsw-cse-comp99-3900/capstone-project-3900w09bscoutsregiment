import express from 'express';
import Course from '../model/Course.js';
import User from '../model/User.js';
import HasCourse from '../model/HasCourse.js';

const courseRouter = express.Router();

courseRouter.get('/course/:code/:year/:term', async (req, res) => {
  const query = Course.find({});
  query.find({code: req.params.code});
  query.find({year: Number(req.params.year)});
  query.find({term: termToggle(req.params.term)});
  const course = await query.exec();
  res.json(course);
});

courseRouter.get('/courses', async (req, res) => {
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

courseRouter.post('/add-course', async (req, res) => {
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

courseRouter.post('/delete-course', async (req, res) => {

});


export default coruseRouter;
