const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/mydatabase', {
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

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
