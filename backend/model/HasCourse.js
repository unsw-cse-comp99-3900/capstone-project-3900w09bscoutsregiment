import mongoose from 'mongoose';

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

const HasCourse = mongoose.model('HasCourse', hasCourseSchema);
export default HasCourse;
