//Update Weapon Card
function updateWeapon(){
    socket.on("weaponUpdate",data=>{
      const mydata= JSON.parse(data)
     mydata.forEach((data) => {
      if(data.socket==socketid){
        let weapon = data.weapon
         console.log(weapon)
         $("#a5weapon").attr('src',"assets/cards/"+data.weapon+".png")
        // $("#mainCardsInPlay").append(`<img src="assets/cards/${data.weapon}.png" alt="weapon" class="responsive">`)
         displayWeapon(mydata,data)
      }
      })
  
    })
  }
  //Get display order for wapon card
  function displayWeapon(mydata,data){
    console.log(data.id)
  if(data.id==1){
    $("#c5WeaponCard").attr('src',"assets/cards/"+mydata[2].weapon+".png")
    $("#b5WeaponCard").attr('src',"assets/cards/"+mydata[1].weapon+".png")
    $("#d5WeaponCard").attr('src',"assets/cards/"+mydata[3].weapon+".png")
    $("#e5WeaponCard").attr('src',"assets/cards/"+mydata[4].weapon+".png")
  }
  else if(data.id==2){
    $("#c5WeaponCard").attr('src',"assets/cards/"+mydata[3].weapon+".png")
    $("#b5WeaponCard").attr('src',"assets/cards/"+mydata[2].weapon+".png")
    $("#d5WeaponCard").attr('src',"assets/cards/"+mydata[4].weapon+".png")
    $("#e5WeaponCard").attr('src',"assets/cards/"+mydata[0].weapon+".png")
  }
  else if(data.id==3){
    $("#c5WeaponCard").attr('src',"assets/cards/"+mydata[4].weapon+".png")
    $("#b5WeaponCard").attr('src',"assets/cards/"+mydata[3].weapon+".png")
    $("#d5WeaponCard").attr('src',"assets/cards/"+mydata[0].weapon+".png")
    $("#e5WeaponCard").attr('src',"assets/cards/"+mydata[1].weapon+".png")
  }
  else if(data.id==4){
    $("#c5WeaponCard").attr('src',"assets/cards/"+mydata[0].weapon+".png")
    $("#b5WeaponCard").attr('src',"assets/cards/"+mydata[4].weapon+".png")
    $("#d5WeaponCard").attr('src',"assets/cards/"+mydata[1].weapon+".png")
    $("#e5WeaponCard").attr('src',"assets/cards/"+mydata[2].weapon+".png")
  }
  else if(data.id==5){
    $("#c5WeaponCard").attr('src',"assets/cards/"+mydata[1].weapon+".png")
    $("#b5WeaponCard").attr('src',"assets/cards/"+mydata[0].weapon+".png")
    $("#d5WeaponCard").attr('src',"assets/cards/"+mydata[2].weapon+".png")
    $("#e5WeaponCard").attr('src',"assets/cards/"+mydata[3].weapon+".png")
  }
  }