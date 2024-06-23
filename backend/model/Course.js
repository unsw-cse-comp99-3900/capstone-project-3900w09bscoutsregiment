const mongoose = require('mongoose');
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
module.exports = mongoose.model('Course', courseSchema);
