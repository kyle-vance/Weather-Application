const apiKey = "7ebf1712accd16dd11af6377d80e86e0";
const citySearch = $("#citySearch");
const searchSubmit = $("#searchSubmit");
const nameTitle = $("#nameTitle");

// Function to create a blank local storage array or load previous searches
function init() {
    if (localStorage.getItem('cities') === null) {
        let cities = [];
        localStorage.setItem('cities', JSON.stringify(cities));
    };
    cityHistory();
};


init();

// Api call
function getWeather(city) {

    $("#weather").css({
        "display": "block"
    });
    $("#cityWeather").css({
        "display": "block"
    });

    let latLon = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    fetch(latLon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Grabs the lat/lon to fetch the city
            let lat = data[0].lat;
            let lon = data[0].lon;

            // Sets the city name
            let cityData = data[0].name;
            nameTitle.html(cityData);

            // API call to pull the local weather using the lat and lon
            let apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            fetch(apiURL)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data);

                    // Sets the image displaying the weather icon
                    let iconData = data.current.weather[0].icon;
                    let iconURL = "https://openweathermap.org/img/w/" + iconData + ".png";
                    $("#weather").children(1).attr("src", iconURL);

                    // Sets the date
                    let date = moment.unix(data.current.dt).format(" (MM/DD/YYYY) ");
                    $("#nameTitle").append(date);

                    // Sets current temperature
                    let currentTemp = data.current.temp;
                    $("#temperature").html("Current Temperature: " + currentTemp + " \u2109");

                    // Sets the "feels like"
                    let currentFeels = data.current.feels_like;
                    $("#feelsLike").html("Feels Like: " + currentFeels + " \u2109");

                    // Sets current wind speed
                    let currentWind = data.current.wind_speed;
                    $("#wind").html("Current Wind Speed: " + currentWind + " mph");

                    // Sets current humidity
                    let currentHumidity = data.current.humidity;
                    $("#humidity").html("Current Humitidy: " + currentHumidity + " %");

                    // Sets current UV index and assigns a class
                    let currentUV = data.current.uvi;
                    $("#uv").html("UV Index: " + currentUV);

                    if (currentUV <= 2) {
                        $("#uv").addClass("low");
                    } else if (currentUV >= 3 && currentUV <= 5) {
                        $("#uv").addClass("moderate");
                    } else if (currentUV >= 6 && currentUV <= 7) {
                        $("#uv").addClass("high");
                    } else if (currentUV >= 8 && currentUV <= 10) {
                        $("#uv").addClass("very-high");
                    } else {
                        $("#uv").addClass("extreme");
                    };

                    // 5 day forcast section loop
                    for (let i = 0; i < 5; i++) {

                        let fiveDayDate = moment().add(i + 1, 'days').format('L');
                        $("#day" + i).children("h4").html(fiveDayDate);

                        let fiveDayIcon = data.daily[i].weather[0].icon;
                        $("#day" + i).children(".cityIcon").html("<img src='http://openweathermap.org/img/wn/" + fiveDayIcon + ".png'>");

                        let fiveDayTempMax = data.daily[i].temp.max
                        $("#day" + i).children(".temperatureMax").html("High: " + fiveDayTempMax + " \u2109");

                        let fiveDayTempMin = data.daily[i].temp.min;
                        $("#day" + i).children(".temperatureMin").html("Low: " + fiveDayTempMin + " \u2109");

                        let fiveDayFeels = data.daily[i].feels_like.eve;
                        $("#day" + i).children(".feelsLike").html("Feels Like: " + fiveDayFeels + " \u2109");

                        let fiveDayWind = data.daily[i].wind_speed;
                        $("#day" + i).children(".wind").html("Wind: " + fiveDayWind + " mph");

                        let fiveDayHumidity = data.daily[i].humidity;
                        $("#day" + i).children(".humidity").html("Humidity: " + fiveDayHumidity + "%");
                    };
                });
        });

    let cityList = JSON.parse(localStorage.getItem("cities"));
    if (cityList === null) {
        cityList = [];
    }
    if (cityList.indexOf(city) === -1) {
        cityList.push(city);
        localStorage.setItem("cities", JSON.stringify(cityList));
    }

};

// Event listener to load weather on click
$("#searchField").on("submit", function (event) {
    event.preventDefault();
    getWeather(citySearch.val());
    $("#history").empty();
    cityHistory();
});

// History search button
$("#history").on("click", ".history", function () {
    $("#citySearch").val('');
    city = $(this).prop('value');
    getWeather(city);
});

// Local storage function to build buttons with the previously searched cities
function cityHistory() {

    let searchHistory = JSON.parse(localStorage.getItem("cities"));

    for (let i = 0; i < searchHistory.length; i++) {
        var city = searchHistory[i];
        $("#history").append("<input type='button' class='history' value='" + city + "'>");
    };
};




