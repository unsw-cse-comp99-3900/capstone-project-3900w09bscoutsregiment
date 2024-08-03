import express from 'express';
import Course from '../model/Course.js';
import User from '../model/User.js';
import { termEq, termToggle, termIsSmall } from '../controllers/termFns.js';
import { validIdString } from '../controllers/idFns.js';
import { authMiddleware } from './auth.js';
import analyseFns from '../controllers/analyseFns.js';

const courseRouter = express.Router();

courseRouter.use(authMiddleware);

// Gets the details of a specific course offering
courseRouter.get('/:code/:year/:term', async (req, res) => {
  const query = Course.find({});
  query.find({ code: req.params.code });
  query.find({ year: Number(req.params.year) });
  query.find({ term: termToggle(req.params.term) });
  const course = await query.lean().exec();
  if (course.length < 1) {
    res.json([]);
  }
  const c = course[0];
  c.keywords = new Array();
  for (const o of c.outcomes) {
    const a = analyseFns.analyseOutcome(o);
    const words = analyseFns.getKeywords(o, a);
    c.keywords.push({ category: a, words: words });
  }
  res.json([c]);
});

// Gets a list of courses that fulfil any combination of
// 3 filtering options provided in a query string.
// search -- filters out courses that do not have search as a substring of the
//           title or code
// term -- filters out courses that do not match the specified term
// year -- filters out courses that do not match the specified year
courseRouter.get('/all', async (req, res) => {
  const query = Course.find({});
  if (req.query.search != null) {
    const searchTerm = new RegExp(req.query.search, 'i');
    query.find({ $or: [{ title: searchTerm }, { code: searchTerm }] });
  }
  if (req.query.term != null && termIsSmall(req.query.term)) {
    const term = termToggle(req.query.term);
    query.find({ term: term });
  }
  if (req.query.year != null) {
    const year = Number(req.query.year);
    if (year !== NaN) {
      query.find({ year: year });
    }
  }
  query.select(['_id', 'title', 'code', 'term', 'year']);
  const courses = await query.exec();
  res.json(courses);
});

// provides the list of courses that are in the current user's account
// resposnse format
// [
//   {
//     courseId,
//     title,
//     code,
//     year,
//     term,
//     favorite,
//     colour,
//     info: [
//       { category, value },
//       { category, value },
//     ]
//   }
// ]
courseRouter.get('/list', async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).exec();
  if (user == null) {
    console.log('user was null');
    return res.status(400).json({ message: 'Provided user does not exists' });
  }
  const searchList = new Array();
  for (const course of user.courses) {
    searchList.push({ _id: course.courseId });
  }
  if (searchList.length < 1) {
    return res.json([]);
  }
  const courseList = await Course.find(
    { $or: searchList },
    '_id title code year term outcomes',
  ).exec();
  const output = new Array();
  for (const course of courseList) {
    const tempCourse = user.courses.find(
      (elem) => elem.courseId.toString() == course._id.toString(),
    );
    const infoList = new Array();
    for (const c of analyseFns.categories) {
      infoList.push({ category: c, value: 0 });
    }
    for (const outcome of course.outcomes) {
      const c = analyseFns.analyseOutcome(outcome);
      const infoBlock = infoList.find((i) => i.category == c);
      infoBlock.value += 1;
    }
    output.push({
      courseId: course._id,
      title: course.title,
      code: course.code,
      year: course.year,
      term: course.term,
      favorite: tempCourse.favorite,
      colour: tempCourse.colour,
      info: infoList,
    });
  }
  return res.json(output);
});

