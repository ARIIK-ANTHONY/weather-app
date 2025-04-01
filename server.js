const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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
      scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'"], // Allow external scripts and inline scripts
      styleSrc: ["'self'", "https://fonts.googleapis.com", "https://stackpath.bootstrapcdn.com", "'unsafe-inline'"], // Allow external stylesheets and inline styles
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow external fonts
      connectSrc: ["'self'", "https://oneariik.tech", "https://api.openweathermap.org"], // Allow API requests
      imgSrc: ["'self'", "data:"], // Allow images and inline data URIs
      objectSrc: ["'none'"], // Disallow <object>, <embed>, <applet>
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