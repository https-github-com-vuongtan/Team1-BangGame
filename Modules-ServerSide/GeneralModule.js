function getplayingcards(items,livecount){
    let listcards=[]
    for( var i=0;i<livecount;i++){
        let item1 = items[Math.floor(Math.random() * items.length)];
        let index1 = items.indexOf(item1);
        items.splice(index1, 1);
        listcards.push(item1)
    }
return listcards
}
function removegeneralcard(playerData,socket){
    playerData.forEach(player=>{
        if(player.socket==socket){

            let checkgeneralcard="false"
          player.hand.forEach(function(data,index,object){
            if(data.card=="general store" && checkgeneralcard=="false"){
                object.splice(index,1)
                checkgeneralcard="true"
            }
          })
        }
      })
}
function pushcardtohand(playerData,socket,namecard){
    playerData.forEach(player=>{
        if(player.socket==socket){
            let element={"id":player.hand[player.hand.length-1].id+1,"card":namecard}
            player.hand.push(element)
        }
      })
}
function checknextuser(playerData,socket)
{
    let currentid
    let socketreturn

    playerData.forEach(player=>{
        if(player.socket==socket){
            currentid=player.id
        }
      })
  if(currentid==1){

    let statuslife="true"
    for(var i=currentid;i<=4;i++){
        if(playerData[i].currentLife!=0&&statuslife=="true"){
            socketreturn=playerData[i].socket
            statuslife="false"
        }
    }

  }
  else if(currentid==2){
    let statuslife="true"
    let id
    for(var i=currentid;i<=5;i++){
        if(i==5){
            id=0
        }
        else{
            id=i
        }
        if(playerData[id].currentLife!=0&&statuslife=="true"){
            socketreturn=playerData[id].socket
            statuslife="false"
        }
    }
    console.log(socketreturn)
  }
  else if(currentid==3){
    let id
    let statuslife="true"
    for(var i=currentid;i<=6;i++){
        if(i==5){
            id=0
        }
        else if(i==6){
            id=1
        }
        else{
            id=i
        }
        if(playerData[id].currentLife!=0&&statuslife=="true"){
            socketreturn=playerData[id].socket
            statuslife="false"
        }
    }
  }
  else if(currentid==4){
    let id
    let statuslife="true"
    for(var i=currentid;i<=7;i++){
        if(i==5){
            id=0
        }
        else if(i==6){
            id=1
        }
        else if(i==7){
            id=2
        }
        else{
            id=i
        }
        if(playerData[id].currentLife!=0&&statuslife=="true"){
            socketreturn=playerData[id].socket
            statuslife="false"
        }
    }
  }
  else if(currentid==5){

    let statuslife="true"
    for(var i=currentid;i<=8;i++){
        if(i==5){
            id=0
        }
        else if(i==6){
            id=1
        }
        else if(i==7){
            id=2
        }
        else if(i==8){
            id=3
        }
        else{
            id=i
        }
        if(playerData[id].currentLife!=0&&statuslife=="true"){
            socketreturn=playerData[id].socket
            statuslife="false"
        }
    }
  }
  console.log(socketreturn)
  return socketreturn
}

module.exports= {
    getplayingcards,
    removegeneralcard,
    checknextuser,
    pushcardtohand
}  