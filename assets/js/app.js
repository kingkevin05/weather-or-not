// location variable containing latitude and longitude
var locationObj;
var tempValue;
var aqiValue;
var cityInput = document.querySelector("#city-name");
var searchBtn = document.querySelector("#search-button");
var cityDisplay = document.querySelector(".city");
var localTime = document.querySelector("#localTime");
var description = document.querySelector(".description");
var temp = document.querySelector(".temp");
var feelsLike = document.querySelector(".feels-like");
var aqi = document.querySelector(".aqi");
var humidity = document.querySelector(".humidity");
var wind = document.querySelector(".wind");
var uvi = document.querySelector(".uvi");

var stuffTodo = document.getElementById("stuff-todo")

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
localTime.innerHTML = currentDate.format("LT");

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


    var response = await fetch(apiUrl)
    if (response.ok) {
        console.log(response);
        var data = await response.json()
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

        cityDisplay.innerHTML = nameValue;
        //  + " " + currentDate.format("LT"); (this used to be attached to the code above, but i took it out since i moved local time to upper right corner)
        // I left this ^ code commented out in case we need it later.
        
        description.innerHTML = descriptionValue;
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
   
    getEvents(page);

    displayResults();
  }
  function displayResults() {
    
 
    if(stuffTodo.style.display == '' || stuffTodo.style.display == 'none'){
         stuffTodo.style.display = 'block';
    }
    else {
         stuffTodo.style.display = 'none';
    }
 }
};

var page = 0;
// var events = [0];

function getEvents(page) {
  $("#events-panel").show();
  $("#attraction-panel").hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages - 1) {
      page = 0;
    }
  }

  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?city=" + cityInput.value + "&apikey=pAdhPaexdL7G6QTWjeRWLfA9jUIdgHHM&size=4&page=" +
      page,
    async: true,
    dataType: "json",
    success: function (json) {
      getEvents.json = json;
      showEvents(json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showEvents(json) {
  var items = $("#events .list-group-item");
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i = 0; i < events.length; i++) {
    item.children(".list-group-item-heading").text(events[i].name);
    item
      .children(".list-group-item-text")
      .text(events[i].dates.start.localDate);
    try {
      item
        .children(".venue")
        .text(
          events[i]._embedded.venues[0].name +
            " in " +
            events[i]._embedded.venues[0].city.name +
            ", " +
            events[i]._embedded.venues[0].state.name
        );
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function (eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
        console.log(err);
      }
    });
    item = item.next();
  }
}

$("#prev").click(function () {
  getEvents(--page);
});

$("#next").click(function () {
  getEvents(++page);
});

function getAttraction(id) {
  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/attractions/" +
      id +
      ".json?apikey=pAdhPaexdL7G6QTWjeRWLfA9jUIdgHHM",
    async: true,
    dataType: "json",
    success: function (json) {
      showAttraction(json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showAttraction(json) {
  $("#events-panel").hide();
  $("#attraction-panel").show();

  $("#attraction-panel").click(function () {
    getEvents(page);
  });

  $("#attraction .list-group-item-heading").first().text(json.name);
  $("#attraction img").first().attr("src", json.images[0].url);
  $("#classification").text(
    json.classifications[0].segment.name +
      " - " +
      json.classifications[0].genre.name +
      " - " +
      json.classifications[0].subGenre.name
  );
}

$("#search-button").on("click", search);
































// Aidan's code resides down here lol

// testing git push after cloning repo









// this function checks to see if the h3 contains the word cloud, if it does, then clouds will be displayed
function runTimeOut() {
  setTimeout(function () {
    var targetDiv = document.getElementById("get-description").innerText;
    var clouds = targetDiv.includes("cloud");
    console.log(clouds);
    if (clouds === true) {
      document.getElementById("overcast-cloud-left").style.visibility =
        "visible";
      document.getElementById("overcast-cloud-right").style.visibility =
        "visible";

      document.getElementById("rain-cloud-left").style.visibility = "hidden";
      document.getElementById("rain-cloud-right").style.visibility = "hidden";

      document.getElementById("smog-left").style.visibility = "hidden";
      document.getElementById("smog-right").style.visibility = "hidden";
    }
    var clear = targetDiv.includes("clear");
    console.log(clear);
    if (clear === true) {
      document.getElementById("overcast-cloud-left").style.visibility =
        "hidden";
      document.getElementById("overcast-cloud-right").style.visibility =
        "hidden";

      document.getElementById("rain-cloud-left").style.visibility = "hidden";
      document.getElementById("rain-cloud-right").style.visibility = "hidden";

      document.getElementById("smog-left").style.visibility = "hidden";
      document.getElementById("smog-right").style.visibility = "hidden";
    }
    var smoke = targetDiv.includes("smoke");
    console.log(smoke);
    if (smoke === true) {
      document.getElementById("overcast-cloud-left").style.visibility =
        "hidden";
      document.getElementById("overcast-cloud-right").style.visibility =
        "hidden";

      document.getElementById("rain-cloud-left").style.visibility = "hidden";
      document.getElementById("rain-cloud-right").style.visibility = "hidden";

      document.getElementById("smog-left").style.visibility = "visible";
      document.getElementById("smog-right").style.visibility = "visible";
    }
    var haze = targetDiv.includes("haze");
    console.log(haze);
    if (haze === true) {
      document.getElementById("overcast-cloud-left").style.visibility =
        "hidden";
      document.getElementById("overcast-cloud-right").style.visibility =
        "hidden";

      document.getElementById("rain-cloud-left").style.visibility = "hidden";
      document.getElementById("rain-cloud-right").style.visibility = "hidden";

      document.getElementById("smog-left").style.visibility = "visible";
      document.getElementById("smog-right").style.visibility = "visible";
    }
    var rain = targetDiv.includes("rain");
    console.log(rain);
    if (rain === true) {
      document.getElementById("overcast-cloud-left").style.visibility =
        "hidden";
      document.getElementById("overcast-cloud-right").style.visibility =
        "hidden";

      document.getElementById("rain-cloud-left").style.visibility = "visible";
      document.getElementById("rain-cloud-right").style.visibility = "visible";

      document.getElementById("smog-left").style.visibility = "hidden";
      document.getElementById("smog-right").style.visibility = "hidden";
    }
  }, 2000);
}
