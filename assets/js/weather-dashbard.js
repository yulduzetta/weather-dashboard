const apiKey = "30911b49a58afb519f2ebd3b1a6c4180";
// If there is nothing in 'localStorage', sets the 'list' to an empty array
var cityCoordinatesList =
  JSON.parse(localStorage.getItem("cityCoordinates")) || [];

var displayWeather = function () {
  // capture user input
  let cityName = document
    .querySelector("input.form-control")
    .value.toLowerCase()
    .trim();

  // get city coordinates
  getCoordinates(cityName).then((response) => {
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let coordinatesQuery = `lat=${lat}&lon=${lon}`;

    // show city in search history and store coordinates in local storage
    addCityToSearchHistory(cityName);
    addCityCoordinatesToLocalStorage(cityName, coordinatesQuery);

    // handle city weather details
    getWeatherCurrentAndForecast(coordinatesQuery).then(() => {
      // show today's weather details
      dispayTodaysWeather();

      // show 5 day weather forcast
      displayFiveDayForecast();
    });
  });
};

//**************** API CALLS ****************

//given user unput, make API call to further retrieve coordinates
var getCoordinates = async function (cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  );
  if (response.ok) {
    return response.json();
  }
  // generic msg that handles any non 200 reponse
  else alert(`Could not find "${cityName.toUpperCase()}", please try again`);
};

//given the coordinates, make API call for current and future weather conditions
var getWeatherCurrentAndForecast = async function (coordinatesQuery) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?${coordinatesQuery}&appid=${apiKey}`
  );
  if (response.ok) {
    return response.json();
  }
  // generic msg that handles any non 200 reponse
  else alert(`Something went wrong, please try again later.`);
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

// helper util which attaches the city to search history
var attachCityInfoToSearchHistory = function (cityName) {
    var cityListEl = $(".search-history");
    var cityListItemEl = document.createElement("div");
    cityListItemEl.classList.add("list-item");
    const cityNameCapitalized =
      cityName.charAt(0).toUpperCase() + cityName.slice(1);
  
    cityListItemEl.textContent = cityNameCapitalized;
    cityListEl.append(cityListItemEl);
  };

// show search history on page load
var loadCitySearchHistory = function () {
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    attachCityInfoToSearchHistory(cityCoordinatesList[i].city)
    // var cityListEl = $(".search-history");
    // var cityListItemEl = document.createElement("div");
    // cityListItemEl.classList.add("list-item");

    // // retrieve the cityname from the storage
    // var cityName = cityCoordinatesList[i].city;
    // // capitalize first letter before displaying
    // const cityNameCapitalized =
    //   cityName.charAt(0).toUpperCase() + cityName.slice(1);

    // cityListItemEl.textContent = cityNameCapitalized;
    // cityListEl.append(cityListItemEl);
  }
};

// add city to search history (only if unique)
var addCityToSearchHistory = function (cityName) {
  // add city to the list only if distinct
  for (var i = 0; i < cityCoordinatesList.length; i++) {
    if (cityCoordinatesList[i].city === cityName) {
      return;
    }
  }
  attachCityInfoToSearchHistory(cityName);
};

var dispayTodaysWeather = function () {};

var displayFiveDayForecast = function () {};

//**************** LISTENERS ****************

//**************** ON LOAD ****************
loadCitySearchHistory();
