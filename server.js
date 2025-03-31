const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express(); // Declare the app variable here
const PORT = process.env.PORT || 4000;

// Validate environment variables
if (!process.env.API_KEY) {
  console.error("Error: API_KEY is not set in the .env file");
  process.exit(1);
}

// Enable CORS, security headers, and logging
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com"], // Allow external scripts like Axios
      connectSrc: [
        "'self'",
        "http://localhost:4000", // Allow API requests to your server
        "https://api.openweathermap.org", // Allow OpenWeatherMap API requests
      ],
    },
  })
);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
