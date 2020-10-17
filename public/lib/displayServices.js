  
//NOTE: You cannot use these functions from here.
//(I have been tweaking these functions and moving them to index.js as I find a use for them).


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
  console.log(playerDiff);

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
      let handSize = player.hand["length"];
      //(update not applicable if position is this player's)
      if (position != "a1") {
        if (handSize >0) {
          divString += '<img src="assets/cardBack.png" class="responsive">';
          for (i = 1; i < handSize; i++) {
            divString += '<img src="assets/cardOverlap.png"class="responsive">';
          }
          let positionString = "#" + position + " .privateHand";
          $(positionString).html(divString);
        }
      }
    }
    else {
      alert("warning: position unable to be determined!");
    }
  });
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
    $("#d5 .bulletTray").html(getBulletString(mydata)[3]);
    $("#e5 .bulletTray").html(getBulletString(mydata)[4]);
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

//displays an opponents handsize on screen (payload needs handSize, opponentPlayerNum & thisPlayerNum) - probably won't use. Use above function instead?
const displayHandSize = (payload) => {
  let position = getPlayerPosition(payload.opponentPlayerId, payload.thisPlayerId);
  if (position != "unavailable") {
    let divString = "";
    //(update not applicable if position is this player's)
    if (position != "a1") {
      if (payload.handSize > 0) {
        divString += '<img src="assets/cardBack.png" class="responsive">';
        for (i = 1; i < payload.handSize; i++) {
          divString += '<img src="assets/cardOverlap.png"class="responsive">';
        }
        let jqString = '#' + position + ' .privateHand';
        $(jqString).html(divString);
      }
    }
    //res.send({ result: 200 });
  }
  else {
    // res.send({ result: "position unable to be determined" });
  }
}

