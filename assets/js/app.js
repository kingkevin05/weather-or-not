// location variable containing latitude and longitude
var locationObj;
var tempValue;
var aqiValue;
var isError = false;
var timerId;
var recentSearches = JSON.parse(localStorage.getItem("recents") || "[]");
var cityInput = document.querySelector("#city-name");
var searchBtn = document.querySelector("#search-button");
var nameDisplay = document.querySelector(".name");
var timeDisplay = document.querySelector(".time");
var localTime = document.querySelector("#localTime");
var description = document.querySelector(".description");
var temp = document.querySelector(".temp");
var feelsLike = document.querySelector(".feels-like");
var aqi = document.querySelector(".aqi");
var humidity = document.querySelector(".humidity");
var wind = document.querySelector(".wind");
var uvi = document.querySelector(".uvi");
var message = document.querySelector(".message");

var stuffTodo = document.getElementById("stuff-todo");
var outDoor = document.getElementById("outdoor");
var trailsPanel = document.getElementById("trails-panel");

var outdoorName = document.querySelector(".place-name");
var outdoorAddress = document.querySelector(".place-address");
var outdoorRating = document.querySelector(".place-rating");
var outdoorPhotos = document.querySelector(".photos");
var outdoorPage = 1;
const itemsPerPage = 4;
var outdoorResults;

console.log(stuffTodo);
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

function updateTime() {
  // user's local date and time
  var displayCurrentDate = document.querySelector("#today");
  var currentDate = moment();
  displayCurrentDate.textContent = currentDate.format("dddd, MMMM Do YYYY");
  localTime.innerHTML = currentDate.format("LT");
}
setInterval(updateTime, 1000);

// error modal instead of alert
var errorModalCall = function (text) {
  $("#modal-content").text("Error: " + text);
  $("#modal-footer").append(
    '<button type="button" class="btn-primary" data-mdb-dismiss="modal" aria-label="Close">OK</button>'
  );
  $("#errorModal").modal("show");
  isError = true;
};

// states dropdown
for (var i = 0; i < states.length; i++) {
  let newOption = document.createElement("option");
  newOption.value = states[i];
  newOption.innerText = states[i];
  selectElement.appendChild(newOption);
}

// modal popup for 4 seconds
var modalCall = function (text) {
  $("#modal-content").text(text);
  $("#errorModal").modal("show");
  setTimeout(function () {
    $("#errorModal").modal("hide");
  }, 4000);
};

// weather call
var getWeatherInfo = async function (city, state) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    ", " +
    state +
    ", " +
    "US" +
    "&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319";

  var response = await fetch(apiUrl);
  console.log(response);
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
    var searchTime = parseInt(data.dt);
    console.log(searchTime);
    uvIndex(data.coord.lat, data.coord.lon);
    await aqIndex(data.coord.lat, data.coord.lon);
    console.log(moment.unix(searchTime).format(" hh:mm a"));

    nameDisplay.innerHTML = nameValue;
    //  + " " + currentDate.format("LT"); (this used to be attached to the code above, but i took it out since i moved local time to upper right corner)
    // I left this ^ code commented out in case we need it later.

    description.innerHTML = "* " + descriptionValue + " *";
    temp.innerHTML = "Temperature: " + tempValue + " °F";
    feelsLike.innerHTML = "Feels like: " + feelsLikeValue + " °F";
    humidity.innerHTML = "Humidity: " + humidityValue + "%";
    wind.innerHTML = "Wind Speed: " + windValue + " MPH";
    var newWeatherItem = { city: city, state: state };

    // unshift is like .push() but to front
    recentSearches.unshift(newWeatherItem);
    // pushing array back into local storage
    localStorage.setItem("recents", JSON.stringify(recentSearches));
  } else {
    errorModalCall(response.statusText);
  }
};

// call uvi in separate onecall api
function uvIndex(lat, lon) {
  var uviUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=9795009f60d5d1c3afe4e6df6002c319";
  // clear existing timer
  clearInterval(timerId);
  fetch(uviUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          // console.log(data);
          var uviValue = data.current.uvi;
          var timeZone = data.timezone;
          // console.log(timeZone);
          timerId = setInterval(() => {
            timeDisplay.innerHTML = moment().tz(timeZone).format("h:mm A");
          }, 1000);
          uvi.innerHTML = "UV Index: " + uviValue;
        });
      } else {
        errorModalCall(response.statusText);
      }
    })
    .catch(function (error) {
      errorModalCall("Network Error: " + response.statusText);
    });
}

