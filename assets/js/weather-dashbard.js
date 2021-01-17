const apiKey = "30911b49a58afb519f2ebd3b1a6c4180";
// If there is nothing in 'localStorage', sets the 'list' to an empty array
var cityCoordinatesList =
  JSON.parse(localStorage.getItem("cityCoordinates")) || [];

var displayWeather = function () {
  // WHEN I search for a city
  // THEN I am presented with current and future conditions for that city
  // and that city is added to the search history

  //capture user input
  let cityName = document.querySelector("input.form-control").value.toLowerCase();
  getCoordinates(cityName).then((response) => {
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let coordinatesQuery = `lat=${lat}&lon=${lon}`;
    getWeatherCurrentAndForecast(coordinatesQuery);
    addCityCoordinatesToLocalStorage(cityName, coordinatesQuery);
  });
};

//**************** API CALLS ****************

//given user unput, make API call to further retrieve coordinates
var getCoordinates = function (cityName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
    // generic msg that handles any non 200 reponse
    else alert(
      `Sorry we the city you provided as "${cityName.toUpperCase()}" was not found, please try again`
    );
  });
};

//given the coordinates, make API call for current and future weather conditions
var getWeatherCurrentAndForecast = function (coordinatesQuery) {
  //lat=30.2672&lon=-97.7431
  //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?${coordinatesQuery}&appid=${apiKey}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
    // generic msg that handles any non 200 reponse
    else alert(`Something went wrong, please try again later.`);
  });
  //TODO: Error handlers
};

//**************** LOCAL STORAGE MANIPULATION ****************

//given city coordinates, add city and its coordinates to localStorage
var addCityCoordinatesToLocalStorage = function (cityName, coordinatesQuery) {
  // push city to the list only if distinct
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    //only add distinct coordinates
    if (cityCoordinatesList[i].city === cityName) {
      return;
    }
  }
  let cityCoordinates = {
    city: cityName,
    coordinatesQuery: coordinatesQuery,
  };
  cityCoordinatesList.push(cityCoordinates);
  localStorage.setItem("cityCoordinates", JSON.stringify(cityCoordinatesList));
};

//**************** DOM MANIPULATION ****************

//**************** LISTENERS ****************
