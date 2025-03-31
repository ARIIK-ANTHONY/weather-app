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


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ||4000;

// Enable CORS and security headers
app.use(cors());
app.use(helmet());

// API Key Endpoint
app.get("/api-key", (req, res) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not found in .env file" });
  }
  res.json({ apiKey });
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

document.addEventListener("DOMContentLoaded", function () {
  let currentUnit = "metric"; // Default unit is Celsius
  let apiKey = ""; // API key will be fetched from the backend

  // DOM Elements
  const currentTimeElement = document.querySelector("#current-time");
  const currentDayElement = document.querySelector("#current-day");
  const currentTempElement = document.querySelector("#current-temperature");
  const cityElement = document.querySelector("#searched-city");
  const weatherTypeElement = document.querySelector("#weather-type");
  const humidityElement = document.querySelector("#humidity");
  const windElement = document.querySelector("#wind");
  const feelsLikeElement = document.querySelector("#feels-like");
  const pressureElement = document.querySelector("#pressure");
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");
  const celsiusLink = document.querySelector("#celcius-link");
  const fahrenheitLink = document.querySelector("#fahrenheit-link");
  const forecastContainer = document.querySelector(".week-forecast");

  // Time and date formatting
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDay(date) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  function formatShortDay(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Update current time and day
  function updateDateTime() {
    const now = new Date();
    currentTimeElement.innerHTML = formatTime(now);
    currentDayElement.innerHTML = formatDay(now);
  }

  // Update weather data display
  function displayWeatherInfo(data) {
    cityElement.innerHTML = data.name;
    currentTempElement.innerHTML = `${Math.round(data.main.temp)}°`;
    weatherTypeElement.innerHTML = data.weather[0].main;
    humidityElement.innerHTML = `${data.main.humidity}%`;
    windElement.innerHTML = `${Math.round(data.wind.speed)} ${
      currentUnit === "metric" ? "km/h" : "mph"
    }`;
    feelsLikeElement.innerHTML = `${Math.round(data.main.feels_like)}°`;
    pressureElement.innerHTML = `${data.main.pressure} hPa`;
  }

  // Update 5-day forecast
  function displayForecast(data) {
    forecastContainer.innerHTML = "";
    const forecastData = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    forecastData.forEach((forecast) => {
      const dayName = formatShortDay(forecast.dt);
      const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
      const weatherDescription = forecast.weather[0].main;
      const temperature = Math.round(forecast.main.temp);
      const forecastHTML = `
        <div class="col">
          <h3>${dayName}</h3>
          <img src="${iconUrl}" alt="${weatherDescription}" />
          <p>${weatherDescription}</p>
          <span>${temperature}°</span>
        </div>
      `;
      forecastContainer.innerHTML += forecastHTML;
    });
  }

  // Fetch weather data
  function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    axios
      .get(url)
      .then((response) => displayWeatherInfo(response.data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("City not found. Please try again.");
      });
  }

  // Fetch forecast data
  function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    axios
      .get(url)
      .then((response) => displayForecast(response.data))
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  }

  // Fetch API key from backend
  function fetchApiKey() {
    return fetch("/api-key") // Use relative path for deployment compatibility
      .then((response) => response.json())
      .then((data) => {
        apiKey = data.apiKey;
        console.log("Fetched API Key:", apiKey); // Debugging log
        if (!apiKey) {
          throw new Error("API key is missing. Check your backend configuration.");
        }
      })
      .catch((error) => {
        console.error("Error fetching API key:", error);
        alert("Failed to load API key. Please try again later.");
      });
  }

  // Event Listeners
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
      fetchForecast(city);
      searchInput.value = "";
    }
  });

  celsiusLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentUnit !== "metric") {
      currentUnit = "metric";
      fetchWeather(cityElement.textContent);
      fetchForecast(cityElement.textContent);
    }
  });

  fahrenheitLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentUnit !== "imperial") {
      currentUnit = "imperial";
      fetchWeather(cityElement.textContent);
      fetchForecast(cityElement.textContent);
    }
  });

  // Initialize app
  function init() {
    updateDateTime();
    setInterval(updateDateTime, 60000);
    fetchWeather("Kigali");
    fetchForecast("Kigali");
  }

  // Fetch API key and initialize the app
  fetchApiKey().then(init);
});
