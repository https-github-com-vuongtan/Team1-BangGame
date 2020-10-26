const { json } = require('express');
const express = require('express')
const moment = require('moment')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const getrandomcharactercards = require("./Modules-ServerSide/randomCharacterModule")
const getrandomrolecards = require("./Modules-ServerSide/randomRoleModule")
const getpauseandend = require("./Modules-ServerSide/PauseAndEndServerModule")
const elimination = require("./Modules-ServerSide/playerEliminationModule")

let count = 0
let listdesuser = []
let checkuserexist = false
let statusgame = ""
let socketofeachuser;
let checksocketexist = false
let playerData = []
let discardPile = []

let currenttime = ""
let phasetime = ""
let phasestatus = ""
let statuscharactercard = ""

let minutes = ""
let seconds = ""
let idround = 1


let statusphase = ""
let statuspause = ""
let pausetime = 0
let listcharactercards = require("./json lists/CharacterCardsList.json")
let listedrolecards = require("./json lists/roleCardList.json")
let newPlayer = require("./json lists/playerDataList.json")
let myvar2;

let player = {
  name: "name",
  socket: "empty",
  id: "empty",
  role: "role",
  character: "character",
  position: "position",
  maxLife: "maxLife",
  currentLife: "currentLife",
  weapon: "weapon",
  scope: false,
  mustang: false,
  barrel: false,
  jail: false,
  dynamite: false,
  hand: [
    { "id": 1, "name": 'empty', }
  ],
}

//Interval for getting time
let myVar = setInterval(checkcurrenttime, 100);
//Interval for updating phase
let myVar1 = setInterval(updatephase, 100);
//Interval for pausing time



//Run node as a web server for hosting static files (html)
app.use(express.static(__dirname + "/public"))

function checkcurrenttime() {
  if (statuspause != "off") {
    currenttime = new Date()
  }
  if (statuspause == "on") {
    phasetime.setSeconds(phasetime.getSeconds() + pausetime);
    statuspause = ""
  }
  // Find the distance between now and the count down date
  let distance = phasetime - currenttime;
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //When starting game, we will start randomly give character card to each user
  if (statusgame == 'START GAME' && statuscharactercard == "") {
    getrandomcharactercards.getrandomcharactercards(listcharactercards, playerData)
    io.emit("randomgivecharacter", JSON.stringify(playerData))
    getrandomrolecards.getrandomRole(listedrolecards, playerData)
    console.log(playerData)
    io.emit("updateRole", JSON.stringify(playerData))
    io.emit("bulletUpdate", JSON.stringify(playerData))
    io.emit("weaponUpdate", JSON.stringify(playerData))
    io.emit("updatePlayerName", JSON.stringify(playerData))
    io.emit("handUpdate", JSON.stringify(playerData))
    io.emit("bangUpdate", JSON.stringify(playerData))
    io.emit("cardsInHandUpdate", JSON.stringify(playerData))

    statuscharactercard = "Finished"
  }
  if (phasetime != "") {
    let data = { min: minutes, sec: seconds, name: statusphase.name, phase: statusphase.phase }
    io.emit("timeupdate", data)
  }
}
app.get("/pause", function (req, res) {
  let status = req.query.stat
  console.log(status)
  if (status == "off") {
    res.send("OK")
    pausetime = 0
    getpauseandend.setintervaltime(pausetime)
    statuspause = "off"
  }
  else if (status == "on") {
    res.send("OK")
    pausetime = getpauseandend.returnpausetime()
    statuspause = "on"
  }
})
app.get("/endphase", function (req, res) {
  phasetime = getpauseandend.endphase(phasetime, currenttime)
  res.send("OK")

})


