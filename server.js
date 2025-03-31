const express = require('express');
const axios = require('axios');
const cors = require('cors');  // To handle Cross-Origin Resource Sharing (CORS)
const app = express();
const port = 4000;

app.use(cors());  // Enable CORS for all routes

// Replace with your OpenWeatherMap API key
const apiKey = 'YOUR_API_KEY';

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    res.json(weatherResponse.data);  // Send weather data to the frontend
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

