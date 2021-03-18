// location variable containing latitude and longitude
var locationObj;
var tempValue;
var aqiValue;
var cityInput = document.querySelector("#city-name");
var searchBtn = document.querySelector("#search-button");
var cityDisplay = document.querySelector(".city");
var description = document.querySelector(".description");
var temp = document.querySelector(".temp");
var feelsLike = document.querySelector(".feels-like");
var aqi = document.querySelector(".aqi");
var humidity = document.querySelector(".humidity");
var wind = document.querySelector(".wind");
var uvi = document.querySelector(".uvi");
var message = document.querySelector(".message");
var fetchErrorMessage = document.getElementById("errorModal");

var selectElement = document.getElementById("states");
var states = [
  "AL",
  "AK",
  "AS",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FM",
  "FL",
  "GA",
  "GU",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MH",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "MP",
  "OH",
  "OK",
  "OR",
  "PW",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VI",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// error modal instead of alert
var errorModal = function() {

};


// date and time
var displayCurrentDate = document.querySelector("#today");
var currentDate = moment();
displayCurrentDate.textContent = currentDate.format("dddd, MMMM Do YYYY");

for (var i = 0; i < states.length; i++) {
  let newOption = document.createElement("option");
  newOption.value = states[i];
  newOption.innerText = states[i];
  selectElement.appendChild(newOption);
}

var getWeatherInfo = async function () {
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput.value +
    "&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319";

  var response = await fetch(apiUrl);
  if (response.ok) {
    console.log(response);
    var data = await response.json();
    var nameValue = data.name;
    var descriptionValue = data.weather[0].description;
    tempValue = data.main.temp;
    var feelsLikeValue = data.main.feels_like;
    var humidityValue = data.main.humidity;
    var windValue = data.wind.speed;
    console.log(data);
    var lat = data.coord.lon;
    var lon = data.coord.lat;
    uvIndex(data.coord.lat, data.coord.lon);
    await aqIndex(data.coord.lat, data.coord.lon);

    cityDisplay.innerHTML = nameValue + ", " + currentDate.format("LT");
    description.innerHTML = "* " + descriptionValue + " *";
    temp.innerHTML = "Temperature: " + tempValue + " °F";
    feelsLike.innerHTML = "Feels like: " + feelsLikeValue + " °F";
    humidity.innerHTML = "Humidity: " + humidityValue + "%";
    wind.innerHTML = "Wind Speed: " + windValue + " MPH";
  } else {
    alert("Error: " + response.statusText);
  }
};

function uvIndex(lat, lon) {
  var uviUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=9795009f60d5d1c3afe4e6df6002c319";
  fetch(uviUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        var uviValue = data.current.uvi;
        uvi.innerHTML = "UV Index: " + uviValue;
      });
    }
  });
}

async function aqIndex(lat, lon) {
  var aqiUrl =
    "http://api.openweathermap.org/data/2.5/air_pollution?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=9795009f60d5d1c3afe4e6df6002c319";
  console.log(aqiUrl);
  var response = await fetch(aqiUrl);

  if (response.ok) {
    console.log(response);
    var data = await response.json();
    console.log(data);
    aqiValue = data.list[0].main.aqi;
    aqi.innerHTML = "Air Quality Index: " + aqiValue;
  }
}

var conditionRecs = async function (event) {
  await getWeatherInfo();
  console.log("tempValue variable: ", tempValue);
  if (tempValue > 40 && tempValue < 50) {
    message.innerHTML = "It's nippy out! Good idea to bring a jacket if you're going outside. <br>Here are some cool events to choose from.</br>";
  }
  if (tempValue >65 || aqIndex < 50) {
    message.innerHTML = "Cowabunga! It's a nice day to spend some time outside. <br>Here's what's in the area.</br>";
  }
  if (tempValue < 40 || aqiValue > 100) {
    message.innerHTML = "Weather’s not looking too good, cheers to indoor fun! <br>Check these events out.</br>";
  }
  if (aqIndex > 50) {
    message.innerHTML = "Moderate air quality may pose a risk to those sensitive to air pollution. Consider staying inside. <br>Here are some cool events to choose from.</br>";
  }
  if (aqIndex > 100) {
    message.innerHTML = "Stay inside to avoid unhealthy air quality! <br>Here are some cool events to choose from.</br>";
  }
};

var initMap = function () {};

var convertMiles = function (miles) {
  return miles * 1609.34;
};

