import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "7b904fb8501b854c61015010c7ecddf4"; // Replace with your API key
const DEFAULT_CITY = "New York";

const BACKGROUND_IMAGES = {
  default: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg", 
  rain: "https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg", // New working Rain background
};

function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState("default");

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
      updateWeatherEffect(response.data.weather[0].main);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("City not found. Please try again.");
    }
  };

  const updateWeatherEffect = (condition) => {
    if (condition.includes("Rain")) {
      setWeatherCondition("rain");
    } else {
      setWeatherCondition("default");
    }
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGES[weatherCondition]})`,
      }}
    >
      {/* Rain Animation */}
      {weatherCondition === "rain" && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="rain"></div>
        </div>
      )}

      {/* Weather Card */}
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg text-center w-[400px]">
        <h1 className="text-3xl font-bold mb-4">Weather App</h1>

        {/* Search Bar */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg border border-gray-300 bg-gray-700 bg-opacity-50 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-all"
          >
            Search
          </button>
        </div>

        {/* Weather Info */}
        {weather && (
          <div>
            <h2 className="text-2xl font-semibold">
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-20 mx-auto"
            />
            <p className="text-lg">{weather.weather[0].main}</p>
            <p className="text-4xl font-bold">{weather.main.temp}°C</p>
            <p className="text-sm">Feels like {weather.main.feels_like}°C</p>
          </div>
        )}
      </div>

      {/* Rain Animation Style */}
      <style>
        {`
        .rain {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url("https://i.imgur.com/NvJ6BLk.png");
          background-size: cover;
          opacity: 0.4;
          animation: rain 0.3s linear infinite;
        }

        @keyframes rain {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        `}
      </style>
    </div>
  );
}

export default App;
