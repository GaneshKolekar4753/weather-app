import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/weather.css";
import SearchIcon from "@mui/icons-material/Search";
import { Backdrop, CircularProgress, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ForecastItem from "./ForecastItem";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import cloudGif from "../assets/weather-animations/clouds.gif";
import clearGif from "../assets/weather-animations/clear.gif";
import sunnyGif from "../assets/weather-animations/sunny.webp";
import rainGif from "../assets/weather-animations/rain.gif";
import hrainGif from "../assets/weather-animations/heavy_rain.webp";
import sleetGif from "../assets/weather-animations/sleet.gif";
import snowGif from "../assets/weather-animations/snow.gif";
import fogGif from "../assets/weather-animations/light_fog.gif";
import icepGif from "../assets/weather-animations/ice_pellets.gif";
import thunderGif from "../assets/weather-animations/thunderstorm.gif";

const Weathe = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");

    if (savedLocation) {
      fetchWeather(savedLocation);
    } else {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error(error);
          setError("Location permission denied. Please enter a location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=02b90470659f470f96f133444240606&hour=0&days=8&q=${query}`
      );
      setWeather(response.data);
      localStorage.setItem("location", query);
    } catch (error) {
      console.error("Error fetching the weather data", error);
      setError(
        "Invalid location, Issue in fatching weather data, Please try again after some time"
      );
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(location);
    setLocation("");
  };

  const getCurrentDay = (date) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date().getDay(date)
    ];
  };

  function categorizeWC(condition) {
    switch (condition) {
      // sunny
      case "Sunny":
        return sunnyGif;
      //clear
      case "Partly cloudy":
        return clearGif;

      // Cloudy and Overcast
      case "Cloudy":
      case "Overcast":
        return cloudGif;

      // Fog and Mist
      case "Mist":
      case "Fog":
      case "Freezing fog":
        return fogGif;

      // Light rain
      case "Moderate rain at times":
      case "Moderate rain":
      case "Light freezing rain":
      case "Patchy rain possible":
      case "Patchy light rain":
      case "Light rain":
      case "Light rain shower":
      case "Torrential rain shower":
        return rainGif;

      //havy rain
      case "Heavy rain at times":
      case "Heavy rain":
      case "Moderate or heavy freezing rain":
      case "Moderate or heavy rain shower":
      case "Freezing drizzle":
      case "Heavy freezing drizzle":
      case "Patchy light drizzle":
        return hrainGif;

      // snow
      case "Patchy light snow":
      case "Light snow":
      case "Patchy moderate snow":
      case "Moderate snow":
      case "Light snow showers":
      case "Moderate or heavy snow showers":
      case "Patchy heavy snow":
      case "Heavy snow":
      case "Blowing snow":
        return snowGif;

      //sleet
      case "Light sleet":
      case "Moderate or heavy sleet":
      case "Light sleet showers":
      case "Moderate or heavy sleet showers":
        return sleetGif;

      // Ice Pellets
      case "Ice pellets":
      case "Light showers of ice pellets":
      case "Moderate or heavy showers of ice pellets":
        return icepGif;

      // Thunderstorms
      case "Thundery outbreaks possible":
      case "Patchy light rain with thunder":
      case "Moderate or heavy rain with thunder":
      case "Patchy light snow with thunder":
      case "Moderate or heavy snow with thunder":
      case "Blizzard":
        return thunderGif;

      default:
        return "";
    }
  };

  const handleClose=()=>{
    setLoading(false);
  }

  return (
    <div className="weather-container">
      <h1>Weather App</h1>

      <div className="input-wrapper">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </button>
        </form>
      </div>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {error && <p>{error}</p>}
      {!error && weather && (
        <>
          <div className="current">
            {/* {console.log("text",categorizeWC(weather.current.condition.text))} */}
            <div
              className="left-content"
              style={{
                backgroundImage: `url(${categorizeWC(
                  weather.current.condition.text
                )})`,
                backgroundRepeat: "no-repeat",

                backgroundSize: "100% 100%",
              }}
            >
              <div className="c-title">
                <h2>{`${weather.location.name}, ${weather.location.region}, ${weather.location.country}`}</h2>
                <p>{`${getCurrentDay(weather.current.last_updated)}, ${
                  weather.current.last_updated
                }`}</p>
              </div>
              <div className="c-icon">
                <img
                  src={weather.current.condition.icon}
                  alt="weather_icon"
                  className="weather-icon"
                />
                <h1>{weather.current.temp_c}°C</h1>
              </div>
              <h3>{weather.current.condition.text}</h3>
            </div>
            <div className="devider"></div>
            <div className="right-content">
              <h2>
                Feels Like:&nbsp;&nbsp;&nbsp;{weather.current.feelslike_c}°C
              </h2>
              <div className="r-flex">
                <ArrowUpwardIcon />
                <h4>Max Temp:</h4>
                {/* {console.log("temp",weather.forecast.forecastday)} */}
                <h4>{weather.forecast.forecastday[0].day.maxtemp_c}°C</h4>
              </div>
              <div className="r-flex">
                <ArrowDownward />
                <h4>Min Temp:</h4>
                <h4>{weather.forecast.forecastday[0].day.mintemp_c}°C</h4>
              </div>
              <div className="r-flex">
                <WaterDropIcon />
                <h4>Humidity:</h4>
                <h4>&nbsp;{weather.current.humidity}%</h4>
              </div>
              <div className="r-flex">
                <AirIcon />
                <h4>Wind speed:</h4>
                <h4>{weather.current.wind_kph}km/hr</h4>
              </div>
              <div className="r-flex">
                <CompareArrowsIcon />
                <h4>Pressue:</h4>
                <h4>&nbsp;&nbsp;&nbsp;&nbsp;{weather.current.pressure_mb}mb</h4>
              </div>
            </div>
          </div>
          <div className="forecast">
            <h2>Expected forecast</h2>
            <div className="fc-container">
              {weather.forecast.forecastday.map((f_day, index) => {
                if (index !== 0) {
                  return (
                    <ForecastItem
                      key={index}
                      data={{
                        date: f_day.date,
                        day: f_day.day,
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weathe;
