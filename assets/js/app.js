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
  var chatBase = database.ref("/chatBase");

  // Variables for local versions of database elements.
  var playerName;
  var userChoice;
  var remoteName;
  var remoteChoice;
  var chatName;
  var remoteChat;
  var userChoice;

  // Create button variables that can be loaded dynamically into the messageSpace
  var nameBox = ("<form class='needs-validation' novalidate> <div class='form-group'> <label for='playerName'> </label> <input type='name' class='form-control' id='playerName' aria-describedby='name' placeholder='Enter player name'> </div> <button id='submitName' type='button' class='btn btn-primary'>Submit</button> </form> <br>");
  var instructions = ("<h4 id='instructions'>To play, insert your name into the box, hit submit, and then hit play!</h4> <br>");

  // Creating variables to hold the number of wins, losses, and ties. They start at 0.
  var wins = 0;
  var losses = 0;
  var ties = 0;

  // Load initial messages
  //____________________________________________________________________________________
  function messageLoad() {
    $("#messageSpace").append(instructions);
    $("#messageSpace").append(nameBox);
    // $("#messageSpace").append(playButton);
  };

  //This needs to be executed with a fairly global scope, because the submitName function
  //is a global event listener.
  messageLoad();


  //This is the chat box functionality
  //_____________________________________________________________________________________
  //First of all, 
  $("#chatButton").click(function() {
    //get chat content
    playerChat = $("#chatArea").val().trim();
    //clear the chat
    $("#chatArea").val('');
    //add in the new chat comment
    $("#chatArea").val(playerName + ": " + playerChat)
    console.log("new chat: " + playerChat)
    //send chat content to Firebase
    if (playerName !== undefined) {
    chatBase.push({
      firebaseName: playerName,
      newChat: playerChat,
    })
  }
  });

  //Now let's add a firebase listener
  chatBase.orderByChild("firebaseName").on("child_added", function (snapshot) {
    chatName = snapshot.val().firebaseName;
    remoteChat = snapshot.val().newChat;
    $("#chatArea").val(chatName + ": " + remoteChat);
  });

  //It's confusing to be typing on top of someone else's text. Let's make this super-Snapchatty.
  $("#chatArea").click(function(){
    $("#chatArea").val('');
  });
  

  //The name submitting functionality triggers most gameplay functionality. I didn't
  //initially design it like this, but Bootstrap buttons do things that are not entirely
  //clear to me and screw up what you want to do with them.
  //_______________________________________________________________________________________
  $("#submitName").click(function () {
    //Get player name
    playerName = $("#playerName").val().trim();
    //Send player name to Firebase
    users.push({
      firebaseName: playerName,
      wins: "",
      losses: "",
      ties: "",
    });
    //Put the player's name in a box on the page.
    $("#messageSpace").text("ATTACK!");
    console.log("player name is " + playerName)
  });

  //This is the logic for the player to select an attack.
  //______________________________________________________________________________________
  //ROCK
  
  $("#rock").click(function () {
    if (playerName !== undefined) {
      if (userChoice == undefined) {
        userChoice = "rock"
        console.log(userChoice)
        choices.push({
          firebaseName: playerName,
          playerChoice: userChoice,
        });
      }
      else {
        $("#messageSpace").text("Wait for the other player to go!");
      }}
    else {
      $("#messageArea").append("Put in your player name and let's rock paper scissors!")
    }
  });

  //PAPER
  $("#paper").click(function () {
    if (playerName !== undefined) {
    if (userChoice == undefined) {
      userChoice = "paper"
      console.log(userChoice)
      choices.push({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else {
      $("#messageSpace").text("Wait for the other player to go!");
    }}
    else {
        $("#messageArea").append("Put in your player name and let's rock paper scissors!")
      };
    });
  //SCISSORS
  $("#scissors").click(function () {
    if (playerName !== undefined) {
    if (userChoice == undefined) {
      userChoice = "scissors"
      console.log(userChoice)
      choices.push({
        firebaseName: playerName,
        playerChoice: userChoice,
      });
    }
    else {
      $("#messageSpace").text("Wait for the other player to go!");
    }}
    else {
        $("#messageArea").append("Put in your player name and let's rock paper scissors!")
      };
    });
   
  //_______________________________________________________________________________________
  //OK. Here's where the rubber meets the road. 
  //We're going to need to get a snapshot of the node which is updated with the user data.
  users.orderByChild("firebaseName").on("child_added", function (snapshot) {
    console.log(snapshot.val().firebaseName + " joined the game ! ")
    console.log(playerName)
    //Then we need to figure out if the firebaseName is the same as playerName.
    if (playerName == snapshot.val().firebaseName) {
      //If so, then that's the local player's name
      playerName = snapshot.val().firebaseName;
      $("#playerOne").text(playerName);
    }
    //if not, then that's the remote player's move, and we should assign it to a variable. 
    else {
      remoteName = snapshot.val().firebaseName;
      $("#playerTwo").text(remoteName);
    }
  });

  //Now, for gameplay.
  //First we set up a call to the database to get it to bring a snapshot of data
  //every time we get a new player move.
  //________________________________________________________________________________________
  choices.orderByChild("firebaseName").on("child_added", function (snapshot) {
    console.log(snapshot.val().firebaseName + " chose " + snapshot.val().playerChoice + "!")
    //Then we need to figure out if the firebaseName is the same as playerName.
    if (snapshot.val().firebaseName == playerName) {
      //If so, then that's the local player's move, and we should assign it to a variable.
      userChoice = snapshot.val().playerChoice;
      //Print it to the screen.
      $("#messageSpace").text(playerName + " chose " + userChoice + "!")
    }
    //if not, then that's the remote player's move, and we should assign it to a variable. 
    else {
      remoteName = snapshot.val().firebaseName;
      remoteChoice = snapshot.val().playerChoice;
      $("#messageSpace").append(" " + remoteName + " chose their move!")
    }
    //At this point, we should be able to evaluate the moves according to RPS logic.
    evaluate();
  });

  //Below is some RPS logic that I pulled from an old assignment. I was hoping to rewrite it/repurpose it for this game,
  //and I still plan to, once I can get the firebase aspect of things working.


  // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
  //___________________________________________________________________________________________________
  function evaluate(){
    console.log("Evaluating!")
    if ((userChoice == "rock") && (remoteChoice == "scissors")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + playerName + " wins!");
      wins++;
    } else if ((userChoice == "rock") && (remoteChoice = "paper")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + remoteName + " wins!");
      losses++;
    } else if ((userChoice == "scissors") && (remoteChoice == "rock")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + remoteName + " wins!");
      losses++;
    } else if ((userChoice == "scissors") && (remoteChoice == "paper")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + playerName + " wins!");
      wins++;
    } else if ((userChoice == "paper") && (remoteChoice == "rock")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + playerName + " wins!");
      wins++;
    } else if ((userChoice == "paper") && (remoteChoice == "scissors")) {
      $("#messageSpace").text(playerName + " chose " + userChoice + " and " + remoteName + " chose " +  remoteChoice + " so " + remoteName + " wins!");
      losses++;
    } else if (userChoice == remoteChoice) {
      $("#messageSpace").text(playerName +  " and " + remoteName + " both chose the same thing! It's a tie! ");
      ties++;
    }
    $("messageSpace").append("wins: " + wins + " losses: " + losses + "ties: " + ties);
    choices.remove();

    //Ideally, we should push these local values back up to Firebase. But when I tried to enable this, I got an error.
    //Going to focus on the chat function ATM
    // users.push({
    //   firebaseName: playerName,
    //   wins: wins,
    //   losses: losses,
    //   ties: ties,
    // });
  };

  //What would be good here is a button to reset certain values so that you can play a second round and take
  //advantage of the wins/losses/ties counters.

  //We want to clear out the user data when the session closes.

  // All of our connections will be stored in this directory.
  var connectionsRef = database.ref("/connections");
  // '.info/connected' is a special location provided by Firebase that is updated
  // every time the client's connection state changes.
  var connectedRef = database.ref(".info/connected");
  // When the client's connection state changes...
  connectedRef.on("value", function (snap) {
    // If they are connected..
    if (snap.val()) {
      // Add user to the connections list.
      var con = connectionsRef.push(true);
      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
      users.onDisconnect().remove();
      choices.onDisconnect().remove();
      chatBase.onDisconnect().remove();
    }
  });


});