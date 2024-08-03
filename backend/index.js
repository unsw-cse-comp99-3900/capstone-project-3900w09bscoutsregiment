import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import cors from 'cors';
import courseRouter from './routes/course.js';
import analyseFns from './controllers/analyseFns.js';

const app = express();
const port = process.env.NEXT_PUBLIC_PORT_NUM;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
try {
  mongoose.connect(
    'mongodb+srv://alixaz031:TZZzJPXi1e8HN61E@3900database.owuq2ud.mongodb.net/',
    {},
  );
} catch (err) {
  console.log(err);
}

const db = mongoose.connection;

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
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});
