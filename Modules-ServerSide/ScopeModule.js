function scopeAdd(data, playerData,io){
    playerData.forEach(player=>{
      if (player.socket == data.socket){
        player.scope = true
        console.log(player)
    let handSize = player.hand.length
        for( let i= 0; i < handSize; i++){
          if (player.hand[i].card == "scope"){
            console.log(player.hand[i].card)
            player.hand.splice(i,1)
            io.emit("handUpdate",JSON.stringify(playerData))
            i = handSize
         }
         }
    
        const data2 ={
          name: player.name,
          action: ` played the Scope card!`,
        }
        io.emit("updateactionlog",data2)
        io.emit("handUpdate",JSON.stringify(playerData))
        io.emit("cardsInPlayUpdate", JSON.stringify(playerData));
      }
    })
    }

    module.exports={
        scopeAdd,
    }