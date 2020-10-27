function checkDistance(data,playerData, io){
  console.log("distance check started")
var attackerRange = 0
var targetDistance = parseInt(data.distance)
  playerData.forEach(attacker=>{
    if (attacker.name == data.attackerName){
      attackerRange = parseInt(attacker.range)
      console.log(`Attacker Range is ${attackerRange} before scope`)
       if (attacker.scope == true){
        attackerRange + 1
      }
      console.log(`Attacker Range is ${attackerRange} after scope`)
      if (attacker.character = "Rose Doolan"){
        attackerRange + 1
      }
      console.log(`Attacker Range is ${attackerRange} after Rose Doolan check`)
    }
  })
  playerData.forEach(target=>{
    if (target.id==data.targetId){
      console.log(target.distanceMod)
      if (target.mustang == true){
        targetDistance = targetDistance + 1
      }
      console.log(targetDistance)
    }
  })
  console.log(`Attacker range ${attackerRange} vs Target Distance ${targetDistance}`)
if (attackerRange >= targetDistance){
  console.log("distance check complete")
  //playBang(data, playerData, io)
  checkBarrel(data,playerData,io)
}
}

function checkBarrel(data, playerData, io){
  barrelCheck = false;
 playerData.forEach(target =>{
   if (target.id == data.targetId){
   if (target.barrel == true && barrelCheck == false){
    let item = Math.floor(Math.random() * 4);
    barrelCheck = true
    if (item == 1){
      const data3 ={
        name: target.name,
        action: ` drew a Heart and hid behind their Barrel!`,
      }
      io.emit("updateactionlog",data3)
    }else{
      const data2 ={
        name: target.name,
        action: ` failed to hide behind their Barrel!`,
      }
      io.emit("updateactionlog",data2)
      playBang(data,playerData, io)
        } 
    console.log(`check Barrel reutrned ${item}`)
    }else{
    playBang(data,playerData, io)
      }
    }
 })
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