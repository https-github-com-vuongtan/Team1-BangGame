
//Update cards in play in response to socket message
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
            divString = '<img src="assets/cards/Sheriff.png" alt="Sheriff" class="responsive cardOnly hoverCard"></img>';
            $("#iSheriff").addClass("hidden");
            break;
          case "Deputy":
            divString = '<img src="assets/cards/Deputy.png" alt="Deputy" class="responsive cardOnly hoverCard"></img>';
            $("#iDeputy").addClass("hidden");
            break;
          case "Renegade":
            divString = '<img src="assets/cards/Renegade.png" alt="Renegade" class="responsive cardOnly hoverCard"></img>';
            $("#iRenegade").addClass("hidden");
            break;
          case "Outlaw":
            divString = '<img src="assets/cards/Outlaw.png" alt="Outlaw" class="responsive cardOnly hoverCard"></img>';
            outlawNumber++;
            $(`#iOutlaw${outlawNumber}`).addClass("hidden");
        }
        if (position == 'a5') {
          divString = "";
          $("#mainName").html(`${player.name} - eliminated`)
        }
      } else {
        //equip weapon
        divString += `<img id="#${position}WeaponCard" src="assets/cards/${player.weapon}.png" alt="${player.weapon}" class="responsive hoverCard">`;
        //add other cards per player properties
        if (player.scope) {
          divString += `<img src="assets/cards/scope.png" alt="scope" class="responsive hoverCard">`;
        }
        if (player.mustang) {
          divString += `<img src="assets/cards/mustang.png" alt="mustang" class="responsive hoverCard">`;
        }
      }
      if (player.barrel) {
        divString += `<img src="assets/cards/barrel.png" alt="barrel" class="responsive hoverCard">`;
      }
      if (player.jail) {
        divString += `<img src="assets/cards/jail.png" alt="jail" class="responsive hoverCard">`;
      }
      if (player.dynamite) {
        divString += `<img src="assets/cards/dynamite.png" alt="dynamite" class="responsive hoverCard">`;
      }
      let positionString = "#" + position + " .cardsInPlay";
      $(positionString).html(divString);
    }
    else {
      alert("warning: position unable to be determined!");
    }

  });
  
  $(".hoverCard").hover(function () {
    altVal = $(this).attr("alt");
    let altData = {
      altVal: altVal
    }
    let descText = descriptionFinder(altData);
    console.log(descText);
    $("#cardDescription").html(descText)
    $("#cardDescription").removeClass("hidden")
  }, function () {
    $("#cardDescription").addClass("hidden");
    $("#cardDescription").html("");
  });

}