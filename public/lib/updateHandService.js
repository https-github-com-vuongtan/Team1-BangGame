function displayHand() {
  socket.on("handUpdate", data => {
    //Status for checking card exist  
    let galtingstatus = "false"
    let beerstatus = "false"
    let wellfargo = "false"
    let duel = "false"
    let indians = "false"
    let generalstore = "false"
    let bang = "false"
    let weapon = "false"
    let scope = "false"
    let barrel = "false"
    let stageCoach = "false"



    let countliveuser = 0
    $('#mainHand').empty()
    const mydata = JSON.parse(data)
    //Count live user
    mydata.forEach((data) => {
      if (data.currentLife > 0) {
        countliveuser++
      }
    })
    mydata.forEach((data) => {
      if (data.socket == socketid) {
        let hand = data.hand
        console.log(hand)
        //reduce max-width for extra-large hands
        let maxWidth = Math.floor(100 / hand.length);
        document.documentElement.style.setProperty('--imgMaxWidth', `${maxWidth}%`);
        for (var i = 0; i < hand.length; i++) {
          console.log(hand[i].card)
          if (hand[i].card == "Gatling") {
            galtingstatus = "true"
          }
          if (hand[i].card == "beer") {
            beerstatus = "true"
          }
          if (hand[i].card == "duel") {
            duel = "true"
          }
          if (hand[i].card == "indians") {
            indians = "true"
          }
          if (hand[i].card == "bang") {
            bang = "true"
          }
          if (hand[i].card == "scope") {
            scope = "true"
          }
          if (hand[i].card == "barrel") {
            barrel = "true"
          }
          if (hand[i].card == "stagecoach") {
            stageCoach = "true"
          }

          if (hand[i].card == "remington") {
            $('#mainHand').append(`<img data-item="${hand[i].card}" src="assets/cards/${hand[i].card}.png" alt="Remington"  data-range="3" class="responsive weapon ${hand[i].card} hoverCard" data-handpos="${i}">`)
            weapon = "true"
          }
          else if (hand[i].card == "rev carabine") {
            $('#mainHand').append(`<img data-item="${hand[i].card}" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="Rev Carabine" data-range="4" class="responsive weapon ${hand[i].card} hoverCard" data-handpos="${i}">`)
            weapon = "true"
          }
          else if (hand[i].card == "schofield") {
            $('#mainHand').append(`<img data-item="${hand[i].card}" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="Schofield" data-range="2" class="responsive weapon ${hand[i].card} hoverCard" data-handpos="${i}">`)
            weapon = "true"
          }
          else if (hand[i].card == "volcanic") {
            $('#mainHand').append(`<img data-item="${hand[i].card}" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="Volcanic" data-range="1" class="responsive weapon ${hand[i].card} hoverCard" data-handpos="${i}">`)
            weapon = "true"
          }
          else if (hand[i].card == "winchester") {
            $('#mainHand').append(`<img data-item="${hand[i].card}" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="Winchester" data-range="5" class="responsive weapon ${hand[i].card} hoverCard" data-handpos="${i}">`)
            weapon = "true"
          }
          else if (hand[i].card == "Wells Fargo") {
            $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="Wells" class="responsive ${hand[i].card} hoverCard" data-handpos="${i}">`)
            wellfargo = "true"
          }
          else if (hand[i].card == "general store") {
            $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="general" class="responsive ${hand[i].card}" data-handpos="${i}">`)
            generalstore = "true"
          }
          else {
            $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="${hand[i].card}" class="responsive ${hand[i].card}" data-handpos="${i}">`)
          }


        }

        if (bang == "true") {
          bangAttack(socketid)
        }
        if (weapon == "true") {
          weaponChange(socketid)
        }
        if (scope == "true") {
          scopeAdd(socketid)
        }
        if (barrel == "true") {
          barrelAdd(socketid)
        }
        if (stageCoach == "true") {
          stageCoachClick(socketid)
        }
        if (galtingstatus == "true") {
          GatlingAttack(socketid)
        }
        if (beerstatus == "true") {
          BeerHeal(socketid, countliveuser)
        }
        if (wellfargo == "true") {
          WellFar(socketid)
        }
        if (duel == "true") {
          Duel(socketid)
        }

        if (indians == "true") {
          Indians(socketid)
        }
        if (generalstore == "true") {
          general(socketid)
        }
        $(`.saloon`).click(function () {
          console.log(`Saloon Hit`)
          let sData = {
            index: parseInt($(this).data("handpos")),
            gameData: mydata
          }
          console.log(sData.index)
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

    })
  })
}
