require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const dnaRoutes = require('./routes/dnaRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
// Default to 5001 to avoid common 5000 collisions; allow override via env
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
let listenPort = DEFAULT_PORT;

// Enable CORS for frontend workspace port (3000)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Configure Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'online', 
    timestamp: new Date(),
    service: 'ScholarWeb Cognitive Engine'
  });
});

// Register Module Routes
app.use('/api/dna', dnaRoutes);
app.use('/api/search', searchRoutes);

// Database Initialization & Server Launch
const startServer = async () => {
  // Attempt Database Connection
  await connectDB();

  const server = http.createServer(app);

  server.listen(listenPort, () => {
    console.log(`[Cognitive Server] Operating system live on: http://localhost:${listenPort}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`[Cognitive Server] Port ${listenPort} already in use. Trying ${listenPort + 1}...`);
      listenPort += 1;
      setTimeout(() => server.listen(listenPort), 250);
    } else {
      console.error('[Server Error]', err);
      process.exit(1);
    }
  });
};

// Handle global unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Fatal Rejection] Error: ${err.message}`);
});

startServer();
