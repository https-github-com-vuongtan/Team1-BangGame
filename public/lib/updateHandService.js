//Update Hand
        function displayHand(){
          socket.on("handUpdate",data=>{
          //Status for checking card exist  
          let galtingstatus="false"
          let beerstatus="false"
          let countliveuser=0
          $('#mainHand').empty()
          const mydata= JSON.parse(data)
          //Count live user
          mydata.forEach((data) => {
            if(data.currentLife>0){
              countliveuser++
            }
            })
           mydata.forEach((data) => {
            if(data.socket==socketid){
              let hand = data.hand
               console.log(hand)
               for (var i =0; i < hand.length; i++){
                 console.log(hand[i].card)
                $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="${hand[i].card}" class="responsive ${hand[i].card}">`)  
               if(hand[i].card=="Gatling"){
                galtingstatus="true"
               }
               if(hand[i].card=="beer"){
                beerstatus="true"
               }

                $(`.bang`).click(function() {
                  console.log(`Card Hit`)
                  $(`#bangModal`).modal('open') ;
                  });
              }

              if(galtingstatus=="true"){
              GatlingAttack(socketid)
              }
              if(beerstatus=="true"){
                BeerHeal(socketid,countliveuser)
                }
            }
            })      
          })
        }