//Function for updating phase
function updatephase() {
  if (statusgame == 'START GAME' && phasestatus == "") {
    phasestatus = "Starting"
  }
  if (phasestatus == "Starting") {
    statusphase = { id: idround, phase: 1, name: playerData[idround - 1].name, socket: playerData[idround - 1].socket }
    phasetime = new Date(currenttime);
    phasetime.setSeconds(phasetime.getSeconds() + 15);
    data = { name: statusphase.name, action: ` Started Phase ${statusphase.phase} ` }
    io.emit("updateactionlog", data)
    io.emit("infophase", statusphase)
    phasestatus = "Ongoing"
    return;
  }
  if (minutes == 0 && seconds == 0 && phasestatus == "Ongoing" && statusphase.phase == 1) {
    statusphase = { id: idround, phase: 2, name: playerData[idround - 1].name, socket: playerData[idround - 1].socket }
    phasetime = new Date(currenttime);
    phasetime.setSeconds(phasetime.getSeconds() + 60);
    data = { name: statusphase.name, action: ` Started Phase ${statusphase.phase} ` }
    io.emit("updateactionlog", data)
    io.emit("infophase", statusphase)
    return;

  }

  if (minutes == 0 && seconds == 0 && phasestatus == "Ongoing" && statusphase.phase == 2) {
    //if hand under limit go straight to next turn (skip phase 3)
    if (playerData[idround - 1].hand.length <= playerData[idround - 1].currentLife) {
      if (idround == 5) {
        idround = 1
      }
      else {
        idround++
      }

      statusphase = { id: idround, phase: 1, name: playerData[idround - 1].name, socket: playerData[idround - 1].socket, discardNeeded: false }
      phasetime = getpauseandend.endphase(phasetime, currenttime)
      phasetime.setSeconds(phasetime.getSeconds() + 15);
      io.emit("infophase", statusphase)
      return;
    } else {
      //otherwise go to phase 3 as normal
      statusphase = { id: idround, phase: 3, name: playerData[idround - 1].name, socket: playerData[idround - 1].socket }
      phasetime = new Date(currenttime);
      phasetime.setSeconds(phasetime.getSeconds() + 20);
      data = { name: statusphase.name, action: ` Started Phase ${statusphase.phase} ` }
      io.emit("updateactionlog", data)
      io.emit("infophase", statusphase)
      return;
    }
  }

  if (minutes == 0 && seconds == 0 && phasestatus == "Ongoing" && statusphase.phase == 3) {
    if (idround == 5) {
      idround = 1
    }
    else {
      idround++
    }
    statusphase = { id: idround, phase: 1, name: playerData[idround - 1].name, socket: playerData[idround - 1].socket }
    phasetime = new Date(currenttime);
    phasetime.setSeconds(phasetime.getSeconds() + 15);
    io.emit("infophase", statusphase)
    return;
  }

}

//Function to update user id (position) after one user go out the game room
function order_user(deleteid) {
  if (deleteid == 1) {
    playerData.forEach((user) => {
      user.id--
      user.position--
    });
  }
  else if (deleteid != 1 && deleteid < 5) {
    playerData.forEach((user) => {
      if (user.id > deleteid) {
        user.id--
        user.position--
      }
    });
  }
}

// Function to check username is exist or not
function checkexist(username, socketid) {
  playerData.forEach((user) => {
    if (user.name == username) {
      checkuserexist = true
      return;
    }
  });
}
// Function to check username is exist or not
function checksocketidexist(username, socketid) {
  playerData.forEach((user) => {
    if (user.socket == socketid) {
      checksocketexist = true
      return;
    }
  });
}
//Function to check validation of username input
function checkvalidation(username, socketid, res) {
  checkexist(username, socketid)
  checksocketidexist(username, socketid)
  if (username == null) {
    message = "Error"
  }
  else if (checkuserexist == true) {
    message = "This username already exists"
    checkuserexist = false
  }
  else if (checksocketexist == true) {
    message = "You already registered"
    checksocketexist = false
  }
  else if (playerData.length >= 5) {
    message = "There are five people in game room"
  }
  else {
    message = "Successful"
  }
  return message
}

//Function to push user information to list
function pushdatatolist(username, socketid) {
  count++
  let newPlayer = {
    name: username,
    socket: socketid,
    id: count,
    role: "role",
    character: "character",
    position: count,
    maxLife: "maxLife",
    currentLife: "currentLife",
    weapon: "colt45",
    range: 1,
    distanceMod: 0,
    scope: true,
    mustang: true,
    barrel: false,
    jail: false,
    dynamite: false,
    eliminated: false,
    hand: [
      { "id": 1, "card": 'bang', },
      { "id": 2, "card": 'bang', },
      { "id": 3, "card": 'saloon', },
      { "id": 4, "card": 'saloon', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'missed', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'panic', },
      { "id": 4, "card": 'missed', },

    ],
  }
  playerData.push(newPlayer);
  io.emit("descriptionuser", JSON.stringify(playerData))
  io.emit("statusgame", "Wating for " + (5 - playerData.length) + "")
}

