//Random deliver charactercard
function randomdelivercharactercard() {
  socket.on("randomgivecharacter", data => {
    const mydata = JSON.parse(data)
    mydata.forEach((data) => {
      if (data.socket == socketid) {
        character = data.character
        $("#maincharacterimage").attr('src', "assets/cards/" + data.character + ".png")
        $("#maincharacterimage").attr('alt', data.character)

        displayordercharacter(mydata, data)
      }
    })

  })
}
//Get display order for character card
function displayordercharacter(mydata, data) {
  console.log(data.id)
  if (data.id == 1) {
    $("#topleft").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#topleft").attr('alt',mydata[2].character)
    $("#midleft").attr('alt',mydata[1].character)
    $("#topright").attr('alt',mydata[3].character)
    $("#midright").attr('alt',mydata[4].character)
  }
  else if (data.id == 2) {
    $("#topleft").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#topleft").attr('alt',mydata[3].character)
    $("#midleft").attr('alt',mydata[2].character)
    $("#topright").attr('alt',mydata[4].character)
    $("#midright").attr('alt',mydata[0].character)
  }
  else if (data.id == 3) {
    $("#topleft").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#topleft").attr('alt',mydata[4].character)
    $("#midleft").attr('alt',mydata[3].character)
    $("#topright").attr('alt',mydata[0].character)
    $("#midright").attr('alt',mydata[1].character)
  }
  else if (data.id == 4) {
    $("#topleft").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#topleft").attr('alt',mydata[0].character)
    $("#midleft").attr('alt',mydata[4].character)
    $("#topright").attr('alt',mydata[1].character)
    $("#midright").attr('alt',mydata[2].character)
  }
  else if (data.id == 5) {
    $("#topleft").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#topleft").attr('alt',mydata[1].character)
    $("#midleft").attr('alt',mydata[0].character)
    $("#topright").attr('alt',mydata[2].character)
    $("#midright").attr('alt',mydata[3].character)
  }
}