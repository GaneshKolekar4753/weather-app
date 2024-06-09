import React from "react";
import "../css/weather.css";
const ForecastItem = ({ data }) => {
  const { date, day } = data;
  const getCurrentDays = (dt) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date(dt).getDay()
    ];
  };
  return (
    <div className="fc-item">
      <h2>{getCurrentDays(date)}</h2>
      <img src={day.condition.icon} alt="weather-icon" className="weather-icons" />
      <p>Temp: {day.avgtemp_c}°C</p>
      <p>Hum: {day.avghumidity}%</p>
    </div>
  );
};

export default ForecastItem;
