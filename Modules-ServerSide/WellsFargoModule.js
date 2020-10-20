function randompickthreecards(items,playerData,socket){
    let statuspick="Canpick"
    if(items.length>3){
    item1 = items[Math.floor(Math.random() * items.length)];
    let index1 = items.indexOf(item1);
    items.splice(index1, 1);

    item2 = items[Math.floor(Math.random() * items.length)];
    let index2 = items.indexOf(item2);
    items.splice(index2, 1);

    item3 = items[Math.floor(Math.random() * items.length)];
    let index3 = items.indexOf(item3);
    items.splice(index3, 1);

    playerData.forEach(player => {
        if(player.socket==socket){
            let lastidcard=player.hand[player.hand.length-1].id
            let nameofpushcard1=item1.playcard
            let nameofpushcard2=item2.playcard
            let nameofpushcard3=item3.playcard
            let element1={"id":lastidcard+1,"card":nameofpushcard1}
            let element2={"id":lastidcard+2,"card":nameofpushcard2}
            let element3={"id":lastidcard+3,"card":nameofpushcard3}

            console.log(element1)
            console.log(element2)
            console.log(element3)



            player.hand.push(element1)
            player.hand.push(element2)
            player.hand.push(element3)
        }
    });
}
else{
    statuspick="Cannotpick"
    console.log("Do not have enough playing cards")
}
return statuspick
}
function removeWells(playerData,sock){
    playerData.forEach(player=>{
        if(player.socket==sock){
        let status="true"  
          player.hand.forEach(function(data,index,object){
            if(data.card=="Wells Fargo"&&status=="true"){
              status="false"  
              object.splice(index,1)
              return
            }
          })
        }
      })
}
module.exports= {
    randompickthreecards,
    removeWells
}  