// search button handler
var search = async function (event) {
  // call weather function in order to get weather info
  await getWeatherInfo();
  // getting input text
  var cityInput = $("#city-name").val();
  if (tempValue > 50 && aqiValue < 100) {
    console.log(cityInput);
    var apiKeyGoogle = "AIzaSyCRrUY50j7ci46YCar9Ha27GiIPBPP5BdA";
    // used await to wait for the geocode api call to responde before moving on
    var response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?key=" +
        apiKeyGoogle +
        "&address=" +
        cityInput
    );
    if (response.ok) {
      // converts the response into object
      var data = await response.json();
      // getting the lat and long from the converted response
      locationObj = data.results[0].geometry.location;
      var service = new google.maps.places.PlacesService(
        $("#stuff-todo").get(0)
      );
      var request = {
        query: "hiking trails",
        location: new google.maps.LatLng(locationObj.lat, locationObj.lng),
        radius: convertMiles(10),
      };
      service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
        } else {
          console.log(status);
        }
      });
    }
  } else {
    $.ajax({
      type: "GET",
      url:
        "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
        cityInput +
        "&apikey=pAdhPaexdL7G6QTWjeRWLfA9jUIdgHHM",
      async: true,
      dataType: "json",
      success: function (json) {
        console.log(json._embedded.events);
        // Parse the response.
        // Do other things.
      },
      error: function (xhr, status, err) {
        // This time, we do not end up here!
      },
    });
  }
};

$("#search-button").on("click", search, conditionRecs);






















































// Aidan's code resides down here lol
// testing git push after cloning repo








// this function checks to see if the h3 contains the word cloud, if it does, then clouds will be displayed
function runTimeOut() {
    setTimeout(function(){ 
        var targetDiv = document.getElementById("get-description").innerText;
        var clouds = targetDiv.includes("cloud");
        console.log(clouds);
        if (clouds === true) {
            document.getElementById("overcast-cloud-left").style.visibility = "visible";
            document.getElementById("overcast-cloud-right").style.visibility = "visible";

            document.getElementById("rain-cloud-left").style.visibility = "hidden";
            document.getElementById("rain-cloud-right").style.visibility = "hidden";

            document.getElementById("smog-left").style.visibility = "hidden";
            document.getElementById("smog-right").style.visibility = "hidden";
        }
        var clear = targetDiv.includes("clear");
        console.log(clear);
        if (clear === true) {
            document.getElementById("overcast-cloud-left").style.visibility = "hidden";
            document.getElementById("overcast-cloud-right").style.visibility = "hidden";

            document.getElementById("rain-cloud-left").style.visibility = "hidden";
            document.getElementById("rain-cloud-right").style.visibility = "hidden";

            document.getElementById("smog-left").style.visibility = "hidden";
            document.getElementById("smog-right").style.visibility = "hidden";
        }
        var smoke = targetDiv.includes("smoke");
        console.log(smoke);
        if (smoke === true) {
            document.getElementById("overcast-cloud-left").style.visibility = "hidden";
            document.getElementById("overcast-cloud-right").style.visibility = "hidden";

            document.getElementById("rain-cloud-left").style.visibility = "hidden";
            document.getElementById("rain-cloud-right").style.visibility = "hidden";

            document.getElementById("smog-left").style.visibility = "visible";
            document.getElementById("smog-right").style.visibility = "visible";
        }
        var haze = targetDiv.includes("haze");
        console.log(haze);
        if (haze === true) {
            document.getElementById("overcast-cloud-left").style.visibility = "hidden";
            document.getElementById("overcast-cloud-right").style.visibility = "hidden";

            document.getElementById("rain-cloud-left").style.visibility = "hidden";
            document.getElementById("rain-cloud-right").style.visibility = "hidden";

            document.getElementById("smog-left").style.visibility = "visible";
            document.getElementById("smog-right").style.visibility = "visible";
        }
        var rain = targetDiv.includes("rain");
        console.log(rain);
        if (rain === true) {
            document.getElementById("overcast-cloud-left").style.visibility = "hidden";
            document.getElementById("overcast-cloud-right").style.visibility = "hidden";

            document.getElementById("rain-cloud-left").style.visibility = "visible";
            document.getElementById("rain-cloud-right").style.visibility = "visible";

            document.getElementById("smog-left").style.visibility = "hidden";
            document.getElementById("smog-right").style.visibility = "hidden";
        }
    }, 2000);
}