const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/scholarweb';
    const conn = await mongoose.connect(connString);
    console.log(`[Database] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Don't exit the process here — allow the server to start even if the database
    // is temporarily unavailable (useful for deployments without a DB or during retries).
    // The rest of the application should handle missing DB connections gracefully.
    return null;
  }
};

module.exports = connectDB;
