var currentDate = document.querySelector("#today")

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

currentDate.textContent = today;

// option using moment.js

var displayCurrentDay = document.querySelector("#format")

var currentDay = moment();
displayCurrentDay.textContent = currentDay.format("dddd, MMMM Do YYYY LT");
  
