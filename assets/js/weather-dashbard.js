const apiKey = "30911b49a58afb519f2ebd3b1a6c4180";
// If there is nothing in 'localStorage', sets the 'list' to an empty array

var cityCoordinatesList =
  JSON.parse(localStorage.getItem("cityCoordinates")) || [];

let currentCity = "";

var displayWeather = function () {
  currentCity = getUserInput();
  getCoordinates(currentCity).then((response) => {
    // extract given city's lat and lon to construct coordinates query string params
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let coordinatesQuery = `lat=${lat}&lon=${lon}`;

    // show city in search history and store coordinates in local storage
    addCityToSearchHistory(currentCity, coordinatesQuery);
    addCityCoordinatesToLocalStorage(currentCity, coordinatesQuery);

    // handle city weather details
    getWeatherCurrentAndForecast(coordinatesQuery).then((response) => {
      // show today's weather details
      dispayCurrentWeather(response);
      // show 5 day weather forecast
      displayFiveDayForecast(response);
    });
  });
};

//**************** API CALLS ****************

//given user unput, make API call to further retrieve coordinates
var getCoordinates = async function (currentCity) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}`
  );
  if (response.ok) {
    return response.json();
  }
  // generic msg that handles any non 200 reponse
  else alert(`Could not find "${currentCity.toUpperCase()}", please try again`);
};

//given the coordinates, make API call for current and future weather conditions
var getWeatherCurrentAndForecast = function (coordinatesQuery) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?${coordinatesQuery}&units=imperial&appid=${apiKey}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
    // generic msg that handles any non 200 reponse
    else alert(`Something went wrong, please try again later.`);
  });
};

//**************** LOCAL STORAGE MANIPULATION ****************

// on initial page load
var onInitialPageLoad = function () {
  loadCitySearchHistory();
  setDefaultForecast();
};

// show search history on page load
var loadCitySearchHistory = function () {
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    attachCityInfoToSearchHistory(
      cityCoordinatesList[i].city,
      cityCoordinatesList[i].coordinatesQuery
    );
  }
};

// capture user input
var getUserInput = function () {
  return document
    .querySelector("input.form-control")
    .value.toLowerCase()
    .trim();
};

// add city to search history (only if unique)
var addCityToSearchHistory = function (currentCity, coordinatesQuery) {
  // add city to the list only if distinct
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    if (cityCoordinatesList[i].city === currentCity) {
      return;
    }
  }
  attachCityInfoToSearchHistory(currentCity, coordinatesQuery);
};

// given city coordinates, add city and its coordinates to localStorage
var addCityCoordinatesToLocalStorage = function (
  currentCity,
  coordinatesQuery
) {
  // push city to the list only if distinct
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    //only add distinct coordinates
    if (cityCoordinatesList[i].city === currentCity) {
      return;
    }
  }
  let cityCoordinates = {
    city: currentCity,
    coordinatesQuery: coordinatesQuery,
  };
  cityCoordinatesList.push(cityCoordinates);
  localStorage.setItem("cityCoordinates", JSON.stringify(cityCoordinatesList));
};

// // make api call to default city from the local storage
var setDefaultForecast = function () {
  let defaultCity;
  let defaultCityCoordinatesQuery;
  if (!cityCoordinatesList.length) {
    defaultCity = "Harare"; // Capital of Zimbabwe -- time to learn geography
    defaultCityCoordinatesQuery = "lat=31.0539&lon=-17.8294";
  } else {
    defaultCity = cityCoordinatesList[0].city;
    defaultCityCoordinatesQuery = cityCoordinatesList[0].coordinatesQuery;
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?${defaultCityCoordinatesQuery}&units=imperial&appid=${apiKey}`
  ).then((response) => {
    if (response.ok) {
      response.json().then((response) => {
        dispayCurrentWeather(response, defaultCity);
        displayFiveDayForecast(response);
      });
    }
    // generic msg that handles any non 200 reponse
    else alert(`Something went wrong, please try again later.`);
  });
};

// capitalize every first letter of each word within a given string
var titleCase = function (str) {
  // https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // return the joined string
  return splitStr.join(" ");
};

// display current weather
var dispayCurrentWeather = function (response, cityName = currentCity) {
  var weatherDetailsHeaderText = `${titleCase(cityName)} (${moment().format(
    "MM/DD/YYYY"
  )})`;
  document.querySelector(".today h1").textContent = weatherDetailsHeaderText;
  document.querySelector("#temperature span").textContent =
    response.current.temp;
  document.querySelector("#humidity span").textContent =
    response.current.humidity;
  document.querySelector("#wind-speed span").textContent =
    response.current.wind_speed;
  document.querySelector("#uv-index span").textContent = response.current.uvi;
};

// display 5 day forecast
var displayFiveDayForecast = function (response) {
  let formattedTimestamp = function (timestamp) {
    return moment.unix(timestamp).format("MM/DD/YYYY");
  };
  for (var i = 0; i <= 4; i++) {
    //moment.unix(value).format("MM/DD/YYYY");
    $(`[data-attr='${i}'] h3 span`).text(
      `${formattedTimestamp(response.daily[i].dt)}`
    );
    $(`[data-attr='${i}'] .card-temperature span`).text(
      `${response.daily[i].temp.day}`
    ); //response.daily[0].temp.day
    $(`[data-attr='${i}'] .card-humidity span`).text(
      `${response.daily[i].humidity}`
    ); //response.daily[0].humidity
    $(`[data-attr='${i}'] .card-weather-icon span`).text("ICON");
  }
};

//**************** MISC UTILS ****************

// attach new city to the search history
var attachCityInfoToSearchHistory = function (cityName, coordinatesQuery) {
  var cityListEl = $(".search-history");
  var cityListItemEl = document.createElement("a");
  var coordinatesQuerySpan = document.createElement('span');
  coordinatesQuerySpan.innerHTML = coordinatesQuery;
  coordinatesQuerySpan.style.display = 'none';

  cityListItemEl.setAttribute("href", "");
  const cityNameCapitalized = titleCase(cityName);

  cityListItemEl.classList.add("list-item");
  cityListItemEl.textContent = cityNameCapitalized;
  cityListEl.append(cityListItemEl);
  cityListItemEl.append(coordinatesQuerySpan);

};

//**************** LISTENERS ****************

//**************** ON LOAD ****************
onInitialPageLoad();