//Function to count the number players
function checknumberofplayer() {
  const numberofuser = playerData.length
  // If array length =5 (enough players) => Game Status=Game start
  if (numberofuser == 5) {
    statusgame = "START GAME"
    io.emit("statusgame", statusgame)
  }
  //If do not have enough player => Return the amount of waiting players.
  else {
    if ((5 - playerData.length) == 1) {
      statusgame = "Wating for 1 more person"
    } else {
      statusgame = "Wating for " + (5 - playerData.length) + " more people"
      io.emit("statusgame", statusgame)
    }
  }
}
function checkuserdisconnect(socketid) {
  let username
  playerData.forEach((user) => {
    if (user.socket == socketid) {
      username = user.name
      return
    }
  });
  return username
}


//Function when one user out game
function userdisconnection(socketidout) {
  playerData.forEach((user) => {
    if (user.socket == socketidout) {
      if (statuscharactercard = "Finished") {
        user.currentLife = 0;
        io.emit("bulletUpdate", JSON.stringify(playerData))
        eliminatePlayer(user, null);
      }
      else {
        console.log(socketidout)
        let lengtharrayuser = playerData.length
        let deleteid = user.id
        playerData.splice((user.id - 1), 1)
        count--
        if (lengtharrayuser > 0) {
          order_user(parseInt(deleteid))
        }
      }
      io.emit("descriptionuser", JSON.stringify(playerData))
    }
    return;
  });
  // Update the amount of waiting players
  if (statusgame != "start game") {
    io.emit("statusgame", "Wating for " + (5 - playerData.length) + " more")
  }
}
app.get('/submitname', function (req, res) {
  const username = req.query.user
  const socketid = req.query.socket
  message = checkvalidation(username, socketid, res)
  res.send(message)
  if (message == "Successful") {
    pushdatatolist(username, socketid)
    io.emit("updateInitialPlayerName", JSON.stringify(playerData))

  }
  checknumberofplayer()
});

app.get('/desuser', function (req, res) {
  res.send("Wating for " + (5 - playerData.length) + " more")
  io.emit("descriptionuser", JSON.stringify(playerData))
});

app.get('/status', function (req, res) {
  io.emit("statusgame", "Wating for " + (5 - playerData.length) + " more")
});
app.get('/socketid', function (req, res) {
  res.send(socketofeachuser)
});

app.get('/chatbox', function (req, res) {
  const name = req.query.name
  const description = req.query.descriptiontext
  const data = {
    name: name,
    description: description,
    action: 'purple monkey dishwasher'
  }
  io.emit("updatechatbox", data)
  res.send("OK")
});

app.get('/actionLog', function (req, res) {
  const name = req.query.name
  const action = req.query.action
  const data = {
    name: name,
    action: action
  }
  io.emit("updateactionlog", data)
  res.send("action log hit")
});

app.get('/playSaloon', function (req, res) {
  const data = {
    name: req.query.name,
    action: `played saloon`
  }
  io.emit("updateactionlog", data);

  playerData.forEach(player => {

    if (player.currentLife < player.maxLife && !player.eliminated) {
      player.currentLife++;
      const data = {
        name: player.name,
        action: `gained a life point`
      }
      io.emit("updateactionlog", data)
    }
  })
  io.emit("bulletUpdate", JSON.stringify(playerData));
  res.send("saloon played");
})