// call aqi inn separate air pollution api
async function aqIndex(lat, lon) {
  var aqiUrl =
    "https://api.openweathermap.org/data/2.5/air_pollution?lat=" +
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
  } else {
    errorModalCall(response.statusText);
  }
}

var initMap = function () {};

var convertMiles = function (miles) {
  return miles * 1609.34;
};

// search button handler
$("#stuff-todo").hide();
var search = async function (event) {
  var cityInput = $("#city-name").val().trim();
  // call weather function in order to get weather info states
  var state = $("#states").val();

  await getWeatherInfo(cityInput, state);

  if (isError) {
    return;
  }

  // getting input text
  if (tempValue > 50 && aqiValue < 100) {
    console.log(cityInput);

    // weather conditions
    if (tempValue > 40 && tempValue <= 55) {
      modalCall(
        "It's nippy out! Good idea to bring a jacket if you're going outside. Here's what's in the area."
      );
    }
    if (tempValue > 55 && tempValue <= 65) {
      modalCall(
        "Weather's looking cool. Bring a jacket if you're going outside, just in case. Here are some cool events to choose from."
      );
    }
    if (tempValue > 65 && aqiValue <= 50) {
      modalCall(
        "Cowabunga! It's a nice day to spend some time outside. Here's what's in the area."
      );
    }
    if (aqiValue > 50) {
      modalCall(
        "Moderate air quality may pose a risk to those sensitive to air pollution. Consider staying inside. Here are some cool events to choose from."
      );
    }
    if (aqiValue > 100) {
      modalCall(
        "Stay inside to avoid unhealthy air quality! Here are some cool events to choose from."
      );
    }

    var apiKeyGoogle = "AIzaSyCRrUY50j7ci46YCar9Ha27GiIPBPP5BdA";
    // used await to wait for the geocode api call to responde before moving on
    var response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?key=" +
        apiKeyGoogle +
        "&address=" +
        cityInput.trim() +
        ", " +
        state +
        ", " +
        "US"
    ).catch(function (error) {
      errorModalCall("Network Error");
    });

    if (isError) {
      return;
    }

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
          $("#stuff-todo").hide();
          $("#outdoor").show();
          $("#outdoor-pager").html("");
          console.log(results);
          outdoorResults = results;
          outdoorPage = 1;
          let pager = document.getElementById("outdoor-pager");

          let nextButton = document.createElement("li");
          nextButton.id = "outdoor-next";
          nextButton.class = "next";

          let rightArrow = document.createElement("a");
          rightArrow.href = "#";
          rightArrow.innerHTML = "<span aria-hidden='true'>&rarr;</span>";
          nextButton.append(rightArrow);

          let prevButton = document.createElement("li");
          prevButton.id = "outdoor-prev";
          prevButton.class = "prev";

          let leftArrow = document.createElement("a");
          leftArrow.href = "#";
          leftArrow.innerHTML = '<span aria-hidden="true">&larr;</span>'
          prevButton.append(leftArrow);

          pager.append(prevButton, nextButton);

          $("#outdoor-next").on("click", function() {
            if (outdoorPage == outdoorResults.length / itemsPerPage) {
              return;
            }
            outdoorPage += 1;
            showOutdoorActivities();
          });
          
          $("#outdoor-prev").on("click", function() {
            if (outdoorPage == 0) {
              return;
            }
            outdoorPage -= 1;
            showOutdoorActivities();
          });
          
          showOutdoorActivities();

          // weather conditions
          if (tempValue <= 55) {
            modalCall(
              "It's nippy out! Good idea to bring a jacket if you're going outside. Here's what's in the area."
            );
          } else if (tempValue > 55 && tempValue <= 65) {
            modalCall(
              "Weather's looking cool. Bring a jacket if you're going outside, just in case. Here are some cool events to choose from."
            );
          } else if (tempValue > 65 && aqiValue <= 50) {
            modalCall(
              "Cowabunga! It's a nice day to spend some time outside. Here's what's in the area."
            );
          } else if (aqiValue > 50) {
            modalCall(
              "Moderate air quality may pose a risk to those sensitive to air pollution. Consider staying inside. Here are some cool events to choose from."
            );
          }
        } else {
          errorModalCall(status);
        }
      });
    } else {
      errorModalCall(response.statusText);
    }
  } else {
    $("#outdoor").hide();
    $("#stuff-todo").show();
    modalCall(
      "Weather’s not looking too good, cheers to indoor fun! Check these events out."
    );
    getEvents(page);
    if (aqiValue > 100) {
      modalCall(
        "Stay inside to avoid unhealthy air quality! Here are some cool events to choose from."
      );
    } else {
      modalCall(
        "Weather’s not looking too good, cheers to indoor fun! Check these events out."
      );
    }
    displayResults();
  }
  function displayResults() {
    if (stuffTodo.style.display == "" || stuffTodo.style.display == "none") {
      stuffTodo.style.display = "block";
    } else {
      modalCall(
        "Weather’s not looking too good, cheers to indoor fun! Check these events out."
      );
    }
  }
};

