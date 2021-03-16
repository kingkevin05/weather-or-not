var displayCurrentDate = document.querySelector("#today")

var currentDate = moment();
displayCurrentDate.textContent = currentDate.format("dddd, MMMM Do YYYY LT");
  
