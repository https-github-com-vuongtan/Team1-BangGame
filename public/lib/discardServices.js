
//discards card at index[i] from player's hand and adds it to the discard pile
function discardCardFromHand(i) {
  data = {
    index: i,
    name: nameplayer
  }
  $.get('/discardHandCard', data)
}


//discards card at index[i] from player's hand and adds it to the discard pile only if in phase 3 of their turn.
function endOfTurnDiscard(i) {
  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 3)) {
    discardCardFromHand(i)
  }
}