app.get('/playPanic', function (req, res) {
  let panicPlayerName = req.query.name;
  let targetIndex = req.query.targetPlayerIndex;
  let targetCard = req.query.targetCard;
  let card = "none";
  let cardIndex;
  switch (targetCard) {
    //if mystery "in hand" card chosen, pick a random card and remove from target

    case ("mystery"):
      cardIndex = Math.floor(Math.random() * (playerData[targetIndex].hand.length))
      let cardHand = playerData[targetIndex].hand.splice(cardIndex, 1);
      card = cardHand[0].card;
      //fix target hand indexing post card removal
      for (i = 0; i < playerData[targetIndex].hand.length; i++) {
        playerData[targetIndex].hand[i].id = i + 1;
      }
      break;
    //if an "in play" card, set target value to false and make it the card to be added to panic player
    case ("scope"):
      playerData[targetIndex].scope = false
      card = "scope";
      break;
    case ("mustang"):
      playerData[targetIndex].mustang = false
      card = "mustang";
      break;
    case ("barrel"):
      playerData[targetIndex].barrel = false
      card = "barrel";
      break;
    case ("jail"):
      playerData[targetIndex].jail = false
      card = "jail";
      break;
    case ("dynamite"):
      playerData[targetIndex].dynamite = false
      card = "dynamite";
      break;
    case ("remington"):
      playerData[targetIndex].weapon = "colt45"
      card = "remington";
      break;
    case ("rev carabine"):
      playerData[targetIndex].weapon = "colt45"
      card = "rev carabine";
      break;
    case ("schofield"):
      playerData[targetIndex].weapon = "colt45"
      card = "schofield";
      break;
    case ("volcanic"):
      playerData[targetIndex].weapon = "colt45"
      card = "volcanic";
      break;
    case ("winchester"):
      playerData[targetIndex].weapon = "colt45"
      card = "winchester";
      break;
    default:
      console.log("card not found");
  }
  if (card != "none") {
    playerData.forEach(player => {
      //add the card to panic player's hand
      if (player.name == panicPlayerName) {
        player.hand.push({ id: (player.hand.length + 1), card: card })
      }
    })
  } else {
    console.log("panic error: no card selection found")
  }

  io.emit("handUpdate", JSON.stringify(playerData));
  io.emit("cardsInPlayUpdate", JSON.stringify(playerData));

  const data = {
    name: req.query.name,
    action: `played panic on ${playerData[targetIndex].name}`
  }
  io.emit("updateactionlog", data);
  res.send("panic played");
})

app.get('/shootBang', function (req, res) {
  const targetId = req.query.targetId
  const attackerName = req.query.name
  playerData.forEach(player => {
    if (player.id == targetId) {
      player.hand.forEach(card => {
        console
        if (card.some == "missed") {
          io.to(player.socket).emit("missedOption", playerData, attackerName)
        }
        else {
          player.currentLife = player.currentLife - 1
          const data = {
            name: attackerName,
            action: `shot ${player.name}`
          }
          io.emit("updateactionlog", data)
          io.emit("bulletUpdate", JSON.stringify(playerData))
          //kat added for testing elimination - remove later
          if (player.currentLife < 1) {
            eliminatePlayer(player, null);
          }
          //END kat added
          res.send(console.log(`${player.name} is now on ${player.currentLife} lives`))
        }
      })


    }

  })
  //  playerData.forEach(attacker =>{})
})

app.get('/discardHandCard', function (req, res) {
  let index = req.query.index;
  let name = req.query.name;
  let discardedCard = [];
  playerData.forEach(player => {
    if (player.name == name) {
      discardedCard = player.hand.splice(index, 1);
      discardPile.push({ "card": discardedCard[0].card });

      for (i = 0; i < player.hand.length; i++) {
        player.hand[i].id = i + 1;
      }
    }
  })
  io.emit("handUpdate", JSON.stringify(playerData))
  res.send(console.log(`${discardedCard[0].card} added to the discard pile`));
})

//checks hand size against current lives, ends turn if not over the limit.
app.get('/checkHandSizeEndTurn', function (req, res) {
  let name = req.query.name;
  playerData.forEach(player => {
    if (player.name == name) {
      if (player.hand.length <= player.currentLife) {
        //do the same as endphase method
        phasetime = getpauseandend.endphase(phasetime, currenttime);
        res.send(console.log(`${player.name} turn ended`));
      } else {
        res.send(console.log(`${player.name} must discard another card`));
      }
    }
  })
})


//if no killer (eg, killed by dynamite), playerKiller is null
function eliminatePlayer(deadPlayer, killerPlayer) {
  let outcome = elimination.eliminationLogic(playerData, deadPlayer, killerPlayer, discardPile);
  for (i = 0; i < outcome.actionLogArray.length; i++) {
    let actionData = outcome.actionLogArray[i];
    io.emit("updateactionlog", actionData);
  }
  io.emit("handUpdate", JSON.stringify(playerData));
  io.emit("playerEliminated", JSON.stringify(playerData));

  if (outcome.winnerRole != "None") {

    let endData = {
      winningRole: outcome.winnerRole,
      winnerArray: outcome.winnerArray
    }
    //can add those with matching roles (include deputy for sheriff) to winner history DB *****
    io.emit("endGame", JSON.stringify(endData));
    statusgame = 'gameover';
    //clear playerdata for newgame
    initialiseGameData();
  }
}

