function removeIndians(playerData,sock){
    playerData.forEach(player=>{
        if(player.socket==sock){
          let status="true"  
          player.hand.forEach(function(data,index,object){
            if(data.card=="indians"&&status=="true"){
              status="false"
              object.splice(index,1)
            }
          })
        }
      })
}
module.exports= {
    removeIndians,
}  