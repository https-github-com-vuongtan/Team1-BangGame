
//discards card at index[i] from player's hand and adds it to the discard pile
function discardCardFromHand(i) {
  data = {
    index: i,
    name: nameplayer
  }
  $.get('/discardHandCard', data);
}


//discards card at index[i] from player's hand and adds it to the discard pile only if in phase 3 of their turn.
//triggers end of turn via API if hand is now under the limit
function endOfTurnDiscard(i) {
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 3)) {
    discardCardFromHand(i);
   let data = {
      name: nameplayer
    }
   //if hand now as low as life points, turn should end
    $.get('/checkHandSizeEndTurn', data);
  }
}
