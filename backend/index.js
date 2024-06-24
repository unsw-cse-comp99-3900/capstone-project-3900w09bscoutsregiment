import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express , this isss backend');
});

// This line sets up routing for the /api/auth endpoint.
// sign up and log in pages should be directed to
// localhost:{PORT}/api/auth/signup or localhost:{PORT}/api/auth/login
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
