require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const projectsRoute = require('./routes/projects');
const authRoute = require('./routes/auth');
const configRoute = require('./routes/config');
const uploadRoute = require('./routes/upload');
const imagesRoute = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// trust proxy for accurate rate-limit IP on Railway
app.set('trust proxy', 1);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
});

app.get('/', (req, res) => {
  res.json({ status: 'running', name: 'bhama portfolio api' });
});

// rate limit must be mounted before the auth route
app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/config', configRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/images', imagesRoute);

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
