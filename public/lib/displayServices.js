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


//Update bullets in response to socket message
function displayCardsInPlay() {
  socket.on("cardsInPlayUpdate", data => {
    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateCardsInPlayDisplay(playerData, player)
      }
    })
  })
}

function updateCardsInPlayDisplay(mydata, data) {
  let outlawNumber = 0;
  mydata.forEach((player) => {
    let position = getPlayerPosition(player, data);
    if (position != "unavailable") {
      let divString = "";
      //if player is eliminated, show role card only (but don't need to if main player(A5))
      if (player.eliminated) {
        switch (player.role) {
          case "Sheriff":
            divString = '<img src="assets/cards/Sheriff.png" alt="" class="responsive cardOnly"></img>';
            $("#iSheriff").addClass("hidden");
            break;
          case "Deputy":
            divString = '<img src="assets/cards/Deputy.png" alt="" class="responsive cardOnly"></img>';
            $("#iDeputy").addClass("hidden");
            break;
          case "Renegade":
            divString = '<img src="assets/cards/Renegade.png" alt="" class="responsive cardOnly"></img>';
            $("#iRenegade").addClass("hidden");
            break;
          case "Outlaw":
            divString = '<img src="assets/cards/Outlaw.png" alt="" class="responsive cardOnly"></img>';
            outlawNumber++;
            $(`#iOutlaw${outlawNumber}`).addClass("hidden");  
        }
        if (position == 'a5') {
          divString = "";
          $("#mainName").html(`${player.name} - eliminated`)
        }
      } else {
        //equip weapon
        divString += `<img src="assets/cards/${player.weapon}.png" alt="${player.weapon}" class="responsive">`;
        //add other cards per player properties
        if (player.scope) {
          divString += `<img src="assets/cards/scope.png" alt="scope" class="responsive">`;
        }
        if (player.mustang) {
          divString += `<img src="assets/cards/mustang.png" alt="mustang" class="responsive">`;
        }
      }
      if (player.barrel) {
        divString += `<img src="assets/cards/barrel.png" alt="barrel" class="responsive">`;
      }
      if (player.jail) {
        divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive">`;
      }
      if (player.dynamite) {
        divString += `<img src="assets/cards/dynamite.png" alt="dynamite" class="responsive">`;
      }
      let positionString = "#" + position + " .cardsInPlay";
      $(positionString).html(divString);
    }
    else {
      alert("warning: position unable to be determined!");
    }
  });
}

//Update bullets in response to socket message
function displayBullets() {
  socket.on("bulletUpdate", data => {
    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateBulletDisplay(playerData, player)
      }
    })
  })
}

const getBulletString = (player) => {
  let bulletString = "";
  let i = 0;
  while (i < player.currentLife) {
    bulletString += '<img src="assets/bullet.png" alt="" class="responsive"></img>';
    i++;
  }
  return bulletString;
}

//will update all player's bullet display
function updateBulletDisplay(mydata, data) {
  $("#mainBullets").html(getBulletString(data));
  if (data.id == 1) {
    $("#c5 .bulletTray").html(getBulletString(mydata[2]));
    $("#b5 .bulletTray").html(getBulletString(mydata[1]));
    $("#d5 .bulletTray").html(getBulletString(mydata[3]));
    $("#e5 .bulletTray").html(getBulletString(mydata[4]));
  }
  else if (data.id == 2) {
    $("#c5 .bulletTray").html(getBulletString(mydata[3]));
    $("#b5 .bulletTray").html(getBulletString(mydata[2]));
    $("#d5 .bulletTray").html(getBulletString(mydata[4]));
    $("#e5 .bulletTray").html(getBulletString(mydata[0]));
  }
  else if (data.id == 3) {
    $("#c5 .bulletTray").html(getBulletString(mydata[4]));
    $("#b5 .bulletTray").html(getBulletString(mydata[3]));
    $("#d5 .bulletTray").html(getBulletString(mydata[0]));
    $("#e5 .bulletTray").html(getBulletString(mydata[1]));
  }
  else if (data.id == 4) {
    $("#c5 .bulletTray").html(getBulletString(mydata[0]));
    $("#b5 .bulletTray").html(getBulletString(mydata[4]));
    $("#d5 .bulletTray").html(getBulletString(mydata[1]));
    $("#e5 .bulletTray").html(getBulletString(mydata[2]));
  }
  else if (data.id == 5) {
    $("#c5 .bulletTray").html(getBulletString(mydata[1]));
    $("#b5 .bulletTray").html(getBulletString(mydata[0]));
    $("#d5 .bulletTray").html(getBulletString(mydata[2]));
    $("#e5 .bulletTray").html(getBulletString(mydata[3]));
  }
}

