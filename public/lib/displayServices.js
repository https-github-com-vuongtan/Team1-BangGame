$(document).ready(function () {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  displayEliminations();
});

function displayEliminations() {
  socket.on("playerEliminated", data => {

    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateEliminatedDisplay(playerData, player);

        if (player.eliminated == true) {
          console.log("eliminated" + player.name)

        //  $('#testModal').modal('open')

        }

      }
    })
  })
}


function endGame() {
  socket.on("endGame", data => {
    hideTurnButtonPanel();
    switch (data.winningRole) {
      case ("Sheriff"):
        console.log("hit Sheriff endgame");
        break;
      case ("Outlaw"):
        console.log("hit Outlaw endgame");
        break;
      case ("Renegade"):
        console.log("hit renegade endgame");
        break;

    }
  })
}





//hides the join screen and displays the gameboard
const displayGameBoard = () => {
  $("#gameboard").removeClass("hidden");
  $("#welcomeScreen").addClass("hidden");
}

//hides the gameboard & shows the join screen
const displayWelcomeScreen = () => {
  $("#welcomeScreen").removeClass("hidden");
  $("#gameboard").addClass("hidden");
}

const showTurnButtonPanel = () => {
  $("#turnButtonPanel").removeClass("hidden");
}

const hideTurnButtonPanel = () => {
  $("#turnButtonPanel").addClass("hidden");
}


//used to determine player's relative position on the board (A5 to E5) - NOT distance, does not change with elimination.
function getPlayerPosition(opponentPlayer, thisPlayer) {
  let playerDiff = opponentPlayer.id - thisPlayer.id;
  let position = "unavailable";


  switch (playerDiff) {
    case 0:
      position = "a5";
      break;
    case 1:
    case -4:
      position = "b5";
      break;
    case 2:
    case -3:
      position = "c5";
      break;
    case 3:
    case -2:
      position = "d5";
      break;
    case 4:
    case -1:
      position = "e5";
      break;
    default:
      position = "unavailable";
  }
  console.log(opponentPlayer.name);
  console.log(thisPlayer.name);
  console.log(playerDiff);
  console.log(position);
  return position;
}


//will update handsize for all players (private hands) - mydata = set of player data, data=this player
function updateHandSizeDisplay(mydata, data) {
  mydata.forEach((player) => {
    let position = getPlayerPosition(player, data);
    if (position != "unavailable") {
      let divString = "";
      let positionString = "";
      let handSize = player.hand["length"];
      //(update not applicable if position is this player's)
      if (position != "a5") {
        if (handSize > 0) {
          divString += '<img src="assets/cardBack.png" class="responsive">';
          for (i = 1; i < handSize; i++) {
            divString += '<img src="assets/cardOverlap.png"class="responsive">';
          }
        }
        positionString = "#" + position + " .privateHand"; 
        $(positionString).html(divString);
      }
    }
    else {
      alert("warning: position unable to be determined!");
    }
  });
}

function updateEliminatedDisplay(mydata, data) {
  //display modal? ***** quit game or spectate? needs to be under separate individual message (after this)
  updateCardsInPlayDisplay(mydata, data);
  
  mydata.forEach((player) => {
    let position = getPlayerPosition(player, data);
    if (position != "unavailable") {
      //if player is eliminated, cross out character card (but don't need to if main player(A5))
      if (player.eliminated) {
        $(`#${position} .characterCard`).append('<img  src="assets/killed.png" class="killedCard responsive">');
      }
      console.log(mydata);
    } else {
      alert("warning: position unable to be determined!");
    }
  });
}



