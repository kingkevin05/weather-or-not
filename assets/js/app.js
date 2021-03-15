/**
 output: a website that displays local outdoor activities based on zip code. activities  
 
 how does the user input a zip cose?
 how will the current date be displayed in the header? api?

*/



var currentDate = document.querySelector("#today")

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

currentDate.textContent = today;


  
