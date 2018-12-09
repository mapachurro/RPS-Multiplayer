// Load the initial instructions and buttons
$(document).ready(function () {


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
  var users = database.ref("/playerInfo")


  // Create button variables that can be loaded dynamically into the messageSpace
  var nameBox = ("<form> <div class='form-group'> <label for='playerName'> </label> <input type='name' class='form-control' id='playerName' aria-describedby='name' placeholder='Enter player name'> </div> <button id='submitName' type='button' class='btn btn-primary'>Submit</button> </form> <br>");
  var playButton = ("<form> <div class='form-group'> <button id='playButton' type='button' class='btn btn-primary'>PLAY</button> </form> <br>");
  var instructions = ("<h4 id='instructions'>To play, insert your name into the box, hit submit, and then hit play!</h4> <br>");

  // Creating variables to hold the number of wins, losses, and ties. They start at 0.
  var wins = 0;
  var losses = 0;
  var ties = 0;

  // Create variables that hold references to the places in the HTML where we want to display things.

  var userChoice = "";
  var winsText = "";
  var lossesText = "";
  var tiesText = "";

  // Load initial messages
  function messageLoad() {
    $("#messageSpace").append(instructions);
    $("#messageSpace").append(nameBox);
    // $("#messageSpace").append(playButton);
  };

  messageLoad();
  
//The name submitting functionality triggers most gameplay functionality. I didn't
//initially design it like this, but Bootstrap buttons do things that are not entirely
//clear to me and screw up what you want to do with them.
  $("#submitName").click(function () {
    //Get player name
    playerName = $("#playerName").val().trim();
    console.log("player name is " + playerName)
    //Send player name to Firebase
    database.ref("/playerInfo").set({
      firebaseName: playerName,
      wins: "",
      losses: "",
    });
    //Put the player's name in a box on the page.
    $("#playerOne").text(playerName);
    $("#messageSpace").text("ATTACK!");
    console.log(users);
  });

//This is the logic for the player to select an attack.
  $("#rock").click(function () {
    if (userChoice == "") {
      userChoice = "rock"
      console.log(userChoice)
      database.ref("/playerChoice").set({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  })

  $("#paper").click(function () {
    if (userChoice == "") {
      userChoice = "paper"
      console.log(userChoice)
      database.ref("/playerChoice").set({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  })

  $("#scissors").click(function () {
    if (userChoice == "") {
      userChoice = "scissors"
      console.log(userChoice)
      database.ref("/playerChoice").set({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  })


  //Below is some RPS logic that I pulled from an old assignment. I was hoping to rewrite it/repurpose it for this game,
  //and I still plan to, once I can get the firebase aspect of things working.


  //     // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
  //     if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

  //       if ((userGuess === "r") && (computerGuess === "s")) {
  //         wins++;
  //       } else if ((userGuess === "r") && (computerGuess === "p")) {
  //         losses++;
  //       } else if ((userGuess === "s") && (computerGuess === "r")) {
  //         losses++;
  //       } else if ((userGuess === "s") && (computerGuess === "p")) {
  //         wins++;
  //       } else if ((userGuess === "p") && (computerGuess === "r")) {
  //         wins++;
  //       } else if ((userGuess === "p") && (computerGuess === "s")) {
  //         losses++;
  //       } else if (userGuess === computerGuess) {
  //         ties++;
  //       }

  //       // Display the user and computer guesses, and wins/losses/ties.
  //       userChoiceText.textContent = "You chose: " + userGuess;
  //       winsText.textContent = "wins: " + wins;
  //       lossesText.textContent = "losses: " + losses;
  //       tiesText.textContent = "ties: " + ties;
  // }

});