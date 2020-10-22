//removes all players cards and returns as array of discarded cards
function discardPlayerCards(player) {
  let discarded = [];
  //discard cards in hand
  dLength = player.hand.length;

  for (var i = 0; i < dLength; i++) {
    let discardCard = player.hand.pop();
    discarded.push({ "card": discardCard.card });
  }
  //discard cards in play
  //if weapon card (not colt) add to discard pile 
  if (player.weapon != 'colt45') {
    discarded.push({ "card": player.weapon });
  }
  if (player.scope) {
    discarded.push({ "card": "scope" });
  }
  if (player.mustang) {
    discarded.push({ "card": "mustang" });
  }
  if (player.barrel) {
    discarded.push({ "card": "barrel" });
  }
  if (player.jail) {
    discarded.push({ "card": "jail" });
  }
  if (player.dynamite) {
    discarded.push({ "card": "dynamite" });
  }
  //blank all in-play card options
  player.weapon = 'colt45';
  player.scope = false;
  player.mustang = false;
  player.barrel = false;
  player.jail = false;
  player.dynamite = false;
  return discarded;
}


// Called from eliminatePlayer. 
//if no killer (eg, killed by dynamite), playerKiller is null
const eliminationLogic = (playerData, player, playerKiller, discardPile) => {
  let discardedCards = discardPlayerCards(player);
  //if killed by vulture Sam, transfer cards to vulture Sam's hand
  if (playerKiller != null) {
    if (playerKiller.character == "Vulture Sam") {
      //add all victim cards to Vulture Sam's hand
      let index = playerKiller.hand.length + 1;
      for (var i = 0; i < discardedCards.length; i++) {
        playerKiller.hand.push({ "id": index, "card": discardedCards[i].card });
        index++;
      }

    } else {
      for (var i = 0; i < discardedCards.length; i++) {
        discardPile.push({"card": discardedCards[i].card });
      }
    }
    console.log(playerKiller.name + " killed them");

  } else {
    for (var i = 0; i < discardedCards.length; i++) {
      discardPile.push({"card": discardedCards[i].card });
    }
  }
  player.eliminated = true;
  player.distanceMod = -1;
  player.maxLife = 0;
  player.currentLife = 0;
  console.log(player.name + " eliminated.");

}

//Checks for endgame conditions and returns winning role (or 'None')
function endGameCheck(playerData) {
  let sheriffAlive = false;
  let outlawAlive = false;
  let renegadeAlive = false;
  let deputyAlive = false;

  playerData.forEach((player) => {
    if (!player.eliminated) {

      switch (player.role) {
        case "Sheriff":
          sheriffAlive = true;
          break;
        case "Outlaw":
          outlawAlive = true;
          break;
        case "Renegade":
          renegadeAlive = true;
          break;
        case "Deputy":
          deputyAlive = true;
      }

    }
  });

  if (!sheriffAlive) {
    if (!outlawAlive && !deputyAlive && renegadeAlive) {
      console.log("Renegade wins");
      return 'Renegade';
    } else {
      console.log("Outlaws win");
      return 'Outlaw';
    }
  } else if (!outlawAlive && !renegadeAlive) {
    console.log("Sheriff and deputy win");
    return 'Sheriff';
  } else {
    console.log("Not at endgame: keep playing");
    return 'None';
  }

}

module.exports = {
  eliminationLogic,
  endGameCheck
}