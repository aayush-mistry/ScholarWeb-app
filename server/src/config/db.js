const mongoose = require("mongoose");

/**
 * Attempt to connect to MongoDB in the background if `MONGO_URI` is provided.
 * If `MONGO_URI` is missing or the connection fails, log a warning and
 * continue — do NOT throw or exit the process. This makes the server safe
 * to run in offline/demo mode.
 */
const connectDB = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("[Database Warning] MONGO_URI not provided, running in offline/demo mode");
    return;
  }

  // Start connection attempt but do not await it — keep startup non-blocking.
  mongoose
    .connect(uri)
    .then(() => console.log("[Database] Connected"))
    .catch((err) => {
      console.log("[Database Warning] DB connection failed, running in offline mode:", err.message);
    });
};

module.exports = connectDB;
