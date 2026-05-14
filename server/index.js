require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectsRoute = require('./routes/projects');
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'running', name: 'bhama portfolio api' });
});

app.use('/api/auth', authRoute);
app.use('/api/projects', projectsRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('mongo connected');
    app.listen(PORT, () => console.log(`server on ${PORT}`));
  })
  .catch((err) => {
    console.error('mongo failed:', err.message);
    process.exit(1);
  });
