function weaponChange(data, playerData,io){
    playerData.forEach(player=>{
      if (player.socket == data.socket){
        player.weapon = data.item
        player.range = data.range
        console.log(player)
    let handSize = player.hand.length
        for( let i= 0; i < handSize; i++){
          if (player.hand[i].card == data.item){
            console.log(player.hand[i].card)
            player.hand.splice(i,1)
            io.emit("handUpdate",JSON.stringify(playerData))
            i = handSize
         }
         }
    
        const data2 ={
          name: player.name,
          action: ` changed weapons to ${data.item}!`,
        }
        io.emit("updateactionlog",data2)
        io.emit("handUpdate",JSON.stringify(playerData))
        io.emit("weaponUpdate",JSON.stringify(playerData))
      }
    })
    }

    module.exports={
        weaponChange,
    }