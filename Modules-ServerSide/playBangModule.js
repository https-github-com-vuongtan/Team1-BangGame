function checkDistance(data,playerData, io){
  console.log("distance check started")
var attackerRange = ""
var targetDistance = parseInt(data.distance)
  playerData.forEach(attacker=>{
    if (attacker.name == data.attackerName){
      attackerRange = attacker.range
      console.log(attackerRange)
      if (data.scope == true){
        attackerRange= attackerRange + 1
      }
    }
  })
  playerData.forEach(target=>{
    if (target.id==data.targetId){
      console.log(target.distanceMod)
      targetDistance = targetDistance + target.distanceMod
      console.log(targetDistance)
    }
  })
if (attackerRange >= targetDistance){
  console.log("distance check complete")
  playBang(data, playerData, io)
}
}

function playBang(data, playerData, io){

    var missedCount = 0
    playerData.forEach(attacker =>{
      if (attacker.name == data.attackerName){
        let handSize = attacker.hand.length
        if (attacker.character == "Willy The Kid" || attacker.weapon == "volcanic"){
          attacker.bangPlayed = false
        } else {
          attacker.bangPlayed = true
        }
        console.log(attacker.bangPlayed)
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
          io.emit("bulletUpdate", JSON.stringify(playerData)) 
          const data2 ={
            name: data.attackerName,
            action: `shot ${player.name}`,
          }
          io.emit("updateactionlog",data2)
          console.log(`${player.name} is now on ${player.currentLife} lives`)
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
    io.emit("bulletUpdate", JSON.stringify(playerData))
  }

  module.exports={
      playBang,
      checkDistance
  }