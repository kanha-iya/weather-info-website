import React, { useState } from "react";
import Select from "react-select";
import apiKeys from "./ApiKey"; // Ensure this path is correct

export default function Inputfield() {
  const [value, setValue] = useState(null);
  const [cities, set_cities] = useState([
    { value: "new-york", label: "New York" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "houston", label: "Houston" },
    { value: "new-delhi", label: "New Delhi" },
    { value: "phoenix", label: "Phoenix" },
  ]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city_name, setCityName] = useState("");
  const [weather_type, setWeatherType] = useState("");
  const [cur_temp, setCurTemp] = useState("");
  const [max_temp, setMaxTemp] = useState("");
  const [min_temp, setMinTemp] = useState("");
  const [pressure, setPressure] = useState("");
  const [wind_speed, setWindSpeed] = useState("");
  const [humidity, setHumidity] = useState("");

  // get all cities
  const fetchCities = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/population/cities"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);

      // Assuming data has a structure where cities are inside a 'cities' key
      // Adjust this according to the actual structure of the API response
      const cities = data.data.map((city) => ({
        value: city.city, // or some other identifier
        label: city.city, // or city.name, based on actual structure
      }));

      console.log(cities);
      set_cities(cities);
      // You can now use `cities` as needed in your application
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  let i = 1;
  while (i--) fetchCities();

  const fetchInfo = async () => {
    if (!value) return;

    try {
      const response = await fetch(
        `${apiKeys.base}weather?q=${value.label}&appid=${apiKeys.key}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWeather(data);
      setCityName(data.name);
      setWeatherType(data.weather[0].description);
      setCurTemp((data.main.temp - 273.15).toFixed(2));
      setMinTemp((data.main.temp_min - 273.15).toFixed(2));
      setMaxTemp((data.main.temp_max - 273.15).toFixed(2));
      setPressure(data.main.pressure);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
    console.log("Selected value:", selectedOption);
  };

  const handleSearch = () => {
    console.log("Searching for:", value);
    fetchInfo();
  };

  return (
    <>
      <div className="container py-3 border">
        <h4>Enter City Name :</h4>
        <div className="row m-0">
          <div className="col-12 d-flex gap-2">
            <Select
              className="col-8"
              value={value}
              onChange={handleChange}
              options={cities}
              placeholder="Select a city"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="info-container d-flex container flex-column justify-content-center align-items-center p-2">
        <div className="row m-0">
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">City Name :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{city_name}</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Weather Type :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{weather_type}</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Current Temperature :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{cur_temp}°C</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Max Temperature :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{max_temp}°C</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Min Temperature :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{min_temp}°C</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Pressure :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{pressure} hPa</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Humidity :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{humidity}%</p>
            </div>
          </div>
          <div className="col-12 col-md-6 item d-flex border p-3 gap-0 gap-md-3 align-items-center">
            <div className="title">
              <h6 className="m-0 ">Wind Speed :</h6>
            </div>
            <div className="title-value">
              <p className="m-0 ">{wind_speed} m/s</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
