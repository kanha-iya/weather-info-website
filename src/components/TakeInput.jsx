import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiKeys from "./ApiKey"; // Ensure this path is correct

export default function Inputfield() {
  const [value, setValue] = useState(null);
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch city list on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/population/cities"
        );
        const data = await response.json();
        const formattedCities = data.data.map((city) => ({
          value: city.city.split("(")[0],
          label: city.city.split("(")[0],
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch weather information
  const fetchInfo = async () => {
    if (!value) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `${apiKeys.base}weather?q=${value.label}&appid=${apiKeys.key}`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      setWeather({
        cityName: data.name,
        countryCode: data.sys.country,
        weatherType: data.weather[0].description,
        weatherIcon: data.weather[0].icon,
        curTemp: (data.main.temp - 273.15).toFixed(2),
        maxTemp: (data.main.temp_max - 273.15).toFixed(2),
        minTemp: (data.main.temp_min - 273.15).toFixed(2),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  const handleSearch = () => {
    fetchInfo();
  };

  const getFlagUrl = (countryCode) => {
    return `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="container my-4">
      <div className="search-container p-4 border rounded shadow-sm bg-light">
        <h4 className="mb-3">Enter City Name:</h4>
        <div className="d-flex gap-2 align-items-center">
          <Select
            value={value}
            onChange={handleChange}
            options={cities}
            placeholder="Select a city"
            className="flex-grow-1"
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="weather-info-container mt-4">
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : weather ? (
          <div className="weather-details row text-center">
            {/* Country Flag and City Name */}
            <div className="col-12 mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={getFlagUrl(weather.countryCode)}
                  alt={weather.countryCode}
                  className="me-2"
                />
                <h5 className="m-0">
                  {weather.cityName}, {weather.countryCode}
                </h5>
              </div>
            </div>

            {/* Weather Icon and Type */}
            <div className="col-12 mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={getWeatherIconUrl(weather.weatherIcon)}
                  alt={weather.weatherType}
                  className="me-2"
                />
                <h6 className="m-0 text-capitalize">{weather.weatherType}</h6>
              </div>
            </div>

            {/* Weather Details */}
            <WeatherDetail title="Current Temperature" value={`${weather.curTemp}°C`} />
            <WeatherDetail title="Max Temperature" value={`${weather.maxTemp}°C`} />
            <WeatherDetail title="Min Temperature" value={`${weather.minTemp}°C`} />
            <WeatherDetail title="Pressure" value={`${weather.pressure} hPa`} />
            <WeatherDetail title="Humidity" value={`${weather.humidity}%`} />
            <WeatherDetail title="Wind Speed" value={`${weather.windSpeed} m/s`} />
          </div>
        ) : (
          <div className="text-center">No data available. Please search for a city.</div>
        )}
      </div>
    </div>
  );
}

const WeatherDetail = ({ title, value }) => (
  <div className="col-md-6 mb-3">
    <div className="border rounded p-3">
      <h6>{title}:</h6>
      <p className="m-0">{value}</p>
    </div>
  </div>
);
