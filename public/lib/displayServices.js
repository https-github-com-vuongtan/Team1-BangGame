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

function saloon(sData) {
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 2)) {
    let data = {
      index: sData.index,
      name: nameplayer
    }
    $.get('/playSaloon', data);
    discardCardFromHand(data);
  }
}

function panic(pData) {
 let gameData = pData.gameData;
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 2)) {
    
    //start with default distance values (custom modification for panic)
    let reachDistance = 1;
    let b5distance = 1;
    let c5distance = 2;
    let d5distance = 2;
    let e5distance = 1;
    let divString = "";

    gameData.forEach((player, pIndex) => {
      if (player.name == nameplayer) {
        if (player.scope) {
          reachDistance++
        }
        divString = `<div class="card-image">
          <img data-panictarget={pIndex} src="assets/cards/${gameData[pIndex].character}.png" alt="${gameData[pIndex].character}" class="responsive ${gameData[pIndex].character}"></div>
          <div class="card-content">${gameData[pIndex].name}</div>`
        $(`#a5panicPlayerModal`).html(divString);

        gameData.forEach((opponent) => {

          let position = getPlayerPosition(opponent, player)
          switch (position) {
            case ("b5"):
              if (opponent.mustang) {
                b5distance++
              }
              if (opponent.eliminated) {
                c5distance--
              }
              break;
            case ("c5"):
              if (opponent.mustang) {
                c5distance++
              }
              break;

            case ("d5"):
              if (opponent.mustang) {
                d5distance++
              }
              break;

            case ("e5"):
              if (opponent.mustang) {
                e5distance++
              }
              if (opponent.eliminated) {
                d5distance--
              }
              break;
          }

        });

        gameData.forEach((opponent, oIndex) => {

          position = getPlayerPosition(opponent, player)
          switch (position) {

            case ("c5"):
              if (!opponent.eliminated && (reachDistance >= c5distance)) {
                divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                <div class="card-content">${gameData[oIndex].name}</div>`
                $(`#${position}panicPlayerModal`).html(divString)
              } else {
                $(`#${position}panicPlayerModal`).html("")
              }
              break;

            case ("b5"):
              if (!opponent.eliminated && (reachDistance >= b5distance)) {
                divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                <img  src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                <div class="card-content">${gameData[oIndex].name}</div>`
                $(`#${position}panicPlayerModal`).html(divString)
              } else {
                $(`#${position}panicPlayerModal`).html("")
              }
              break;
            case ("e5"):
              if (!opponent.eliminated && (reachDistance >= e5distance)) {
                divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                <div class="card-content">${gameData[oIndex].name}</div>`
                $(`#${position}panicPlayerModal`).html(divString)
              } else {
                $(`#${position}panicPlayerModal`).html("")
              }
              break;

            case ("d5"):
              if (!opponent.eliminated && (reachDistance >= d5distance)) {
                divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                <div class="card-content">${gameData[oIndex].name}</div>`
                $(`#${position}panicPlayerModal`).html(divString)
              } else {
                $(`#${position}panicPlayerModal`).html("")
              }
              break;
          }

        });

      }
    })

    $(`#panicPlayerSelectModal`).modal('open');

    divString = "";
    let data = {
      cardIndex: pData.index,
      name: nameplayer,
      gameData: pData.gameData
    }
    //use gameData and targetPlayer to display targetPlayer's hand info #panicCardsInPlay  
    $(`.panicPlayer`).click(function () {
      console.log(`player ${$(this).data("panictarget")} selected`);
      let targetIndex = parseInt($(this).data("panictarget"));
      let targetPlayer = gameData[targetIndex];
      divString = "";
      //display selected opponent's cards in hand
      if (targetPlayer.weapon != 'colt45') {
        divString += `<img src="assets/cards/${targetPlayer.weapon}.png" alt="${targetPlayer.weapon}" class="responsive panicCard" data-paniccard="${targetPlayer.weapon}">`;
      }
      if (targetPlayer.scope) {
        divString += `<img src="assets/cards/scope.png" alt="scope" class="responsive panicCard" data-paniccard="scope">`;
      }
      if (targetPlayer.mustang) {
        divString += `<img src="assets/cards/mustang.png" alt="mustang" class="responsive panicCard" data-paniccard="mustang">`;
      }
      if (targetPlayer.barrel) {
        divString += `<img src="assets/cards/barrel.png" alt="barrel" class="responsive panicCard" data-paniccard="barrel">`;
      }
      if (targetPlayer.jail) {
        divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive panicCard" data-paniccard="jail">`;
      }
      if (targetPlayer.dynamite) {
        divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive panicCard" data-paniccard="dynamite">`;
      }

      $("#panicCardsInPlay").html(divString);

      //if private hand<0, display nothing, otherwise present mystery card
      if (targetPlayer.hand.length > 0) {
        divString = '<img src="assets/CardBackVertical.png" class= "responsive panicCard" data-paniccard="mystery"><div>Random private hand card</div>';
        $("#panicPrivateHand").html(divString);
      } else {
        $("#panicPrivateHand").html("");
      }
      $(`#panicCardSelectModal`).modal('open');

      $(`.panicCard`).click(function () {

        let targetCard = $(this).data("paniccard");

        let hData = {
          index: data.cardIndex,
          name: nameplayer,
          targetPlayerIndex: targetIndex,
          targetCard: targetCard
        }

        $.get('/playPanic', hData);
        discardCardFromHand(hData);
        $(`#panicCardSelectModal`).modal('close');
        $(`#panicPlayerSelectModal`).modal('close');
      });
    });
  }
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
    $('#endGameModal').modal({dismissible: false});
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


