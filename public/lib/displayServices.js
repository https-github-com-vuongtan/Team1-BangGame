

//hides the join screen and displays the gameboard
const displayGameBoard = (req, res) => {
 $("#gameboard").removeClass("hidden");
  $("#welcomeScreen").addClass("hidden");
 res.send({ result: 200 })
}

//hides the gameboard & shows the join screen
const displayWelcomeScreen = () => {
  $("#welcomeScreen").removeClass("hidden");
  $("#gameboard").addClass("hidden");
  //res.send({ result: 200 })
}

//gets player position (used to determine which card/bullets to adjust on screen)
function getPlayerPosition(opponentPlayerNum, thisPlayerNum) {
  let playerDiff = opponentPlayerNum - thisPlayerNum;
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

//displays an opponents handsize on screen (payload needs handSize, opponentPlayerNum & thisPlayerNum)
const displayHandSize = (payload) => {
  let position = getPlayerPosition(payload.opponentPlayerNum, payload.thisPlayerNum);
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

