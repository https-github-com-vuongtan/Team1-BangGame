//Random deliver charactercard
function updateName(){
    socket.on("updatePlayerName",data=>{
      const mydata= JSON.parse(data)
      mydata.forEach((data) => {
      if(data.socket==socketid){
         character=data.character
         $("#mainName").html(`${data.name}`)
         displayOrderName(mydata,data)
      }
      })
  
    })
  }
  //Get display order for character card
  function displayOrderName(mydata,data){
    console.log(data.id)
  if(data.id==1){
    $("#c5 .playerName").html(`${mydata[2].name}`)
    $("#b5 .playerName").html(`${mydata[1].name}`)
    $("#d5 .playerName").html(`${mydata[3].name}`)
    $("#e5 .playerName").html(`${mydata[4].name}`)
  }
  else if(data.id==2){
    $("#c5 .playerName").html(`${mydata[3].name}`)
    $("#b5 .playerName").html(`${mydata[2].name}`)
    $("#d5 .playerName").html(`${mydata[4].name}`)
    $("#e5 .playerName").html(`${mydata[0].name}`)
  }
  else if(data.id==3){
    $("#c5 .playerName").html(`${mydata[4].name}`)
    $("#b5 .playerName").html(`${mydata[3].name}`)
    $("#d5 .playerName").html(`${mydata[0].name}`)
    $("#e5 .playerName").html(`${mydata[1].name}`)
  }
  else if(data.id==4){
    $("#c5 .playerName").html(`${mydata[0].name}`)
    $("#b5 .playerName").html(`${mydata[4].name}`)
    $("#d5 .playerName").html(`${mydata[1].name}`)
    $("#e5 .playerName").html(`${mydata[2].name}`)
  }
  else if(data.id==5){
    $("#c5 .playerName").html(`${mydata[1].name}`)
    $("#b5 .playerName").html(`${mydata[0].name}`)
    $("#d5 .playerName").html(`${mydata[2].name}`)
    $("#e5 .playerName").html(`${mydata[3].name}`)
  }
  }