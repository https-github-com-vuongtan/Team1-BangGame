function removeDuelCard(playerData,name){
    playerData.forEach(player=>{
        if(player.name==name){
        let status="true"  
          player.hand.forEach(function(data,index,object){
            if(data.card=="duel"&&status=="true"){
              status="false"  
              object.splice(index,1)
              return
            }
          })
        }
      })
}
function removeBangCard(playerData,socket){
  playerData.forEach(player=>{
    if(player.socket==socket){
    let status="true"  
      player.hand.forEach(function(data,index,object){
        if(data.card=="bang"&&status=="true"){
          status="false"  
          object.splice(index,1)
          return
        }
      })
    }
  })
}

module.exports= {
    removeDuelCard,
    removeBangCard
} 