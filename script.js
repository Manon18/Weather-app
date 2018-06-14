var town = document.getElementsByClassName("town")[0];

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=AIzaSyD5HBCaLXlleYknZ_CGwOO5sRoFmSGQyJ0';

      fetch(url, {method: "GET"})
        .then(function(res){
          if(!res.ok) {
            throw Error(res.status);
          }
          return res.json();
        }).then(function (data) {
            town.innerHTML =  data.results[0].address_components[3].long_name;
        });

    currentDate(lat, lon);

    });
  }
}

var coordsLocation = getLocation(); 

var date = document.getElementById("date");
var picture = document.getElementById("picture");
var currentTemperature = document.getElementById("current_temperature");
var minimum = document.getElementById("minimum");
var maximum = document.getElementById("maximum");
var summary = document.getElementById("summary");
var wind_speed = document.getElementById("wind_speed");
var pressure = document.getElementById("pressure");

function currentDate(lat, lon){

  var darksky = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/48a7c866e2fc21f03baa2b6172d5801c/' + lat + ',' + lon + '?lang=uk';

  fetch(darksky, {method: "GET"})
    .then(function(response) {
      if(!response.ok) {
        throw Error(response.status);
      }
      return response.json(); 
  }).then(function(data) {

      date.innerHTML = moment.unix(data.daily.data[0].time).format("DD-MM-YYYY");

      var picture = document.getElementById("picture");

      function skycons() {
        var skycons = new Skycons({"color": "#1a0d00"});
        skycons.add(picture, data.currently.icon);
        skycons.play();
      }

      skycons();

      currentTemperature.innerHTML = convert(data.currently.temperature).toFixed(0) + " °C";
      minimum.innerHTML = "Мінімум: " + convert(data.daily.data[0].temperatureLow).toFixed(0) + " °C";
      maximum.innerHTML = "Максимум: " + convert(data.daily.data[0].temperatureHigh).toFixed(0) + " °C";
      summary.innerHTML = data.currently.summary;
      wind_speed.innerHTML = "Швидкість вітру: " + data.currently.windSpeed;
      pressure.innerHTML = "Тиск: " + data.currently.pressure;

      var btnPrevious = document.getElementById("btn-previous");
      var btnNext = document.getElementById("btn-next");

      var dailyIndex = 0;

      function weatherNextDay() {
        date.innerHTML = moment.unix(data.daily.data[dailyIndex].time).format("DD-MM-YYYY");

        function skycons() {
          var skycons = new Skycons({"color": "#1a0d00"});
          skycons.add(picture, data.daily.data[dailyIndex].icon);
          skycons.play();
        }

        skycons();

        var currentDayWeather = (data.daily.data[dailyIndex].temperatureLow + data.daily.data[dailyIndex].temperatureHigh) / 2;

        currentTemperature.innerHTML = convert(currentDayWeather).toFixed(0) + " °C";
        minimum.innerHTML = "Мінімум: " + convert(data.daily.data[dailyIndex].temperatureLow).toFixed(0) + " °C";
        maximum.innerHTML = "Максимум: " + convert(data.daily.data[dailyIndex].temperatureHigh).toFixed(0) + " °C";
        summary.innerHTML = data.daily.data[dailyIndex].summary;
        wind_speed.innerHTML = "Швидкість вітру: " + data.daily.data[dailyIndex].windSpeed;
        pressure.innerHTML = "Тиск: " + data.daily.data[dailyIndex].pressure;
      }

      btnPrevious.style.display = "none";

      function previousDay() {
        btnPrevious.addEventListener("click", function() {

          if(dailyIndex === 1) {
            btnPrevious.style.display = "none";
          } else {
            btnNext.style.display = "inline";
          }

          if(dailyIndex > 0) {
            dailyIndex--;
            weatherNextDay();
          } 

        });
      }

      previousDay();

      function nextDay() {
        btnNext.addEventListener("click", function() {

          btnPrevious.style.display = "inline";

          if(dailyIndex < 7){
            dailyIndex++;
            weatherNextDay();
          } 

          if(dailyIndex === 7) {
            btnNext.style.display = "none";
          } else {
            btnPrevious.style.display = "inline";
          }

        });
      }

      nextDay();

  }).catch(function(error) {  
      console.log('Request failed', error);
  });
}

function convert(fahrenheit) {
  const WATER_FREEZES_DEGREES = 32;
  const DIFFERENCE_SIMPLIFIED = 1.8;

  return (fahrenheit - WATER_FREEZES_DEGREES) / DIFFERENCE_SIMPLIFIED;
}
