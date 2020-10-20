//Random deliver charactercard
function updateRole(){
    socket.on("updateRole",data=>{
      const mydata= JSON.parse(data)
      mydata.forEach((data) => {
      if(data.socket==socketid){
         role=data.role
         console.log(data.role)
         $("#mainRoleCard").append(`<img src="assets/cards/${data.role}.png" alt="${data.role}" class="responsive ${data.role}">`)
         displaySherrif(mydata,data)
        }
          
      })
 
      })
    }
  
  //Get display order for character card
  function displaySherrif(mydata,data){
    console.log(data.id)
  if(data.id==1){
      if(mydata[2].role == "Sheriff"){
        $("#c5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
      }
      else if(mydata[1].role =="Sheriff"){
        $("#b5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
      }
      else if(mydata[3].role == "Sheriff"){
        $("#d5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
      }
      else if(mydata[4].role =="Sheriff"){
        $("#e5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
      }
  }
  else if(data.id==2){
    if(mydata[3].role == "Sheriff"){
        $("#c5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[2].role == "Sheriff"){
        $("#b5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[4].role == "Sheriff"){
        $("#d5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[0].role =="Sheriff"){
        $("#e5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
}
else if(data.id==3){
    if(mydata[4].role == "Sheriff"){
        $("#c5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[3].role =="Sheriff"){
        $("#b5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[0].role == "Sheriff"){
        $("#d5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[1].role =="Sheriff"){
        $("#e5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
}
if(data.id==4){
    if(mydata[0].role == "Sheriff"){
        $("#c5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[4].role =="Sheriff"){
        $("#b5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[1].role == "Sheriff"){
        $("#d5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[2].role =="Sheriff"){
        $("#e5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
}
if(data.id==5){
    if(mydata[1].role == "Sheriff"){
        console.log("Hello World")
        $("#c5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[0].role =="Sheriff"){
        console.log("Hello World")
        $("#b5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[2].role == "Sheriff"){
        console.log("Hello World")
        $("#d5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
    else if(mydata[3].role =="Sheriff"){
        console.log("Hello World")
        $("#e5 .characterCard").append(`<img  src="assets/SheriffStar.png" alt="Black Jack description" class="sheriffStar responsive">`)
    }
}
}