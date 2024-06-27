import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Schema definition
const courseSchema = new Schema({
  title: String,
  code: {
    type: String,
    required: true
  },
  year: Number,
  term: String,
  outcomes: [String]
});

// Create the model in the db with mongoose
const Course = mongoose.model('Course', courseSchema);
export default Course;
