const apiKey = "7ebf1712accd16dd11af6377d80e86e0";
const citySearch = $("#citySearch")
const searchSubmit = $("#searchSubmit");
const searchHistory = $("#searchHistory");

function getWeather(city) {
    let latLon ='https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    fetch(latLon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log(data);

            let apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            fetch(apiURL)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data);

                });
        });
}

$("#searchField").on("submit", function (event) {
    event.preventDefault();
    getWeather(citySearch.val());

})
