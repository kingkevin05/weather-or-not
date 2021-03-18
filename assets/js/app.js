// location variable containing latitude and longitude
var locationObj;
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

searchBtn.addEventListener("click", function () {
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput.value +
    "&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          var nameValue = data.name;
          var descriptionValue = data.weather[0].description;
          var tempValue = data.main.temp;
          var feelsLikeValue = data.main.feels_like;
          var humidityValue = data.main.humidity;
          var windValue = data.wind.speed;
          console.log(data);
          var lat = data.coord.lon;
          var lon = data.coord.lat;
          uvIndex(data.coord.lat, data.coord.lon);
          aqIndex(data.coord.lat, data.coord.lon);

          cityDisplay.innerHTML = nameValue + " " + currentDate.format("LT");
          description.innerHTML = descriptionValue;
          temp.innerHTML = "Temperature: " + tempValue + " °F";
          feelsLike.innerHTML = "Feels like: " + feelsLikeValue + " °F";
          humidity.innerHTML = "Humidity: " + humidityValue + "%";
          wind.innerHTML = "Wind Speed: " + windValue + " MPH";
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    // promise
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap");
    });

  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
      cityInput.value +
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
});

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

function aqIndex(lat, lon) {
  var aqiUrl =
    "http://api.openweathermap.org/data/2.5/air_pollution?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=9795009f60d5d1c3afe4e6df6002c319";
  console.log(aqiUrl);
  fetch(aqiUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        var aqiValue = data.list[0].main.aqi;
        aqi.innerHTML = "Air Quality Index: " + aqiValue;
      });
    }
  });
}

var initMap = function () {};

var convertMiles = function (miles) {
  return miles * 1609.34;
};
// search button handler
var search = async function (event) {
  // getting input text
  var cityInput = $("#city-name").val();
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
    var locationBias =
      "circle:" +
      $("#radius").val() +
      "@" +
      locationObj.lat +
      "," +
      locationObj.lng;
    var service = new google.maps.places.PlacesService($("#stuff-todo").get(0));
    var request = {
      query: "hiking trails",
      location: new google.maps.LatLng(locationObj.lat, locationObj.lng),
      radius: convertMiles($("#radius").val()),
    };
    service.textSearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
      } else {
        console.log(status);
      }
    });
  }
};

$("#search-button").on("click", search);





















// var hour = moment().hour();
//  if (condition) {

     
//  } else {
     
//  }

// // gives me 22, which is 10pm
// // setInterval every min
// // change src of img

// var now = new Date().getHours();










// this will keep rain cloud invisble until called upon.
// document.getElementById("rain-cloud-left").style.display = "none";
// document.getElementById("rain-cloud-right").style.display = "none";

// // this will keep the smog invisble until called upon.
// document.getElementById("smog-left").style.display = "none";
// document.getElementById("smog-right").style.display = "none";

// // this will keep the smog invisble until called upon.
// document.getElementById("overcast-cloud-left").style.display = "none";
// document.getElementById("overcast-cloud-right").style.display = "none";





// var targetDiv = document.getElementById("get-description").innerText;

// var btnClouds = document.getElementById("search-button");

// btnClouds.onclick = function()  //when you click the play or pause button
// {
//     if( document.getElementById("get-description").innerText== "overcast clouds" )
//     {
//         document.getElementById("overcast-cloud-left").style.display = "visible";
//         document.getElementById("overcast-cloud-right").style.display = "visible";
//     }

//     else
//     {
//         alert("it dont work")
//     }
// };

// else {
//     whatever = function() {
//         // Do something else
//     };
// }
// whatever();

// while(true){
//     // # Do things
//     if( >= 3) {

//     }
//   }



// var targetDiv = document.getElementById("get-description").innerText;
// console.log(targetDiv);

// for (let index = 0; index < array.length; index++) {
//     const element = array[index];
    
// }

// for (let index = 0; index < targetDiv.length; index++) {
//     const element = array[index];

//     if (targetDiv === "overcast clouds") {
//         alert(hello)
//     }
// }



// for (let index = 0; index < array.length; index++) {
//     const element = array[index];
    
// }
//     console.log(targetDiv);



// var targetDiv = document.getElementById("get-description").innerText;


// document.addEventListener('DOMContentLoaded', function() {
//     console.log(targetDiv);
//  }, false);


// here I will try to get clouds / smog to appear dependening on location weather description
// for example if it says overcast, clouds will appear. If it says smoke, smog will appear. If it says rain, rain clouds will appear

// var targetDiv = document.getElementById("weather-results").getElementsByClassName("description").innerText;
// console.log(targetDiv);

// var btnClouds = document.getElementById("search-button");

// btnClouds.addEventListener("click", getTargetDiv)

// function getTargetDiv(){

//     // let targetDiv = document.getElementById("get-description").innerText;
//     // console.log(targetDiv);

//     console.log(descriptionValue);






    
// }

//     let weatherDescription = targetDiv.innerText
//     console.log(weatherDescription);


//     let menu = document.getElementById('menu');
// console.log(menu.innerHTML);





// var targetDiv = document.getElementsByTagName("a");
// var searchText = "SearchingText";
// var found;

// for (var i = 0; i < aTags.length; i++) {
//   if (aTags[i].textContent == searchText) {
//     found = aTags[i];
//     break;
//   }
// }

