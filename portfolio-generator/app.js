// .slice() returns everythign from first index as 2nd arg
const profileDataArgs = process.argv.slice(2, process.argv.length);
console.log(profileDataArgs);

// no parentheses around profileDataArr parameter
const printProfileData = profileDataArr => {
  for (let i = 0; i < profileDataArr.length; i++) {
    console.log(profileDataArr[i]);
  }
};

console.log("================");

//   is the same as....
// forEach executes function on each element of array using value
//  of element at that iteration as argument
profileDataArr.forEach(profileItem => console.log(profileItem));

printProfileData(profileDataArgs);
