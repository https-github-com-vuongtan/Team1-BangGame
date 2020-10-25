//Function to get information of phase
function getinforphase() {
  socket.on("infophase", data => {
    console.log("Roundof: " + data.name + "---RoundofID: " + data.id + "----Phase: " + data.phase)
    phaseuser = data.name
    socketphase = data.socket
    phasenumber = data.phase
    if (phaseuser == nameplayer && !eliminated) {
      switch (parseInt(phasenumber)) {
        case (1):
          $('#cardDeck').css('background-color', 'rgb(255,247,95)');
          $("#endTurn").addClass("hidden");
          $("#turnDraw").removeClass("hidden");
          $("#instructions").html("")
          break;
          case (2):
            $('#cardDeck').css('background-color', '');
            $("#instructions").html("Click cards to play or")
            $("#turnDraw").addClass("hidden");
            $("#endTurn").removeClass("hidden");
            break;
            case(3):
            $('#cardDeck').css('background-color', '');
            $("#endTurn").addClass("hidden");
            $("#instructions").html("Click cards to discard")
            $("#turnDraw").addClass("hidden");
            break;
      }  
      
    }
    else {
      $("#instructions").html("");
      $('#cardDeck').css('background-color', '');
      $("#endTurn").addClass("hidden");
      $("#turnDraw").addClass("hidden");
    }

  })
}
//Function Update up to second about phase information
function updatetime() {
  socket.on("timeupdate", data => {
    $("#nameturn").empty()
    $("#timeturn").empty()
    $("#phase").empty()
    console.log(data.phase)
    $("#nameturn").append("Player: " + data.name)
    $("#phase").append("Phase: " + data.phase)
    $("#timeturn").append("Seconds: " + data.sec)
  })
}