function initialiseGameData() {
  count = 0;
  listdesuser = [];
  checkuserexist = false;
  statusgame = ""
  socketofeachuser = "";
  checksocketexist = false;
  currenttime = "";
  phasetime = "";
  phasestatus = "";
  statuscharactercard = "";
  minutes = "";
  seconds = "";
  idround = 1;
  statusphase = "";
  statuspause = "";
  pausetime = 0;
  listcharactercards = require("./json lists/CharacterCardsList.json");
  listedrolecards = require("./json lists/roleCardList.json");
  newPlayer = require("./json lists/playerDataList.json");
  setTimeout(() => {
    playerData.splice(0, playerData.length);
    discardPile.splice(0, playerData.length);
  }, 3000)
}

app.get('/newUser', function (data) {
  const name = data.name
  const socketid = data.socket

})

io.on('connection', (socket) => {
  socketofeachuser = socket.id
  socket.on('disconnect', (reason) => {
    const data = {
      name: "user",
      action: " disconnected"
    }

    userdisconnection(socket.id)
    io.emit("updateactionlog", data)
  });


});


function insertion() {
  // Replace the following with your Atlas connection string                                                                                                                                        
  const url = "mongodb+srv://eGTB4yl0HFJQ6lzD:eGTB4yl0HFJQ6lzD@project.wdfid.mongodb.net/Project?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  async function run() {
    try {
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db("project");

      var col = db.collection("login");
      var myobj = { username: "voungtan", address: "Highway 37" };
      await col.insertOne(myobj);

      col = db.collection("viewuserscoredata");
      myobj = { user_name: "voungtan", Score: 37000, Round: 1, Datetime: "04/30/2020 13:01:01" };
      await col.insertOne(myobj);
      col = db.collection("historytabledata");
      myobj = { user_name: "voungtan", Score: 37000, Round: 1, Datetime: "04/30/2020 13:01:01" };
      await col.insertOne(myobj);

      col = db.collection("startinggamedata");
      myobj = {
        user_name: "voungtan", Total_players: 5, Character_Cards: 16, Role_Cards: 7, Playing_Cards: 80, Character_Card_Name: "Bart Cassidy", Character_Card_Feature_Description: "This is a card", Character_Bullets: 4, Role_Card_Name: "Sheriff"
        , Role_Card_Feature_Description: "This is Description", Playing_Card_Name: "Playing_Card_Name", Color_Playing_Card: "Blue", Character_Card_Images: "", Role_Card_Images: "", Playing_Card_Images: ""
      };
      await col.insertOne(myobj);
      col = db.collection("Displaygameinterface");
      myobj = { user_name: "voungtan", User_character_card_Images: "", User_Role_Card_Images: "", User_Playing_card_Images: "", Current_Bullets: "", Table_Card_Images: "" };
      await col.insertOne(myobj);
      col = db.collection("Randomlygiveonecharactercard");
      myobj = { user_name: "voungtan", Character_Cards: "Highway 37", Character_Card_Name: "" };
      await col.insertOne(myobj);
      col = db.collection("Applylimitedtimeplayerturn");
      myobj = { user_name: "voungtan", Current_time: "Highway 37", Limited_time: "" };
      await col.insertOne(myobj);
      col = db.collection("Applyfeatureofcharactercard");
      myobj = { user_name: "voungtan", Character_Card_Name: "Highway 37", CharacterCard_Feature_Description: "" };
      await col.insertOne(myobj);
      col = db.collection("Applyfeatureofrolecard");
      myobj = { user_name: "voungtan", Role_Card_name: "Highway 37", Role_Card_Feature_Description: "" };
      await col.insertOne(myobj);
      col = db.collection("Applyplayersorder");
      myobj = { user_name: "voungtan", User_Order: 4 };
      await col.insertOne(myobj);
      col = db.collection("Applycurrentdistance");
      myobj = { user_name: "voungtan", Distance_user_to_opponents: 4, Distance_opponents_to_user: 2 };
      await col.insertOne(myobj);
      col = db.collection("Drawingcards");
      myobj = { user_name: "voungtan", Current_user_cards: "tst", Updated_user_cards: "order", Current_user_card_images: "", Updated_user_card_images: "" };
      await col.insertOne(myobj);
      col = db.collection("Usercanplayspecificcards");
      myobj = { user_name: "voungtan", Current_user_cards: "tst", Updated_user_cards: "order", Current_user_card_images: "", Updated_user_card_images: "" };
      await col.insertOne(myobj);
      col = db.collection("Rewardfunction");
      myobj = { user_name: "voungtan", Current_user_cards: "tst", Updated_user_cards: "order", Current_user_card_images: "", Updated_user_card_images: "" };
      await col.insertOne(myobj);
      col = db.collection("Bangfunction");
      myobj = { user_name: "voungtan", Target_name: "tst", Playing_Card_Name: "order", Updated_Bullets: "", Current_Bullets: "" };
      await col.insertOne(myobj);
      col = db.collection("Missedfunction");
      myobj = { user_name: "voungtan", Target_name: "tst", Playing_Card_Name: "order" };
      await col.insertOne(myobj);
      col = db.collection("ncreaseandDecreaseDistance");
      myobj = {
        user_name: "voungtan", Target_name: "tst", increaseorDecrease_Distance_user_opponents: "order", IncreaseorDecreaseDistance_opponents_user: "",
        Distance_user_to_opponents: "Distance_user_to_opponents", Distance_opponents_to_user: 'Distance_opponents_to_user'
      };
      await col.insertOne(myobj);
      col = db.collection("changingweapon");
      myobj = { user_name: "voungtan", Current_Weapon: "tst", Distance_current_weapon: "order", Updated_Weapon: "", Distance_updated_weapon: "" }
      await col.insertOne(myobj);

      col = db.collection("DrawFunction");
      myobj = { user_name: "voungtan", Playing_Card_Name: "tst", Used_Compared_Card: "order", Updated_user_cards: "" }
      await col.insertOne(myobj);
      col = db.collection("Drawoneplayerscard");
      myobj = { user_name: "voungtan", Target_name: "tst", Playing_Card_Name: "order", Updated_user_cards: "" }
      await col.insertOne(myobj);
      col = db.collection("Discardingcardfromanotherperson");
      myobj = { user_name: "voungtan", Target_name: "tst", Playing_Card_Name: "order", Updated_user_cards: "" }
      await col.insertOne(myobj);
      col = db.collection("Discardingcardfromgame");
      myobj = { user_name: "voungtan", Playing_Card_Name: "tst", Updated_Table_Card: "order" }
      await col.insertOne(myobj);
      col = db.collection("Jailfunction");
      myobj = { user_name: "voungtan", Targetname: "tst", Playing_Card_Name: "order" }
      await col.insertOne(myobj);
      col = db.collection("Gunbattle");
      myobj = { user_name: "voungtan", Targetname: "tst", Playing_Card_Name: "order", Current_Bullets: 3, Updated_Bullets: 2 }
      await col.insertOne(myobj);
      col = db.collection("Storeusersscore");
      myobj = { user_name: "voungtan", Rank: 1, Round: 1 }
      await col.insertOne(myobj);
      col = db.collection("Displaywinningplayer");
      myobj = { user_name: "voungtan", Rank: 1, Round: 1 }
      await col.insertOne(myobj);
      col = db.collection("Disconnection");
      myobj = { user_name: "voungtan", Rank: 1, Round: 1, User_Order: 4 }
      await col.insertOne(myobj);
      col = db.collection("HistoryRecord");
      myobj = { RecordID: 1, Username: "Abo", Rank: 1, Round: 4 }
      await col.insertOne(myobj);
      col = db.collection("PlayingCard");
      myobj = { PlayingCardID: 1, PlayingCardID: "ACE", PlayingCardDescription: "hbchj", PlayingCardImages: "101124" }
      await col.insertOne(myobj);
      col = db.collection("RoleCard");
      myobj = { RoleCardID: 1, RoleCardName: "ACE", RoleCardDescription: "hbchj", RoleCardImages: "101124" }
      await col.insertOne(myobj);
      col = db.collection("CharacterCard");
      myobj = { CharacterCardID: 1, CharacterCardName: "ACE", CharacterCardDescription: "hbchj", CharacterCardImages: "101124" }
      await col.insertOne(myobj);


      console.log("Inserted");




    } catch (err) {
      console.log(err.stack);
    }
    finally {
      await client.close();
    }
  }
  run().catch(console.dir);
}
function connection() {
  // Replace the following with your Atlas connection string                                                                                                                                        
  const url = "mongodb+srv://eGTB4yl0HFJQ6lzD:eGTB4yl0HFJQ6lzD@project.wdfid.mongodb.net/Project?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  async function run() {
    try {
      await client.connect();
      console.log("Connected correctly to server");



    } catch (err) {
      console.log(err.stack);
    }
    finally {
      await client.close();
    }
  }

  run().catch(console.dir);
}
http.listen(3000, () => {
  connection();
  insertion(); //insertion now
  console.log('listening on *:3000');
});