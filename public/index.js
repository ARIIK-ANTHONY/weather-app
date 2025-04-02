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
  const loadingIndicator = document.querySelector("#loading-indicator");
  const errorMessage = document.querySelector("#error-message");

  // Fetch API key from the backend
  function fetchApiKey() {
    return fetch("/api-key")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch API key");
        }
        return response.json();
      })
      .then((data) => {
        return data.apiKey;
      })
      .catch((error) => {
        console.error("Error fetching API key:", error);
        alert("Failed to load API key. Please try again later.");
      });
  }

  // Toggle loading indicator visibility
  function toggleLoading(show) {
    if (loadingIndicator) {
      loadingIndicator.style.display = show ? "block" : "none";
    }
  }

  // Fetch weather data
  function fetchWeather(city) {
    toggleLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => displayWeatherInfo(data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("City not found. Please try again.");
      })
      .finally(() => toggleLoading(false));
  }

  // Fetch forecast data
  function fetchForecast(city) {
    toggleLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => displayForecast(data))
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      })
      .finally(() => toggleLoading(false));
  }

  // Initialize app
  function init() {
    updateDateTime();
    setInterval(updateDateTime, 60000);
    fetchWeather("Kigali");
    fetchForecast("Kigali");
  }

  // Fetch API key and initialize the app
  fetchApiKey().then((key) => {
    apiKey = key; // Assign the fetched API key
    init(); // Initialize the app
  });
});