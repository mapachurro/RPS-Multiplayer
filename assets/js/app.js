// Load the initial instructions and buttons
$(document).ready(function() {

  function messageLoad(){
  $("#messageSpace").append(instructions);
  $("#messageSpace").append(nameBox);
};
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC6E8lKftxlROutJgnbEps-esvwbnVuoUg",
    authDomain: "rpsmultiplayer-373b6.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-373b6.firebaseio.com",
    projectId: "rpsmultiplayer-373b6",
    storageBucket: "rpsmultiplayer-373b6.appspot.com",
    messagingSenderId: "67552293713"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s"];

// Create button variables that can be loaded dynamically into the messageSpace
var nameBox = ("<form> <div class='form-group'> <label for='playerName'> </label> <input type='name' class='form-control' id='playerName' aria-describedby='name' placeholder='Enter player name'> </div> <button id='submitName' class='btn btn-primary'>Submit</button> </form> <br>");
var playButton = ("<form> <div class='form-group'> <button id='playButton' class='btn btn-primary'>PLAY</button> </form> <br>");
var instructions = ("<h4>To play, insert your name into the box, hit submit, and then hit play!</h4> <br>");

// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var wins = 0;
var losses = 0;
var ties = 0;

// Create variables that hold references to the places in the HTML where we want to display things.
var directionsText = document.getElementById("directions-text");
var userChoiceText = document.getElementById("userchoice-text");
var computerChoiceText = document.getElementById("computerchoice-text");
var winsText = document.getElementById("wins-text");
var lossesText = document.getElementById("losses-text");
var tiesText = document.getElementById("ties-text");

//Set up connected user backend
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
    console.log(connectionsRef);
  }
});
// When first loaded or when the connections list changes...
// connectionsRef.on("value", function(snap) {
//   // Display the viewer count in the html.
//   // The number of online users is the number of children in the connections list.
//   $("#watchers").text(snap.numChildren());
// });

// Load initial messages
messageLoad();
  


$("#submitName").click(function(){
console.log("name submitted");
playerName = $("#playerName").val().trim();
console.log(playerName);
$("#messageSpace").empty();
$("#messageSpace").append(playButton);
database.ref("/")



});

// Add button click listener to begin gameplay
$("#playButton").click(function(){
    console.log("timetoplay");
    $("#messageSpace").empty();
    $("#messageSpace").text("ATTACK!")

    // Additional logic here:
    // If the player is Player 1 as per Firebase,
    // Load the images into the Player 1 card.
    // Else, load the images into Player 2.
});




// This function is run whenever the user presses a key.
document.onkeyup = function(event) {

  // Determines which key was pressed.
  var userGuess = event.key;

  // Randomly chooses a choice from the options array. This is the Computer's guess.
  var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

  // Reworked our code from last step to use "else if" instead of lots of if statements.

  // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
  if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

    if ((userGuess === "r") && (computerGuess === "s")) {
      wins++;
    } else if ((userGuess === "r") && (computerGuess === "p")) {
      losses++;
    } else if ((userGuess === "s") && (computerGuess === "r")) {
      losses++;
    } else if ((userGuess === "s") && (computerGuess === "p")) {
      wins++;
    } else if ((userGuess === "p") && (computerGuess === "r")) {
      wins++;
    } else if ((userGuess === "p") && (computerGuess === "s")) {
      losses++;
    } else if (userGuess === computerGuess) {
      ties++;
    }

    // Hide the directions
    directionsText.textContent = "";

    // Display the user and computer guesses, and wins/losses/ties.
    userChoiceText.textContent = "You chose: " + userGuess;
    computerChoiceText.textContent = "The computer chose: " + computerGuess;
    winsText.textContent = "wins: " + wins;
    lossesText.textContent = "losses: " + losses;
    tiesText.textContent = "ties: " + ties;
  }
};
});