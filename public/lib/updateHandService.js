//Update Hand
function displayHand() {
  socket.on("handUpdate", data => {
    const mydata = JSON.parse(data)
    mydata.forEach((data) => {
      if (data.socket == socketid) {
        let hand = data.hand
        let divString = ""
        console.log(hand)
        $("#mainHand").html("");
        for (var i = 0; i < hand.length; i++) {
          console.log(hand[i].card)
          divString += `<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="${hand[i].card}" class="responsive ${hand[i].card}">`;
          $("#mainHand").html(divString);
          $(`.bang`).click(function () {
            console.log(`Card Hit`)
            $(`#bangModal`).modal('open');
          });
          /*
          (`.saloon`).click(function () {
            console.log(`Saloon Hit`)
            applytoIndexElement("mainHand", saloon);
          });
        /*  $(`.panic`).click(function () {
            /*let pData = {
              element: "mainHand",
              iFunction: panic,
              gameData: mydata
            }*/ /*
            console.log(`Panic Hit`)
           // applytoIndexElement(pData);
            applytoIndexElement("mainHand", panic);

          });*/


        }
          //update (private) handsize
          updateHandSizeDisplay(mydata, data);
          applytoIndexElement("mainHand", endOfTurnDiscard);

      }



    })
    //put func here
  })
}