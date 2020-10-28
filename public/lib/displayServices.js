//card services
//Update bullets in response to socket message
function nameUpdate() {
  socket.on("nameUpdate", data => {
    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateBulletDisplay(playerData, player)
      }
    })
  })
}

//general format for getting index & applying function on card click (not Jquery, don't use leading # for ID)
function applytoIndexElement(elementID, theFunction) {

  var h = document.getElementById(elementID);
  for (var i = 0, len = h.children.length; i < len; i++) {
    (function (funcData) {
      h.children[i].onclick = function () {
        theFunction(funcData);
      }
    })(i);
  }

}

//general format for getting index & applying function on card click (not Jquery, don't use leading # for ID)
function applytoIndexElementData(data, theFunction) {
  let elementID = data.element;

  var h = document.getElementById(elementID);
  for (var i = 0, len = h.children.length; i < len; i++) {
    (function (funcData) {
      h.children[i].onclick = function () {
        console.log(i);
        console.log(theFunction);
        //mydata.index = i;
        console.log('an indexed function ' + funcData.index)
        theFunction(funcData);
      }
    })({ index: i, gameData: data.gameData });
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
    $('#endGameModal').modal({ dismissible: false });
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
        console.log("Cards drawn")
      })
    }
  })
})


function descriptionFinder(data) {
  let altValue = data.altVal;
  console.log(altVal);
  var desc = "no description available"
  switch (altValue) {
    case ("bang"): desc = "Shoots a (reachable) player to take a life point";
      break;
    case ("beer"): desc = "Restores a life point";
      break;
    case ("missed"): desc = "Cancels the effect of a bang card"; break;
    case ("Gatling"): desc = "Shoots bang to all other players, regardless of distance";
      break;
    case ("colt45"): desc = "default weapon: shoots at a distance of 1 ";
      break;
    case ("scope"): desc = "See other players at a distance decreased by 1 ";
      break;
    case ("mustang"): desc = "Others view you at distance +1";
      break;
    case ("remington"): desc = "Shoots a distance of 3";
      break;
    case ("rev carabine"): desc = "Shoots a distance of 4";
      break;
    case ("schofield"): desc = "Shoots a distance of 2";
      break;
    case ("winchester"): desc = "Shoots a distance of 5";
      break;
    case ("volcanic"): desc = "Allows unlimited bang plays";
      break;
    case ("saloon"): desc = "All players gain a life point";
      break;
    case ("Wells"): desc = "Draw three cards";
      break;
    case ("cat balou"): desc = "Force any one player to discard a card";
      break;
    case ("stagecoach"): desc = "Draw two cards";
      break;
    case ("duel"): desc = "Target player discards a card, then you, etc; first without a bang to discard loses a life point";
      break;
    case ("general store"): desc = "Reveal as many cards as players; each player draws one";
      break;
    case ("indians"): desc = "All other players discard a bang or lose a life point";
      break;
    case ("panic"): desc = "Draw a card from a player at distance 1";
      break;
    case ("barrel"): desc = "Draw on a bang; hearts and you're missed!";
      break;
    case ("dynamite"): desc = "Draw on turn: for spades 2 to 9, lose 3 life points; else passes to the left-hand player";
      break;
    case ("Jail"): desc = "Draw on turn then discard: for hearts play on; otherwise, skip turn. ";
      break;
    case ("Suzy Lafayette"): desc = "When her hand becomes empty, she draws a card";
      break;
    case ("Vulture Sam"): desc = "When a player is eliminated he takes all their cards";
      break;
    case ("Willy The Kid"): desc = "He can play any number of bangs";
      break;
    case ("Rose Doolan"): desc = "She sees all players at a distance decreased by one";
      break;
    case ("Paul Regret"): desc = "All players see him at a distance increased by one";
      break;
    case ("Sheriff"): desc = "Kill the Outlaws and Renegade";
      break;
    case ("Outlaw"): desc = "Kill the Sheriff";
      break;
    case ("Renegade"): desc = "Be the last one in play";
      break;
    case ("Deputy"): desc = "Protect the Sheriff; kill the Outlaws and Renegade";
      break;
    case ("weapon"): desc = "Current weapon";
      break;
    case ("OutlawLeft"): desc = "An Outlaw (Kill the Sheriff) remains alive";
      break;
    case ("RenegadeLeft"): desc = "A Renegade (Be the last one in play) remains alive";
      break;
    case ("DeputyLeft"): desc = "A Deputy (Protect the Sheriff; kill the Outlaws and Renegade) remains alive";
      break;
  }
  return desc;
}


$(document).ready(function () {
  $('.leaderBoardTrigger').click(function () {

    let i = 0;
    //get the winners
    $.get("/updateWinners", res => {
      let divString = `<div></div><div style="text-align: center; size:1.5em"><b>Username</b></div><div style="text-align: center; size:1.5em"><b>Rounds to Win</b></div><div></div>`;
      console.log(res);
      let winners = jQuery.parseJSON(res);

      console.log(winners[i].username);


      for (i=0;i<10;i++){
        divString += `<div></div><div style="text-align: center">${winners[i].username}</div><div style="text-align: center">${winners[i].rounds}</div><div></div>`;
      }
      $("#leaderBoardText").html(divString);

    });
    setInterval(function(){$('#LeaderModal').modal('open')},1000);

  });
});

