
//Join Game button
$(document).ready(function () {
  $('.modal').modal();

  $("#joinGameBtn").click(function () {
    let username = $('#joinName').val()
    let action = 'joined the game'
    if (username != "") {
      const user = {
        user: username,
        socket: socketid,
      }
      $.get('/submitname', user, function (responsedata) {
        alert(responsedata)
        if (responsedata == "Successful") {
          nameplayer = user.user

          let data = {
            name: username,
            action: action,
            socket: socketid
          }

          $.get('/actionLog', data)
          $.get('/newUser', data)
          setTimeout(displayGameBoard(), 1000);

        }
        statusregis = responsedata
      })
      $('#joinName').val("")
    }
    else {
      alert("Username cannot be null")
    }
  });

  $("#joinName").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      let username = $('#joinName').val()
      let action = 'joined the game'
      if (username != "") {
        const user = {
          user: username,
          socket: socketid,
        }
        $.get('/submitname', user, function (responsedata) {
          alert(responsedata)
          if (responsedata == "Successful") {
            nameplayer = user.user

            let data = {
              name: username,
              action: action,
              socket: socketid
            }

            $.get('/actionLog', data)
            $.get('/newUser', data)

            setTimeout(Board(), 1000);
          }
          statusregis = responsedata
        })
        $('#joinName').val("")

      }
      else {
        alert("Username is not null")
      }
    }
  });
});




//Get number of user
function getstatusgame() {
  socket.on('statusgame', data => {
    $('#waiting').text(data)
  });
}