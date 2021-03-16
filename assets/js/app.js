// location variable containing latitude and longitude 
var locationObj;
var currentDate = document.querySelector("#today")

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

currentDate.textContent = today;

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
  
