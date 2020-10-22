//Update bullets in response to socket message
function displayBullets() {
  socket.on("bulletUpdate", data => {
    const playerData = JSON.parse(data)
    playerData.forEach((player) => {
      if (player.socket == socketid) {
        updateBulletDisplay(playerData, player)
      }
    })
  })
}

const getBulletString = (player) => {
  let bulletString = "";
  let i = 0;
  while (i < player.currentLife) {
    bulletString += '<img src="assets/bullet.png" alt="" class="responsive"></img>';
    i++;
  }
  return bulletString;
}

//will update all player's bullet display
function updateBulletDisplay(mydata, data) {
  $("#mainBullets").html(getBulletString(data));
  if (data.id == 1) {
    $("#c5 .bulletTray").html(getBulletString(mydata[2]));
    $("#b5 .bulletTray").html(getBulletString(mydata[1]));
    $("#d5 .bulletTray").html(getBulletString(mydata[3]));
    $("#e5 .bulletTray").html(getBulletString(mydata[4]));
  }
  else if (data.id == 2) {
    $("#c5 .bulletTray").html(getBulletString(mydata[3]));
    $("#b5 .bulletTray").html(getBulletString(mydata[2]));
    $("#d5 .bulletTray").html(getBulletString(mydata[4]));
    $("#e5 .bulletTray").html(getBulletString(mydata[0]));
  }
  else if (data.id == 3) {
    $("#c5 .bulletTray").html(getBulletString(mydata[4]));
    $("#b5 .bulletTray").html(getBulletString(mydata[3]));
    $("#d5 .bulletTray").html(getBulletString(mydata[0]));
    $("#e5 .bulletTray").html(getBulletString(mydata[1]));
  }
  else if (data.id == 4) {
    $("#c5 .bulletTray").html(getBulletString(mydata[0]));
    $("#b5 .bulletTray").html(getBulletString(mydata[4]));
    $("#d5 .bulletTray").html(getBulletString(mydata[1]));
    $("#e5 .bulletTray").html(getBulletString(mydata[2]));
  }
  else if (data.id == 5) {
    $("#c5 .bulletTray").html(getBulletString(mydata[1]));
    $("#b5 .bulletTray").html(getBulletString(mydata[0]));
    $("#d5 .bulletTray").html(getBulletString(mydata[2]));
    $("#e5 .bulletTray").html(getBulletString(mydata[3]));
  }
}

