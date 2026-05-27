require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDB = require('./config/db');
const dnaRoutes = require('./routes/dnaRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

const PORT = process.env.PORT || 5001;

/* ---------------- CORS CONFIG ---------------- */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/* ---------------- HEALTH CHECK ---------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date(),
    service: 'ScholarWeb Cognitive Engine'
  });
});

/* ---------------- ROUTES ---------------- */
app.use('/api/dna', dnaRoutes);
app.use('/api/search', searchRoutes);

/* ---------------- SERVER START ---------------- */
const startServer = async () => {
  try {
    // Kick off DB connection but do NOT await it — allow server to start
    // immediately so the app can run in offline/demo mode.
    connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
    });

    server.on('error', (err) => {
      console.error('[Server Error]', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
};

/* ---------------- GLOBAL ERROR HANDLING ---------------- */
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
  // Do not exit the process on unhandled promise rejections — log them
  // so the app stays live in demo mode. Consider reporting these to an
  // error-tracking system in production.
});

/* ---------------- START APP ---------------- */
startServer();