const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Validate environment variables
if (!process.env.API_KEY) {
  console.error("Error: API_KEY is not set in the .env file");
  process.exit(1);
}

// Enable CORS, security headers, and logging
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// API Key Endpoint
app.get("/api-key", (req, res) => {
  const apiKey = process.env.API_KEY;
  res.json({ apiKey });
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Fallback for SPA (if needed)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});