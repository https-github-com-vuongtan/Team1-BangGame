function removeGatling(playerData,sock){
    playerData.forEach(player=>{
        if(player.socket==sock){
            let status="true"  
          player.hand.forEach(function(data,index,object){
            if(data.card=="Gatling"&&status=="true"){
                status="false"  
              object.splice(index,1)
            }
          })
        }
      })
}
function getattackername(playerData,sock){
    let attackerName
    playerData.forEach(player=>{
        if(player.socket==sock){
          attackerName=player.name
          
        }
      })
      return attackerName
}

function removemissedinGalting(playerData,sock){
    playerData.forEach(player=>{
        if(player.socket==sock){
        let status="true"  
          attackerName=player.name
          player.hand.forEach(function(data,index,object){
            if(data.card=="missed"&&status=="true"){
              status="false"  
              object.splice(index,1)
              return
            }
          })
        }
      })
}

module.exports= {
    removeGatling,
    getattackername,
    removemissedinGalting
} 