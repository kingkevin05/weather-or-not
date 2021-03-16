// location variable containing latitude and longitude 
var locationObj;

// date and time
var displayCurrentDate = document.querySelector("#today")

var currentDate = moment();
displayCurrentDate.textContent = currentDate.format("dddd, MMMM Do YYYY LT");

// search button handler
var search = async function(event) {
    // getting input text
    var zipInput = $("#zipCode").val();
    // used await to wait for the geocode api call to responde before moving on 
    var response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCRrUY50j7ci46YCar9Ha27GiIPBPP5BdA&address=" + zipInput);
    if (response.ok) {
        // converts the response into object
        var data = await response.json();
        // getting the lat and long from the converted response
        locationObj = data.results[0].geometry.location;
    }
};
$("#search-button").on("click",search);






// this will keep rain cloud invisble until called upon.
document.getElementById('rain-cloud-left').style.display = 'none';
document.getElementById('rain-cloud-right').style.display = 'none';

// this will keep the smog invisble until called upon.
document.getElementById('smog-left').style.display = 'none';
document.getElementById('smog-right').style.display = 'none';