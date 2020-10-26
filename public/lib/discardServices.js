
//discards card at index[i] from player's hand and adds it to the discard pile
function discardCardFromHand(iData) {

  let data = {
    index: iData.index,
    name: iData.name
  }
  console.log('discardcardfromhandindex '+ data.index)
  $.get('/discardHandCard', data);
}


//discards card at index[i] from player's hand and adds it to the discard pile only if in phase 3 of their turn.
//triggers end of turn via API if hand is now under the limit
function endOfTurnDiscard(index) {

  if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 3)) {
    let data = {
      index: index,
      name: nameplayer
    }
    console.log('endofTdiscard '+ data.index)

    discardCardFromHand(data);
    //if hand now as low as life points, turn should end 
    $.get('/checkHandSizeEndTurn', data);
  }
}
