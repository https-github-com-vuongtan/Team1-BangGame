function removeDuelCard(playerData,name){
    playerData.forEach(player=>{
        if(player.name==name){
        let status="true"  
        console.log("HELOOOOOOOOO")
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
module.exports= {
    removeDuelCard
} 