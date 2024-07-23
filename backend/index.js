import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
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
  mongoose.connect(
    'mongodb+srv://alixaz031:TZZzJPXi1e8HN61E@3900database.owuq2ud.mongodb.net/',
    {}
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


db.once('open', async () => {
  console.log('Connected to MongoDB');
  analyseFns.loadFile('./verbs.txt');
  const analysis = analyseFns.analyseCourses([
    {
      _id: 1,
      code: "COMP1511",
      colour: "#ffccff",
      outcomes: [
        "Apply C programming language to solve simple decision, looping, array, and linked list problems programmatically",
        "Review the produced code against specification criteria by applying testing techniques",
        "Apply basic data structures, such as arrays and linked lists, to solve complex problems",
        "Read and understand coding solutions."
      ]
    },
    {
      _id: 2,
      code: "COMP1521",
      colour: "#ffccff",
      outcomes: [
        "Describe the architectural layers (fundamental parts) of a modern computer systems from hardware device (chip) levels upwards",
        "Describe the principles of memory management and explain the workings of a system with virtual memory management",
        "Explain how the major components of a CPU work together, including how data and instructions are represented in a computer",
        "Design, implement, and analyse small programs at the assembly/machine level",
        "Describe the relationship between a high-level procedural language (C) and assembly (machine language) which implements it, including how a compiled program is executed in a classical von Neumann machine",
        "Describe the components comprising, and the services offered by, an operating system",
        "Implement simple programs involving communication and concurrency"
      ]
    },
    {
      _id: 3,
      code: "CEIC6711",
      colour: "#eeeeaa",
      outcomes: [
        "Describe the phenomenological changes wrought on the raw materials of a commercial product during processing to produce specific properties including viscosity, stability, or colour.",
        "Explain the physicochemical basis for performance of a product during use.",
        "Develop the basis for a material with specified flow and dynamic properties using key ingredients like polymers, particles, and emulsifiers.",
        "Analyse experimental data on product properties to deliver quantitative measures of product performance."
      ]
    }
  ]);
  analyseFns.makePDF(analysis, "testing")
  // console.log(analysis);
  // analyseFns.makePng(analysis, './test.png');
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});
