

function panic(pData) {
    let gameData = pData.gameData;
    if ((phaseuser == nameplayer) && (parseInt(phasenumber) == 2)) {
  
      //start with default distance values (custom modification for panic)
      let reachDistance = 1;
      let b5distance = 1;
      let c5distance = 2;
      let d5distance = 2;
      let e5distance = 1;
      let divString = "";
  
      gameData.forEach((player, pIndex) => {
        if (player.name == nameplayer) {
          if (player.scope) {
            reachDistance++
          }
          divString = `<div class="card-image">
            <img data-panictarget={pIndex} src="assets/cards/${gameData[pIndex].character}.png" alt="${gameData[pIndex].character}" class="responsive ${gameData[pIndex].character}"></div>
            <div class="card-content">${gameData[pIndex].name}</div>`
          $(`#a5panicPlayerModal`).html(divString);
  
          gameData.forEach((opponent) => {
  
            let position = getPlayerPosition(opponent, player)
            switch (position) {
              case ("b5"):
                if (opponent.mustang) {
                  b5distance++
                }
                if (opponent.eliminated) {
                  c5distance--
                }
                break;
              case ("c5"):
                if (opponent.mustang) {
                  c5distance++
                }
                break;
  
              case ("d5"):
                if (opponent.mustang) {
                  d5distance++
                }
                break;
  
              case ("e5"):
                if (opponent.mustang) {
                  e5distance++
                }
                if (opponent.eliminated) {
                  d5distance--
                }
                break;
            }
  
          });
  
          gameData.forEach((opponent, oIndex) => {
  
            position = getPlayerPosition(opponent, player)
            switch (position) {
  
              case ("c5"):
                if (!opponent.eliminated && (reachDistance >= c5distance)) {
                  divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                  <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                  <div class="card-content">${gameData[oIndex].name}</div>`
                  $(`#${position}panicPlayerModal`).html(divString)
                } else {
                  $(`#${position}panicPlayerModal`).html("")
                }
                break;
  
              case ("b5"):
                if (!opponent.eliminated && (reachDistance >= b5distance)) {
                  divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                  <img  src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                  <div class="card-content">${gameData[oIndex].name}</div>`
                  $(`#${position}panicPlayerModal`).html(divString)
                } else {
                  $(`#${position}panicPlayerModal`).html("")
                }
                break;
              case ("e5"):
                if (!opponent.eliminated && (reachDistance >= e5distance)) {
                  divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                  <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                  <div class="card-content">${gameData[oIndex].name}</div>`
                  $(`#${position}panicPlayerModal`).html(divString)
                } else {
                  $(`#${position}panicPlayerModal`).html("")
                }
                break;
  
              case ("d5"):
                if (!opponent.eliminated && (reachDistance >= d5distance)) {
                  divString = `<div class="card-image"><a class="btn-floating halfway-fab waves-effect waves-light red panicPlayer" data-panictarget=${oIndex}><i class="material-icons">add</i></a>
                  <img src="assets/cards/${gameData[oIndex].character}.png" alt="${gameData[oIndex].character}" class="responsive ${gameData[oIndex].character} panicPlayer"></div>
                  <div class="card-content">${gameData[oIndex].name}</div>`
                  $(`#${position}panicPlayerModal`).html(divString)
                } else {
                  $(`#${position}panicPlayerModal`).html("")
                }
                break;
            }
  
          });
  
        }
      })
  
      $(`#panicPlayerSelectModal`).modal('open');
  
      divString = "";
      let data = {
        cardIndex: pData.index,
        name: nameplayer,
        gameData: pData.gameData
      }
      //use gameData and targetPlayer to display targetPlayer's hand info #panicCardsInPlay  
      $(`.panicPlayer`).click(function () {
        console.log(`player ${$(this).data("panictarget")} selected`);
        let targetIndex = parseInt($(this).data("panictarget"));
        let targetPlayer = gameData[targetIndex];
        divString = "";
        //display selected opponent's cards in hand
        if (targetPlayer.weapon != 'colt45') {
          divString += `<img src="assets/cards/${targetPlayer.weapon}.png" alt="${targetPlayer.weapon}" class="responsive panicCard" data-paniccard="${targetPlayer.weapon}">`;
        }
        if (targetPlayer.scope) {
          divString += `<img src="assets/cards/scope.png" alt="scope" class="responsive panicCard" data-paniccard="scope">`;
        }
        if (targetPlayer.mustang) {
          divString += `<img src="assets/cards/mustang.png" alt="mustang" class="responsive panicCard" data-paniccard="mustang">`;
        }
        if (targetPlayer.barrel) {
          divString += `<img src="assets/cards/barrel.png" alt="barrel" class="responsive panicCard" data-paniccard="barrel">`;
        }
        if (targetPlayer.jail) {
          divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive panicCard" data-paniccard="jail">`;
        }
        if (targetPlayer.dynamite) {
          divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive panicCard" data-paniccard="dynamite">`;
        }
  
        $("#panicCardsInPlay").html(divString);
  
        //if private hand<0, display nothing, otherwise present mystery card
        if (targetPlayer.hand.length > 0) {
          divString = '<img src="assets/CardBackVertical.png" class= "responsive panicCard" data-paniccard="mystery"><div>Random private hand card</div>';
          $("#panicPrivateHand").html(divString);
        } else {
          $("#panicPrivateHand").html("");
        }
        $(`#panicCardSelectModal`).modal('open');
  
        $(`.panicCard`).click(function () {
  
          let targetCard = $(this).data("paniccard");
  
          let hData = {
            index: data.cardIndex,
            name: nameplayer,
            targetPlayerIndex: targetIndex,
            targetCard: targetCard
          }
  
          $.get('/playPanic', hData);
          discardCardFromHand(hData);
          $(`#panicCardSelectModal`).modal('close');
          $(`#panicPlayerSelectModal`).modal('close');
        });
      });
    }
  }