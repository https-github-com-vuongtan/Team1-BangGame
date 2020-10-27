let typecard=""
//Function update typecard
function updatetypecard(type){
typecard=type
}

//Update Weapon Card
function updateBang(){
    socket.on("bangUpdate",data=>{
        console.log("bang modal hit")
      const mydata= JSON.parse(data)
     mydata.forEach((data) => {
      if(data.socket==socketid){      
         $("#a5bangModal .card-image").append(`<img src="assets/cards/${data.character}.png" alt="${data.character}" class="responsive ${data.character}">`)
         $("#a5bangModal .card-content").append(`${data.name}`)            
         displayBang(mydata,data)
      }
      })
  
    })
  }

  function displayBang(mydata,data){
    console.log(data.id)
  if(data.id==1){
    // c5
    $("#c5bangModal .card-image").append(`<img src="assets/cards/${mydata[2].character}.png" alt="${mydata[2].character}" class="responsive ${mydata[2].character}">`)
    $("#c5bangModal .card-content").append(`${mydata[2].name}`)
    $("#c5bangModal .btn-floating").attr('data-target',`${mydata[2].id}`)
      
    // b5
    $("#b5bangModal .card-image").append(`<img src="assets/cards/${mydata[1].character}.png" alt="${mydata[1].character}" class="responsive ${mydata[1].character}">`)
    $("#b5bangModal .card-content").append(`${mydata[1].name}`)
    $("#b5bangModal .btn-floating").attr('data-target',`${mydata[1].id}`)

    // d5

    $("#d5bangModal .card-image").append(`<img src="assets/cards/${mydata[3].character}.png" alt="${mydata[3].character}" class="responsive ${mydata[3].character}">`)
    $("#d5bangModal .card-content").append(`${mydata[3].name}`)
    $("#d5bangModal .btn-floating").attr('data-target',`${mydata[3].id}`)

    // e5
    $("#e5bangModal .card-image").append(`<img src="assets/cards/${mydata[4].character}.png" alt="${mydata[4].character}" class="responsive ${mydata[4].character}">`)
    $("#e5bangModal .card-content").append(`${mydata[4].name}`)
    $("#e5bangModal .btn-floating").attr('data-target',`${mydata[4].id}`)

   }
  else if(data.id==2){
     // c5
     $("#c5bangModal .card-image").append(`<img src="assets/cards/${mydata[3].character}.png" alt="${mydata[3].character}" class="responsive ${mydata[3].character}">`)
     $("#c5bangModal .card-content").append(`${mydata[3].name}`)
     $("#c5bangModal .btn-floating").attr('data-target',`${mydata[3].id}`)
       
     // b5
     $("#b5bangModal .card-image").append(`<img src="assets/cards/${mydata[2].character}.png" alt="${mydata[2].character}" class="responsive ${mydata[2].character}">`)
     $("#b5bangModal .card-content").append(`${mydata[2].name}`)
     $("#b5bangModal .btn-floating").attr('data-target',`${mydata[2].id}`)
 
     // d5
 
     $("#d5bangModal .card-image").append(`<img src="assets/cards/${mydata[4].character}.png" alt="${mydata[4].character}" class="responsive ${mydata[4].character}">`)
     $("#d5bangModal .card-content").append(`${mydata[4].name}`)
     $("#d5bangModal .btn-floating").attr('data-target',`${mydata[4].id}`)
 
     // e5
     $("#e5bangModal .card-image").append(`<img src="assets/cards/${mydata[0].character}.png" alt="${mydata[0].character}" class="responsive ${mydata[0].character}">`)
     $("#e5bangModal .card-content").append(`${mydata[0].name}`)
     $("#e5bangModal .btn-floating").attr('data-target',`${mydata[0].id}`)
 
  }
  else if(data.id==3){
  // c5
  $("#c5bangModal .card-image").append(`<img src="assets/cards/${mydata[4].character}.png" alt="${mydata[4].character}" class="responsive ${mydata[4].character}">`)
  $("#c5bangModal .card-content").append(`${mydata[4].name}`)
  $("#c5bangModal .btn-floating").attr('data-target',`${mydata[4].id}`)
    
  // b5
  $("#b5bangModal .card-image").append(`<img src="assets/cards/${mydata[3].character}.png" alt="${mydata[3].character}" class="responsive ${mydata[3].character}">`)
  $("#b5bangModal .card-content").append(`${mydata[3].name}`)
  $("#b5bangModal .btn-floating").attr('data-target',`${mydata[3].id}`)

  // d5

  $("#d5bangModal .card-image").append(`<img src="assets/cards/${mydata[0].character}.png" alt="${mydata[0].character}" class="responsive ${mydata[0].character}">`)
  $("#d5bangModal .card-content").append(`${mydata[0].name}`)
  $("#d5bangModal .btn-floating").attr('data-target',`${mydata[0].id}`)

  // e5
  $("#e5bangModal .card-image").append(`<img src="assets/cards/${mydata[1].character}.png" alt="${mydata[1].character}" class="responsive ${mydata[1].character}">`)
  $("#e5bangModal .card-content").append(`${mydata[1].name}`)
  $("#e5bangModal .btn-floating").attr('data-target',`${mydata[1].id}`)

  }
  else if(data.id==4){
 // c5
 $("#c5bangModal .card-image").append(`<img src="assets/cards/${mydata[0].character}.png" alt="${mydata[0].character}" class="responsive ${mydata[0].character}">`)
 $("#c5bangModal .card-content").append(`${mydata[0].name}`)
 $("#c5bangModal .btn-floating").attr('data-target',`${mydata[0].id}`)
   
 // b5
 $("#b5bangModal .card-image").append(`<img src="assets/cards/${mydata[4].character}.png" alt="${mydata[4].character}" class="responsive ${mydata[4].character}">`)
 $("#b5bangModal .card-content").append(`${mydata[4].name}`)
 $("#b5bangModal .btn-floating").attr('data-target',`${mydata[4].id}`)

 // d5

 $("#d5bangModal .card-image").append(`<img src="assets/cards/${mydata[1].character}.png" alt="${mydata[1].character}" class="responsive ${mydata[1].character}">`)
 $("#d5bangModal .card-content").append(`${mydata[1].name}`)
 $("#d5bangModal .btn-floating").attr('data-target',`${mydata[1].id}`)

 // e5
 $("#e5bangModal .card-image").append(`<img src="assets/cards/${mydata[2].character}.png" alt="${mydata[2].character}" class="responsive ${mydata[2].character}">`)
 $("#e5bangModal .card-content").append(`${mydata[2].name}`)
 $("#e5bangModal .btn-floating").attr('data-target',`${mydata[2].id}`)

  }
  else if(data.id==5){
 // c5
 $("#c5bangModal .card-image").append(`<img src="assets/cards/${mydata[1].character}.png" alt="${mydata[1].character}" class="responsive ${mydata[1].character}">`)
 $("#c5bangModal .card-content").append(`${mydata[1].name}`)
 $("#c5bangModal .btn-floating").attr('data-target',`${mydata[1].id}`)
   
 // b5
 $("#b5bangModal .card-image").append(`<img src="assets/cards/${mydata[0].character}.png" alt="${mydata[0].character}" class="responsive ${mydata[0].character}">`)
 $("#b5bangModal .card-content").append(`${mydata[0].name}`)
 $("#b5bangModal .btn-floating").attr('data-target',`${mydata[0].id}`)

 // d5

 $("#d5bangModal .card-image").append(`<img src="assets/cards/${mydata[2].character}.png" alt="${mydata[2].character}" class="responsive ${mydata[2].character}">`)
 $("#d5bangModal .card-content").append(`${mydata[2].name}`)
 $("#d5bangModal .btn-floating").attr('data-target',`${mydata[2].id}`)

 // e5
 $("#e5bangModal .card-image").append(`<img src="assets/cards/${mydata[3].character}.png" alt="${mydata[3].character}" class="responsive ${mydata[3].character}">`)
 $("#e5bangModal .card-content").append(`${mydata[3].name}`)
 $("#e5bangModal .btn-floating").attr('data-target',`${mydata[3].id}`)

  }

  $(`#bangModal .btn-floating`).click(function() {
    data ={
      targetId: $(this).data("target"),
      name: data.name,
      distance: $(this).data("distance")
    }
    if(typecard=="bang"){
    $.get('/shootBang', data)
    $(`#bangModal`).modal('close')
    }
    else if(typecard=="duel")
      {
        console.log("Check again")
        $.get('/dueltrigger', data,response=>{
          console.log(response)
        })
        $(`#bangModal`).modal('close') ;
      }
    
  });



  }


  