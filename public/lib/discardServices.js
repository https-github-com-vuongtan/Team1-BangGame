
//discards card at index[i] from player's hand and adds it to the discard pile
function discardCardFromHand(i) {
    data ={
      index: i,
      name: nameplayer
    }
    $.get('/discardHandCard', data)
  }
  