//Update Hand
        function displayHand(){
          socket.on("handUpdate",data=>{
          const mydata= JSON.parse(data)
           mydata.forEach((data) => {
            if(data.socket==socketid){
              let hand = data.hand
               console.log(hand)
               for (var i =0; i < hand.length; i++){
                 console.log(hand[i].card)
                $('#mainHand').append(`<img data-target="${hand[i].card}Modal" href="#${hand[i].card}Modal"src="assets/cards/${hand[i].card}.png" alt="${hand[i].card}" class="responsive ${hand[i].card}">`)  
               
                $(`.bang`).click(function() {
                  console.log(`Card Hit`)
                  $(`#bangModal`).modal('open') ;
                  });
              }
            }
            })      
          })
        }