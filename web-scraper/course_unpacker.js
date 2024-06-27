const fs = require('fs');
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

const Course = mongoose.model('Course', courseSchema);

try { 
  mongoose.connect('mongodb://localhost:27017/mydatabase', {
  });
} catch (err) {
  console.log(err);
}

const db = mongoose.connection;

db.once('open', async () => {
  console.log('Connected to MongoDB');

  let data;
  // Get the file for the file provided in an argument
  try {
    data = fs.readFileSync(process.argv[2], 'utf8');
  } catch (err) {
    console.error(err);
    exit();
  }
  // parse the json for the course into an object
  const obj = JSON.parse(data);

  // grab all of the outcomes for this course
  const outcomes = [];
  for (const i in obj.integrat_CO_LearningOutcome) {
    outcomes.push(obj.integrat_CO_LearningOutcome[i].integrat_description);
  }

  // send the data to the database
  const result = await Course.create({
    "title": obj.integrat_coursename,
    "code": obj.integrat_coursecode,
    "year": obj.integrat_year,
    "term": obj.integrat_term,
    "outcomes": outcomes
  });
  process.exit();
});

