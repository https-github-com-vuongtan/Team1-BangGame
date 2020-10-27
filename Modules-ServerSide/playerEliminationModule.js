//automatically discard last cards of hand till under the hand limit // $$$$$
function forceUnderHandLimit(data) {
  player = data.limitPlayer;
  discardPile = data.discardPile;
  while (player.hand.length > player.currentLife) { // $$$$$
    let index = (player.hand.length - 1); // $$$$$
    let discardedCard = player.hand.splice(index, 1); // $$$$$
    discardPile.push({ "card": discardedCard[0].card }); // $$$$$
  }
  for (i = 0; i < player.hand.length; i++) { // $$$$$
    player.hand[i].id = i + 1; // $$$$$
  } //$$$$$
} // $$$$$

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
function eliminationLogic(playerData, player, playerKiller, discardPile) {
  let discardedCards = discardPlayerCards(player);
  let actionLogData = []
  actionLogData.push({ name: `${player.role} ${player.name} `, action: 'been killed' });
  //if killed by vulture Sam, transfer cards to vulture Sam's hand
  if (playerKiller != null) {
    //if victim was outlaw, killer gets reward cards
    if (player.role == "Outlaw") {
      //draw three cards (needs draw function *****) and add to playerKiller's hand
      actionLogData.push({ name: playerKiller.name, action: 'won Outlaw Reward' });
    } else if (player.role == "Deputy") {
      //if deputy killed by sheriff, sheriff discards all cards in hand and in play.
      let sheriffCards = discardPlayerCards(playerKiller)
      discardPile.push({ "card": sheriffCards[i].card });
      actionLogData.push({ name: playerKiller.name, action: 'killed a deputy' });
    }
    if (playerKiller.character == "Vulture Sam") {
      //add all victim cards to Vulture Sam's hand
      let index = playerKiller.hand.length + 1;
      for (var i = 0; i < discardedCards.length; i++) {
        playerKiller.hand.push({ "id": index, "card": discardedCards[i].card });
        index++;
      }
      actionLogArray.push({ name: "Vulture Sam", action: 'gained cards' });
    } else {
      //dead player's cards go to discard pile instead
      for (var i = 0; i < discardedCards.length; i++) {
        discardPile.push({ "card": discardedCards[i].card });

      }
    }
    console.log(playerKiller.name + " killed them");

  } else {
    for (var i = 0; i < discardedCards.length; i++) {
      discardPile.push({ "card": discardedCards[i].card });
    }
  }
  player.eliminated = true;
  player.distanceMod = -1;
  player.maxLife = 0;
  player.currentLife = 0;
  console.log(player.name + " eliminated.");
  let outcome = endGameCheck(playerData)
  let results = {
    winnerRole: outcome.winnerRole,
    winnerArray: outcome.winners,
    actionLogArray: actionLogData
  }
  return results;
}


//Checks for endgame conditions and returns winning role (or 'None')
function endGameCheck(playerData) {
  let sheriffAlive = false;
  let outlawAlive = false;
  let renegadeAlive = false;
  let deputyAlive = false;
  let winRole = 'None';
  let winArray = [];

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
      winRole = 'Renegade';
    } else {
      console.log("Outlaws win");
      winRole = 'Outlaw';
    }
  } else if (!outlawAlive && !renegadeAlive) {
    console.log("Sheriff and deputy win");
    winRole = 'Sheriff';
  } else {
    console.log("Not at endgame: keep playing");
  }

  playerData.forEach((player) => {
    if ((player.role == winRole) || ((winRole == "Sheriff") && (player.role == ("Deputy")))) {
      winArray.push({ name: player.name, role: player.role });
    }
  })
  let winnerData = {
    winnerRole: winRole,
    winners: winArray
  }
  return winnerData;
}

module.exports = {
  eliminationLogic,
  endGameCheck,
  forceUnderHandLimit
}