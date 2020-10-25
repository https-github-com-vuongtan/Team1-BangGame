//card services
function saloon(i) {
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 2)) {
   let data = {
      name: nameplayer
    }
   $.get('/playSaloon', data);
   discardCardFromHand(i);
  }
}

function panic(i) {
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 2)) {
   let data = {
      name: nameplayer
    }
    console.log("Panic is played, but the function does not exist")
    $.get('/playPanic', data);

   //if hand now as low as life points, turn should end 
  // $.get('/checkHandSizeEndTurn', data);
  discardCardFromHand(i);

  }
}

//general format for getting index & applying function on card click (not Jquery, don't use leading # for ID)
function applytoIndexElement(elementID, theFunction) {
  var h = document.getElementById(elementID);
  for (var i = 0, len = h.children.length; i < len; i++) {
    (function (index) {
      h.children[i].onclick = function () {
        theFunction(index);
      }
    })(i);
  }

}


$(document).ready(function () {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  displayEliminations();
});

$(document).ready(function () {
  $('#quitBtn').click(function () {
    $('#quitModal').modal('open');
  });
});

$(document).ready(function () {
  $('#playAgainBtn').click(function () {
    socket.disconnect();
    window.location.reload();
  });
});


$(document).ready(function () {
  $('#confirmQuitBtn').click(function () {
    socket.disconnect();
    window.location.reload();
  });
});
  
$(document).ready(function () {
  $('#cancelQuitBtn').click(function () {
    $('#quitModal').modal('close');
  });
});
  
  
function displayEliminations() {
  socket.on("playerEliminated", data => {

    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateEliminatedDisplay(playerData, player);

        if (player.eliminated == true) {
          eliminated = true;
          console.log("eliminated " + player.name)

          //  $('#testModal').modal('open')

        }

      }
    })
  })
}

function endGame() {
  socket.on("endGame", data => {
    const outcome = JSON.parse(data)
    let winners = outcome.winnerArray;
    hideTurnButtonPanel();
    let msgString = "";
    let imgString = "";
    $("#phaseDiv").addClass("hidden");
    $("#deckInstructions").addClass("hidden");
    if ((role == outcome.winningRole) || ((outcome.winningRole == "Sheriff") && (role == ("Deputy")))) {
      $("#gameOverMessage").html("Congratulations!");
    }
    else {
      $("#gameOverMessage").html("Game Over");
    }

    if (winners.length == 1) {
      msgString = `${winners[0].role} ${winners[0].name} wins`;
    } else if (winners.length > 1) {
      msgString = `${winners[0].role} ${winners[0].name}`;
      for (i = 1; i < winners.length; i++) {
        msgString += ` and ${winners[i].role} ${winners[i].name}`;
      }
      msgString += ' win';
    } else {
      alert("Winner not determined");
    }
    switch (outcome.winningRole) {
      case ("Sheriff"):
        imgString = '<img src="assets/invertedSheriff.png" class="responsive"><img src="assets/invertedDeputy.png" class="responsive">';
        break;
      case ("Outlaw"):
        imgString = '<img src="assets/invertedOutlaw.png" class="responsive">';
        break;
      case ("Renegade"):
        imgString = '<img src="assets/invertedRenegade.png" class="responsive">';
        break;
    }
    $("#winPic").html(imgString);
    $("#winMessage").html(msgString);
    $('#endGameModal').modal('open');
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
      //if player is eliminated, cross out character card
      if (player.eliminated) {
        $(`#${position} .characterCard`).append('<img  src="assets/killed.png" class="killedCard responsive">');
      }
      console.log(mydata);
    } else {
      alert("warning: position unable to be determined!");
    }
  });
}

//draw/play/endturn services
$(document).ready(function () {
  $("#turnDraw").click(function () {
    if (phaseuser == nameplayer) {
      $.get("/endphase", function () {
        //attach card draw function for two cards *****
        console.log("Cards drawn")
      })
    }
  })
})

$(document).ready(function () {
  $("#endTurn").click(function () {
    if (phaseuser == nameplayer) {
      $.get("/endphase", function () {
        console.log("Finished playing cards")
      });

    }
  })
})



$(document).ready(function () {
  $("#cardDeck").click(function () {
    if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 1)) {
      $.get("/endphase", function () {
        //attach card draw function for two cards *****
        console.log("Cards drawn")
      })
    }
  })
})


