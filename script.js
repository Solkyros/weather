// Use api key from OpenWeatherMap
import {apiKey} from "./config.js" //use default for now - switch to another during build
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather?q="; //append units and apiKey
const times = [
  [0, 4, "night"],
  [5, 11, "morning"],
  [12, 17, "afternoon"],
  [18, 24, "night"],
];
// Getting weather data for the desired city in Celsius (units = metric)
async function getWeather(city, weatherImage, weatherContainer, weatherCard, weatherError) {
  const response = await fetch(
    apiBaseUrl + city + `&units=metric&appid=${apiKey}`
  );
  if(response.status === 404){
    weatherError.style.display = "block";
    weatherContainer.style.display = "none";

  }
  else{
    let data = await response.json();
    let date = getDate(data.dt, data.timezone);
    let timing = getTimes(date.getHours());
    weatherCard.style.backgroundImage =
      timing === "morning"
        ? "linear-gradient(to bottom, #c6ffdd, #fbd786, #f7797d)"
        : timing === "afternoon"
        ? "linear-gradient(to bottom, #9796f0, #fbc7d4)"
        : " linear-gradient(to bottom, #0f0c29, #302b63, #24243e)";
    let timeOfDay = timing === "night" ? "night" : "day";
    if(timeOfDay ==="night"){
      weatherCard.style.color = "white";
    }
    else{
      weatherCard.style.color = "black";
    }
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".description").innerHTML =
      data.weather[0].description;
  
    weatherImage.src = `images/${timeOfDay}/${data.weather[0].main.toLowerCase()}.svg`;
    weatherContainer.style.display = "flex";
    weatherError.style.display = "none";

  }
}
function getTimes(hours) {
  for (let i = 0; i < times.length; i++) {
    if (hours >= times[i][0] && hours <= times[i][1]) {
      return times[i][2];
    }
  }
}
function getDate(dt, timezone) {
  const utcSeconds = parseInt(dt, 10) + parseInt(timezone, 10);
  const utcMilliseconds = utcSeconds * 1000;
  return new Date(utcMilliseconds);
}

// add event listeners to the search
window.addEventListener("DOMContentLoaded", (event) => {
  const image = document.querySelector(".weather-image");
  const input = document.querySelector(".search-input");
  const button = document.querySelector(".search-button");
  const container = document.querySelector(".weather-container");
  const card = document.querySelector(".card");
  const searchError = document.querySelector(".search-error");

  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
    }
  });
  button.addEventListener("click", function () {
    getWeather(input.value, image, container, card, searchError);
  });
});
