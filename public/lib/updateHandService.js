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
          $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="${hand[i].card}" class="responsive ${hand[i].card}" data-handpos="${i}">`);
          $("#mainHand").append(divString);
          $(`.bang`).click(function () {
            console.log(`Card Hit`)
            $(`#bangModal`).modal('open');
          });
        }

        $(`.saloon`).click(function () {
          console.log(`Saloon Hit`)
          let sData = {
            index: parseInt($(this).data("handpos")),
            gameData: mydata
          }
          saloon(sData);
        });

        $(`.panic`).click(function () {
            let pData = {
            index: parseInt($(this).data("handpos")),
            gameData: mydata
          }
            console.log(`Panic Hit`)
            panic(pData);
          });  
        
        applytoIndexElement("mainHand", endOfTurnDiscard);
          //update (private) handsize
          updateHandSizeDisplay(mydata, data);
      }

    })
    //put func here
  })
}