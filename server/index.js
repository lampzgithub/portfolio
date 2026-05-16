require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const projectsRoute = require('./routes/projects');
const authRoute = require('./routes/auth');
const configRoute = require('./routes/config');
const uploadRoute = require('./routes/upload');
const imagesRoute = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

// ── SECURITY HEADERS ──
// CSP allows the same-origin assets, inline styles (we use style= props),
// images from anywhere over https (Imgur, etc.) plus data: for our own
// /api/images responses, and connections back to ourselves.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // images must be loadable from the frontend origin
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginEmbedderPolicy: false
  })
);

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