const showOutdoorActivities = function() {
    $("#image-panel").hide();
    $("#trails-panel").html("");
    const results = outdoorResults;
    const firstItemIndex = (outdoorPage - 1) * itemsPerPage
    for (let i = firstItemIndex; i < firstItemIndex + itemsPerPage && i < results.length; i++) {
        let hikePlace = results[i].name;
        let hikeAddress = results[i].formatted_address;
        let hikeRating = results[i].rating;
        let hikePhotos;
        if (results[i].photos != undefined && results[i].photos.length > 0) {
          hikePhotos = results[i].photos[0];
        }
        console.log(hikePlace, hikeAddress, hikeRating, hikePhotos);
        var hDiv = document.createElement("a");
        hDiv.id = "outdoor-" + i;
        hDiv.className = "list-group-item";
        hDiv.href = "#";
        var newH1 = document.createElement("h4");
        newH1.className = "list-group-item-heading";
        var newH2 = document.createElement("p");
        newH2.className = "list-group-item-text";
        var newH3 = document.createElement("p");
        newH3.className = "list-group-item-text";

        newH1.textContent = hikePlace;
        newH2.textContent = hikeAddress;
        newH3.textContent = "Rating: " + hikeRating + " / 5";

        hDiv.append(newH1, newH2, newH3);
        trailsPanel.append(hDiv);
        
        $("#outdoor-" + i).click(function(event) {
          $("#trails-panel").hide();
          if (hikePhotos != undefined) {
            $("#image-panel").html("<img id=image-" + i + " src=" + hikePhotos.getUrl() + " style='height:400px;width:400px;'/>");
            $("#image-" + i).click(function(event) {
              $("#image-panel").hide();
              $("#trails-panel").show();
            })
          }
          $("#image-panel").show();
        })            
    }
}


var page = 0;
// var events = [0];

function getEvents(page) {
  var stateInput = $("#states").val();
  if (isError) {
    return;
  }

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
      "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
      cityInput.value.trim() +
      "&stateCode=" +
      stateInput +
      "&countryCode=US" +
      "&apikey=pAdhPaexdL7G6QTWjeRWLfA9jUIdgHHM&size=4&page=" +
      page +
      "&sort=date,asc",
    async: true,
    dataType: "json",
    success: function (json) {
      getEvents.json = json;
      showEvents(json);
    },
    error: function (xhr, status, err) {
      errorModalCall(err);
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
      errorModalCall(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function (eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
        // errorModalCall(err);
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
      errorModalCall(err);
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

// render previous search buttons
function renderButtons() {
  console.log(recentSearches);
  var $previousSearches = $("<h5>").text("Previous Searches");
  $("#recent-search").append($previousSearches);
  recentSearches.forEach(function (el) {
    var $button = $("<button>").text(el.city + ", " + el.state);
    $button.addClass("previousSearches");
    console.log($button);
    $("#recent-search").append($button);
    $button.on("click", function () {
      var txt = $(this).text();
      console.log(txt);
      let city = txt.split(",")[0].trim();
      let state = txt.split(",")[1].trim();
      getWeatherInfo(city, state);
      // TO UPPER CASE.....
      // doesn't pop up until we refresh the page
      
      // let lat = data.coord.lat;
      // let lon = data.coord.lon;
      uvIndex(lat, lon)
      aqIndex(lat, lon)
      // on click, 
      search();
    });
  });
}
renderButtons();

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
