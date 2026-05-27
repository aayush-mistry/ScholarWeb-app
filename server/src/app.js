require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDB = require('./config/db');
const dnaRoutes = require('./routes/dnaRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

/**
 * ✅ IMPORTANT (Render requirement)
 * Must use process.env.PORT only
 * No fallback port switching logic
 */
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
    // Connect DB first
    await connectDB();

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
  process.exit(1);
});

/* ---------------- START APP ---------------- */
startServer();