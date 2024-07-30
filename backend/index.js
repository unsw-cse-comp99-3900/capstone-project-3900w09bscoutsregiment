import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import cors from 'cors';
import courseRouter from './routes/course.js';
import analyseFns from './controllers/analyseFns.js';
// import passport from 'passport';
// import session from 'express-session';

const app = express();
const port = process.env.NEXT_PUBLIC_PORT_NUM;

// Middleware
app.use(express.json());
app.use(cors());
// app.use(
//   session({
//     secret: 'i love this course!!!!',
//     resave: false,
//     saveUninitialized: true,
//   }),
// );
// app.use(passport.initialize());
// app.use(passport.session());

// MongoDB connection
try {
  //  mongoose.connect('mongodb://localhost:27017/mydatabase', {
  mongoose.connect(
    'mongodb+srv://alixaz031:TZZzJPXi1e8HN61E@3900database.owuq2ud.mongodb.net/',
    {},
  );
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

app.use('/api/profile', profileRouter);

let server = undefined;

db.once('open', async () => {
  console.log('Connected to MongoDB');
  analyseFns.loadFile('./verbs.txt');
  server = app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});

app.close = () => {
  if (server != undefined) {
    server.close((err) => {
      console.log('closing...');
      process.exit(err ? 1 : 0);
    });
  }
}

export default app;
