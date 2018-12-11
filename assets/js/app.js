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

// Variables
//________________________________________________________________________________________

  // Create database variables.
  var database = firebase.database();
  var users = database.ref("/playerInfo");
  var choices = database.ref("/playerChoice");

  // Variables for local versions of database elements.
  var playerName;
  var userChoice;
  var remoteName;
  var remoteChoice;

  // Create button variables that can be loaded dynamically into the messageSpace
  var nameBox = ("<form> <div class='form-group'> <label for='playerName'> </label> <input type='name' class='form-control' id='playerName' aria-describedby='name' placeholder='Enter player name'> </div> <button id='submitName' type='button' class='btn btn-primary'>Submit</button> </form> <br>");
  var instructions = ("<h4 id='instructions'>To play, insert your name into the box, hit submit, and then hit play!</h4> <br>");

  // Creating variables to hold the number of wins, losses, and ties. They start at 0.
  var wins = 0;
  var losses = 0;
  var ties = 0;

  // Create variables that hold references to the places in the HTML where we want to display things.
  var userChoice;
  var winsText = "";
  var lossesText = "";
  var tiesText = "";

  // Load initial messages
  //____________________________________________________________________________________
  function messageLoad() {
    $("#messageSpace").append(instructions);
    $("#messageSpace").append(nameBox);
    // $("#messageSpace").append(playButton);
  };

  //On page load, we need to check to see if there's anyone in the database--
  users.once("value")
  .then(function(snapshot) {
    var a = snapshot.exists();
    console.log(a);
  //if so, we need to enter their name into the Player One div.
    if (a == true){
      remoteName = users.firebaseName;
      console.log("Remote player name " + remoteName);
      $("#playerOne").text(remoteName);
    }
    //If not, then we don't do anything -- we wait for the player to put their name into the username div, 
    //and we populate with playerName.
    else{
    };
  });

//This needs to be executed with a fairly global scope, because the submitName function
//is a global event listener.
messageLoad();

//The name submitting functionality triggers most gameplay functionality. I didn't
//initially design it like this, but Bootstrap buttons do things that are not entirely
//clear to me and screw up what you want to do with them.
//_______________________________________________________________________________________
  $("#submitName").click(function () {
    console.log ("name click successful")
    //Get player name
    playerName = $("#playerName").val().trim();
    console.log("player name is " + playerName)
    //Send player name to Firebase
    users.push({
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
//______________________________________________________________________________________
//ROCK
  $("#rock").click(function () {
    if (userChoice == undefined) {
      userChoice = "rock"
      console.log(userChoice)
      choices.push({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  })
//PAPER
  $("#paper").click(function () {
    if (userChoice == undefined) {
      userChoice = "paper"
      console.log(userChoice)
      choices.push({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  })
//SCISSORS
  $("#scissors").click(function () {
    if (userChoice == undefined) {
      userChoice = "scissors"
      console.log(userChoice)
      choices.push({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else{
      $("#messageSpace").text("Wait for the other player to go!");
    }
  });

  //OK. Here's where the rubber meets the road. 
  //We're going to need to get a snapshot of the node which is updated with the user data.
  //Then, we have an event listener that listens for updates to the firebase userInfo node.
        //  database.ref("/playerInfo").on("value", function(snapshot) {
  
    //Set up an if loop, where hopefully, we can determine whether firebasename = playerName.
    //****THIS IS A MISTAKE HERE; the .exists method returns a Boolean. What I want is a value.
    // if (snapshot.child("firebaseName").exists() == playerName) {
    // //If so, then no worries, our user's name is already in the box.
    // }
    //  //If not, then it's the other user's name, and we need to slap that user's name in the other box.
    // else{
    //   remoteName = snapshot.child("firebaseName").exists()
    //   $("#playerTwo").text(remoteName);
    // }
    //And in the chat box, come to think of it.
  // });


  //Now, for gameplay.
  //First we set up a call to the database to get it to bring a snapshot of data
  //every time we get a new player move.
  database.ref("/playerChoice").on("value", function(snapshot) {
    console.log(snapshot); //This works. The snapshot object contains the remote player's move.

  //Then we need to figure out if the firebaseName is the same as playerName.
  if (snapshot.child("firebaseName").exists() == playerName) { //Same issue here -- NOT .exists()
  console.log(remotePlayer);
  //If so, then that's the local player's move, and we should assign it to a variable.
    userChoice = database.ref("/playerChoice").playerChoice;
  }
  //if not, then that's the remote player's move, and we should assign it to a variable. 
  else{
    remoteChoice = database.ref("/playerChoice").playerChoice;
    }
  //At this point, we should be able to evaluate the moves according to RPS logic.
  });


  //Below is some RPS logic that I pulled from an old assignment. I was hoping to rewrite it/repurpose it for this game,
  //and I still plan to, once I can get the firebase aspect of things working.


  //     // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
      if ((userChoice === "rock") || (userChoice === "paper") || (userChoice === "scissors")) {

        if ((userChoice === "rock") && (remoteChoice === "scissors")) {
          wins++;
        } else if ((userChoice === "rock") && (remoteChoice === "paper")) {
          losses++;
        } else if ((userChoice === "scissors") && (remoteChoice === "rock")) {
          losses++;
        } else if ((userChoice === "scissors") && (remoteChoice === "paper")) {
          wins++;
        } else if ((userChoice === "paper") && (remoteChoice === "rock")) {
          wins++;
        } else if ((userChoice === "paper") && (remoteChoice === "scissors")) {
          losses++;
        } else if (userChoice === remoteChoice) {
          ties++;
        }

  //       // Display the user and computer guesses, and wins/losses/ties.
  //       userChoiceText.textContent = "You chose: " + userChoice;
  //       winsText.textContent = "wins: " + wins;
  //       lossesText.textContent = "losses: " + losses;
  //       tiesText.textContent = "ties: " + ties;
  }

//We want to clear out the user data when the session closes.

// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
    users.onDisconnect().remove();
    choices.onDisconnect().remove();
  }
});


});