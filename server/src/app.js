require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDB = require('./config/db');
const dnaRoutes = require('./routes/dnaRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

/**
 * PORT selection:
 * - If `process.env.PORT` is provided (Render/production), we must use it and
 *   not attempt to change it. If it's not provided (local dev), allow a
 *   fallback and incremental retry on EADDRINUSE to avoid crashes when a
 *   previous instance is still bound to the port.
 */
let listenPort = process.env.PORT ? Number(process.env.PORT) : 5001;

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

    server.listen(listenPort, () => {
      console.log(`[Server] Running on port ${listenPort}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        // If a PORT was explicitly provided by the environment (e.g. Render),
        // respect it and exit — the platform expects the process to bind to
        // the provided port.
        if (process.env.PORT) {
          console.error(`[Server Error] Port ${listenPort} already in use (process.env.PORT set).`);
          process.exit(1);
        }

        // Local dev fallback: try the next port to avoid crashes when a
        // previously started process still holds the port.
        console.warn(`[Server] Port ${listenPort} already in use. Trying ${listenPort + 1}...`);
        listenPort += 1;
        setTimeout(() => server.listen(listenPort), 250);
        return;
      }

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