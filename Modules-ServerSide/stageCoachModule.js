function removeStage(playerData,sock){
    playerData.forEach(player=>{
        if(player.socket==sock){
        let status="true"  
          player.hand.forEach(function(data,index,object){
            if(data.card=="stagecoach"&&status=="true"){
              status="false"  
              object.splice(index,1)
              return
            }
          })
        }
      })
}
module.exports= {
    //randompickthreecards,
    removeStage
}  