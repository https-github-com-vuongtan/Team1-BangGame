
//Update bullets in response to socket message
function displayCardsInPlay() {
    socket.on("cardsInPlayUpdate", data => {
      const playerData = JSON.parse(data)
      playerData.forEach((player) => {
        if (player.socket == socketid) {
          updateCardsInPlayDisplay(playerData, player)
        }
      })
    })
  }
  
  function updateCardsInPlayDisplay(mydata, data) {
    let outlawNumber = 0;
    mydata.forEach((player) => {
      let position = getPlayerPosition(player, data);
      if (position != "unavailable") {
        let divString = "";
        //if player is eliminated, show role card only (but don't need to if main player(A5))
        if (player.eliminated) {
          switch (player.role) {
            case "Sheriff":
              divString = '<img src="assets/cards/Sheriff.png" alt="" class="responsive cardOnly"></img>';
              $("#iSheriff").addClass("hidden");
              break;
            case "Deputy":
              divString = '<img src="assets/cards/Deputy.png" alt="" class="responsive cardOnly"></img>';
              $("#iDeputy").addClass("hidden");
              break;
            case "Renegade":
              divString = '<img src="assets/cards/Renegade.png" alt="" class="responsive cardOnly"></img>';
              $("#iRenegade").addClass("hidden");
              break;
            case "Outlaw":
              divString = '<img src="assets/cards/Outlaw.png" alt="" class="responsive cardOnly"></img>';
              outlawNumber++;
              $(`#iOutlaw${outlawNumber}`).addClass("hidden");  
          }
          if (position == 'a5') {
            divString = "";
            $("#mainName").html(`${player.name} - eliminated`)
          }
        } else {
          //equip weapon
          divString += `<img src="assets/cards/${player.weapon}.png" alt="${player.weapon}" class="responsive">`;
          //add other cards per player properties
          if (player.scope) {
            divString += `<img src="assets/cards/scope.png" alt="scope" class="responsive">`;
          }
          if (player.mustang) {
            divString += `<img src="assets/cards/mustang.png" alt="mustang" class="responsive">`;
          }
        }
        if (player.barrel) {
          divString += `<img src="assets/cards/barrel.png" alt="barrel" class="responsive">`;
        }
        if (player.jail) {
          divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive">`;
        }
        if (player.dynamite) {
          divString += `<img src="assets/cards/dynamite.png" alt="dynamite" class="responsive">`;
        }
        let positionString = "#" + position + " .cardsInPlay";
        $(positionString).html(divString);
      }
      else {
        alert("warning: position unable to be determined!");
      }
    });
  }