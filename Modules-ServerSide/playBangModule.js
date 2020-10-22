function playBang(data, playerData, io){

    var missedCount = 0
    playerData.forEach(attacker =>{
      if (attacker.name == data.attackerName){
        let handSize = attacker.hand.length
        console.log(handSize)
        for( let i= 0; i < handSize; i++){
          if (attacker.hand[i].card == "bang"){
            console.log(attacker.hand[i].card)
            attacker.hand.splice(i,1)
            io.emit("handUpdate",JSON.stringify(playerData))
            i = handSize
         }
         }
        }
    })
    playerData.forEach(player => {
      if(player.id==data.targetId){
        let handSize = player.hand.length
        console.log(handSize)
        for( var i= 0; i < handSize; i++){
          if (player.hand[i].card == "missed"){
            missedCount = +1
            console.log(player.hand[i].card)
            player.hand.splice(i,1)
            io.emit("handUpdate",JSON.stringify(playerData))
            i = handSize
          }
        }
  
        if (missedCount < 1){
          player.currentLife = player.currentLife -1
          missedCount = 0; 
          const data ={
            name: attackerName,
            action: `shot ${player.name}`,
          }
          io.emit("updateactionlog",data)
          res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
        } else {
          missedCount = 0;
          const data ={
            name: player.name,
            action: ` played a missed!`,
          }
          io.emit("updateactionlog",data)
         
        }
             
       }
      
    })
  }

  module.exports={
      playBang,
  }