const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId

const hasCourseSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  courseId: {
    type: ObjectId,
    required: true
  },
  favorite: Boolean
});

module.exports = mongoose.model('HasCourse', hasCourseSchema);