// Adds a course to the current user's account
// the course is provided in the body as courseId
courseRouter.post('/add', async (req, res) => {
  const userId = req.userId;
  const userExists = (await User.exists({ _id: userId }).exec()) != null;
  if (!userExists) {
    console.log('user not exist');
    return res
      .status(400)
      .json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    console.log('bad cid');
    return res
      .status(400)
      .json({ message: 'courseId is not a valid ObjectId' });
  }
  const courseExists = (await Course.exists({ _id: courseId }).exec()) != null;
  if (!courseExists) {
    console.log('course not exist');
    return res
      .status(400)
      .json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({ _id: userId }, 'courses').exec();
  if (userList.courses.find((x) => x.courseId == courseId) != undefined) {
    console.log('user already has');
    return res.status(400).json({ message: 'User already added course' });
  }
  userList.courses.push({
    courseId: courseId,
    colour: '02b0f5',
    favorite: false,
  });
  const result = await User.updateOne(
    { _id: userId },
    { courses: userList.courses },
  ).exec();
  res.send('ok');
});

// Removes a course from the current user's account
// the course is provided in the body as courseId
courseRouter.post('/delete', async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res
      .status(400)
      .json({ message: 'courseId is not a valid ObjectId' });
  }
  const userList = await User.findOne({ _id: userId }, 'courses').exec();
  const newList = new Array();
  for (const e of userList.courses) {
    if (e.courseId.toString() != courseId) {
      newList.push(e);
    }
  }
  const result = await User.updateOne(
    { _id: userId },
    { courses: newList },
  ).exec();
  res.send('ok');
});

// Favorites a course in the current user's account
courseRouter.post('/favorite', async (req, res) => {
  const userId = req.userId;
  const userExists = (await User.exists({ _id: userId }).exec()) != null;
  if (!userExists) {
    return res
      .status(400)
      .json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res
      .status(400)
      .json({ message: 'courseId is not a valid ObjectId' });
  }
  const courseExists = (await Course.exists({ _id: courseId }).exec()) != null;
  if (!courseExists) {
    return res
      .status(400)
      .json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({ _id: userId }, 'courses').exec();
  for (const e of userList.courses) {
    if (e.courseId.toString() == courseId) {
      e.favorite = true;
    }
  }
  const result = await User.updateOne(
    { _id: userId },
    { courses: userList.courses },
  ).exec();
  res.send('ok');
});

// Unfavorites a course in the current user's account
courseRouter.post('/unfavorite', async (req, res) => {
  const userId = req.userId;
  const userExists = (await User.exists({ _id: userId }).exec()) != null;
  if (!userExists) {
    return res
      .status(400)
      .json({ message: 'Provided userId is not a user in the db' });
  }
  const courseId = req.body.courseId;
  if (!validIdString(courseId)) {
    return res
      .status(400)
      .json({ message: 'courseId is not a valid ObjectId' });
  }
  const courseExists = (await Course.exists({ _id: courseId }).exec()) != null;
  if (!courseExists) {
    return res
      .status(400)
      .json({ message: 'Provided courseId is not a course in the db' });
  }
  const userList = await User.findOne({ _id: userId }, 'courses').exec();
  for (const e of userList.courses) {
    if (e.courseId.toString() == courseId) {
      e.favorite = false;
    }
  }
  const result = await User.updateOne(
    { _id: userId },
    { courses: userList.courses },
  ).exec();
  res.send('ok');
});

courseRouter.post('/pdf', async (req, res) => {
  const userId = req.userId;
  const courses = req.body.courses;
  // const courses = [ '66794f6696723a5b858c8654', '66794fc19e0ec7e1bda06b7e' ];
  if (courses == undefined) {
    res.status(400).json({ message: 'Did not provide courses' });
    return;
  }
  if (!(courses instanceof Array)) {
    res.status(400).json({ message: 'Did not provide array of courses' });
    return;
  }
  const orList = new Array();
  if (courses.length < 1) {
    res
      .status(400)
      .json({ message: 'Did not provide any ids in courses array' });
    return;
  }
  for (const cId of courses) {
    orList.push({ _id: cId });
  }
  const query = Course.find({ $or: orList });
  query.select(['_id', 'code', 'term', 'year', 'outcomes']);
  const results = await query.exec();
  // analyseFns.makePDF(analyseFns.analyseCourses(results));
  // res.set('Content-Disposition', 'attachment; filename=/usr/report.pdf');
  // res.set('Content-Type', 'application/pdf');
  const pdf = analyseFns.makePDF(analyseFns.analyseCourses(results));
  res.attachment();
  res.type('pdf');
  pdf.pipe(res);
});

// courseRouter.post('/analyse', async (req, res) => {
//   const courses = req.body.courses;
//   // maybe check input is ok
//   const analysis = analyseFns.analyseCourses(courses);
//   return res.json(analysis);
// });

export default courseRouter;
