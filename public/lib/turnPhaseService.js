//Function to get information of phase
function getinforphase(){
    socket.on("infophase",data=>{
     console.log("Roundof: " +data.name+"---RoundofID: "+data.id+"----Phase: "+data.phase)
     phaseuser=data.name
     socketphase=data.socket
     phasenumber=data.phase
     
    })
  }
  //Function Update up to second about phase information
  function updatetime(){
    socket.on("timeupdate",data=>{
      $("#nameturn").empty()
      $("#timeturn").empty()
      $("#phase").empty()
      console.log(data.phase)
      $("#nameturn").append("Player: " +data.name)
      $("#phase").append("Phase: " +data.phase)
      $("#timeturn").append("Seconds: "+data.sec)
  
     })
  }