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