import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import cors from 'cors';
import courseRouter from './routes/course.js';
import analyseFns from './controllers/analyseFns.js';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
try { 
 //  mongoose.connect('mongodb://localhost:27017/mydatabase', {
  mongoose.connect('mongodb+srv://alixaz031:TZZzJPXi1e8HN61E@3900database.owuq2ud.mongodb.net/', {
  });
} catch (err) {
  console.log(err);
}

const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express , this isss backend');
});

// This line sets up routing for the /api/auth endpoint.
// sign up and log in pages should be directed to
// localhost:{PORT}/api/auth/signup or localhost:{PORT}/api/auth/login
app.use('/api/auth', authRouter);

app.use('/api/course', courseRouter);

db.once('open', async () => {
  console.log('Connected to MongoDB');
  analyseFns.loadFile('./verbs.txt');
  // console.log(analyseOutcome('Describe biomaterial classes, their general properties, and predict how specific materials may be affected by physiological conditions'));
  // console.log(analyseOutcome('Develop the basis for a material with specified flow and dynamic properties using key ingredients like polymers, particles, and emulsifiers.'));
  // console.log(analyseOutcome('Analyse experimental data on product properties to deliver quantitative measures of product performance.'));
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

