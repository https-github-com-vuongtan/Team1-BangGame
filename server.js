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
const bang = require("./Modules-ServerSide/playBangModule")
const getgatling = require("./Modules-ServerSide/GaltingModule")
const getbeer = require("./Modules-ServerSide/BeerModule")
const getwellfargo = require("./Modules-ServerSide/WellsFargoModule")
const getduel = require("./Modules-ServerSide/DuelModule")
const getindians = require("./Modules-ServerSide/IndiansModule")
const getgeneral = require("./Modules-ServerSide/GeneralModule")
const weapon = require("./Modules-ServerSide/weaponChange")
const scope = require("./Modules-ServerSide/ScopeModule")
const barrel = require("./Modules-ServerSide/barrelModule")
//Katrina
const elimination = require("./Modules-ServerSide/playerEliminationModule")



let countgatling=0
let countresponsegatling=0
let pausetimeforgatling="false"


let count = 0
let listdesuser = []
let checkuserexist = false
let statusgame = ""
let socketofeachuser;
let checksocketexist=false
let playerData=[]
let discardPile = []

let currenttime = ""
let phasetime = ""
let phasestatus = ""
let statuscharactercard = ""

let minutes = ""
let seconds = ""
let idround = 1

let listcards



let Sheriffrole="false"
let statusphase=""
let statuspause=""
let pausetime=0
let listcharactercards = []
let listedrolecards = []
const { removeGatling } = require('./Modules-ServerSide/GaltingModule');
const { Console } = require('console');
let myvar2;
let listplaycards=[]


//Add db infor tolist playcards
  function pushdbtolistplaycards(dbdata){
    dbdata.forEach(function(data,index,object){
      let element={"id":index,"playcard":data["PlayingCardName"]}
      listplaycards.push(element)
    })
  }
//Add db infor tolist role cards
function pushdbtolistrole(dbdata){
  dbdata.forEach(function(data,index,object){
    let element={"id":index,"RoleCardName":data["RoleCardName"]}
    listedrolecards.push(element)
  })
}
//Add db infor tolist character cards
function pushtolistcharacter(dbdata){
  dbdata.forEach(function(data,index,object){
    let element={"id":index,"charactername":data["charactername"],"maxLife":data["maxLife"]}
    listcharactercards.push(element)
    
  })
}

  function getrandomplaycards(playerData,items){
  playerData.forEach(player=>{
    let maxlife=player.maxLife
    for(var i=0;i<maxlife;i++){
      let item = items[Math.floor(Math.random() * items.length)];
      let charactername=item["playcard"]
      let element={"id":i+1,"card":charactername}
      player.hand.push(element)

    }
  }) 
  }



//Interval for getting time
let myVar = setInterval(checkcurrenttime, 100);
//Interval for updating phase
let myVar1 = setInterval(updatephase, 100);
//Interval for Gatling pause



//Run node as a web server for hosting static files (html)
app.use(express.static(__dirname + "/public"))


function checkcurrenttime(){
  if(statuspause!="off"){
    currenttime=new Date()
  }
    if(statuspause=="on"){
      phasetime.setSeconds (phasetime.getSeconds() + pausetime);
      pausetime=0
      statuspause=""
    }
      // Find the distance between now and the count down date
    let distance = phasetime - currenttime;  
     minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
     seconds = Math.floor((distance % (1000 * 60)) / 1000);
      //When starting game, we will start randomly give character card to each user
  if(statusgame=='START GAME'&&statuscharactercard==""){
    getrandomcharactercards.getrandomcharactercards(listcharactercards, playerData)
    io.emit("randomgivecharacter", JSON.stringify(playerData))
    getrandomrolecards.getrandomRole(listedrolecards, playerData)
    getrandomplaycards(playerData,listplaycards)
    console.log(playerData)
    io.emit("updateRole",JSON.stringify(playerData))
    io.emit("bulletUpdate", JSON.stringify(playerData))
    io.emit("weaponUpdate",JSON.stringify(playerData))
    io.emit("updatePlayerName",JSON.stringify(playerData))
    io.emit("handUpdate",JSON.stringify(playerData))
    io.emit("bangUpdate",JSON.stringify(playerData))
    io.emit("cardsInHandUpdate", JSON.stringify(playerData))

    statuscharactercard="Finished"
  }
  if(phasetime!=""){
    let data={min:minutes,sec:seconds,name:statusphase.name,phase:statusphase.phase}
    io.emit("timeupdate",data)
  }
}
app.get("/pause", function (req, res) {
  let status = req.query.stat
  console.log(status)
  if(status=="off"&&countgatling==0){
    res.send("OK")
    pausetime = 0
    getpauseandend.setintervaltime(pausetime)
    statuspause = "off"
  }
  else if(status=="on"&&countgatling==0){
    res.send("OK")
    pausetime= getpauseandend.returnpausetime()
    getpauseandend.resettime()
    statuspause="on"
  }
  else{
    res.send("OK")
  }
})
app.get("/endphase", function (req, res) {
  phasetime = getpauseandend.endphase(phasetime, currenttime)
  res.send("OK")

})


//Function for updating phase
function updatephase(){
if(statusgame=='START GAME'&&phasestatus==""){
  playerData.forEach(player=>{
    if(player.role=="Sheriff"){
      idround=player.id
    }
  })
  Sheriffrole="true"
  phasestatus="Starting"
}
if(phasestatus=="Starting"&&Sheriffrole=="true"){
   statusphase={id:idround,phase:1,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
   phasetime=new Date (currenttime );
   phasetime.setSeconds (phasetime.getSeconds() + 15 );
   data = {name: statusphase.name, action: ` Started Phase ${statusphase.phase} `}
   io.emit("updateactionlog",data)
   io.emit("infophase",statusphase)  
   phasestatus="Ongoing"
  return;
}
if(minutes==0&&seconds==0&&phasestatus=="Ongoing"&&statusphase.phase==1){
  statusphase={id:idround,phase:2,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
  drawCards(playerData, listplaycards,statusphase,io)
  phasetime=new Date (currenttime );
  phasetime.setSeconds ( phasetime.getSeconds() + 60 );  
  data = {name: statusphase.name, action: ` Started Phase ${statusphase.phase} `}
  io.emit("updateactionlog",data)
  io.emit("infophase",statusphase)  
  return;

  }

  if (minutes == 0 && seconds == 0 && phasestatus == "Ongoing" && statusphase.phase == 2) {
    playerData[idround-1].bangPlayed = false
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
    let data = {
            limitPlayer: playerData[idround - 1],
            discardPile: discardPile
           }
          elimination.forceUnderHandLimit(data);
          io.emit("handUpdate", JSON.stringify(playerData));
    if (idround == 5) {
      idround = 1
    }
    else{
      idround++
    }
    if(playerData[idround-1].currentLife==0){
      statusphase.phase=3
      phasetime=getpauseandend.endphase(phasetime,currenttime)
      phasestatus="Ongoing"
    }
    else{
    statusphase={id:idround,phase:1,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
    phasetime=new Date (currenttime );
    phasetime.setSeconds (phasetime.getSeconds() + 15 );
    io.emit("infophase",statusphase)  
    }
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
    scope: false,
    mustang: false,
    barrel: false,
    jail: false,
    dynamite: false,
    eliminated: false,
    bangPlayed: false,
    hand: [{ id: 7, card: 'scope' }, ],
  }
  playerData.push(newPlayer);
  io.emit("descriptionuser", JSON.stringify(playerData))
  io.emit("statusgame", "Wating for " + (5 - playerData.length) + "")
  //io.emit("updateInitialPlayerName", JSON.stringify(playerData))
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
  //Testing phase for adding player
  testingvalidation1(socketid)
  //testingvalidataion2(socketid,res)



  res.send(message)
  if (message == "Successful") {
    pushdatatolist(username, socketid)
  }
  checknumberofplayer()
  //Testing phase for counting number
});


app.get('/desuser', function(req, res){
  res.send("Wating for more " +(5-playerData.length)+ " People")
  io.emit("descriptionuser",JSON.stringify(playerData)) 
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



app.get('/actionLog', function(req, res){
    const name = req.query.name
    const action = req.query.action
    const data={
      name:name,
      action:action
    }
    io.emit("updateactionlog",data)
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
  listcharactercards = [];
  listedrolecards = [...holdlistedrolecards];
  newPlayer = require("./json lists/playerDataList.json");
  setTimeout(() => {
    playerData.splice(0, playerData.length);
    discardPile.splice(0, playerData.length);
  }, 3000)
}








    //Function to get currentlife
app.get("/getcurrentlife",function(req,res){
  let socket=req.query.socket
  let currentlife
  playerData.forEach(player=>{
    if(player.socket==socket){
       currentlife=player.currentLife
    }
  })
  console.log(currentlife)
  res.send({life:currentlife})
})

app.get("/getcurrentbang",function(req,res){
  let socket=req.query.socket
  let currentBang
  playerData.forEach(player=>{
    if(player.socket==socket){
       currentBang=player.bangPlayed
    }
  })
  console.log(currentBang)
  res.send({bang:currentBang})
})

app.get("/weaponChange",function(req,res){
const data ={
  item:req.query.item,
  socket: req.query.socket,
  range: req.query.range
}
weapon.weaponChange(data,playerData,io);
res.send("200")
})

app.get("/drawCards", function(req,res){
const data ={
 socket: req.query.socket
}
drawCards(playerData,listplaycards,data,io)
})

function drawCards(playerData,items,data, io){
  playerData.forEach(player=>{
    if (player.socket == data.socket){
      for(var i=0;i<2;i++){
        let item = items[Math.floor(Math.random() * items.length)];
        let charactername=item["playcard"]
        let element={"id":i+1,"card":charactername}
        player.hand.push(element)

      }
      const data2 ={
        name: player.name,
        action: ` drew two cards from the deck!`,
      }
      io.emit("updateactionlog",data2)
      io.emit("handUpdate",JSON.stringify(playerData))
    } 

  }) 
  }






//Function get pausetime
app.get("/getpausetime",function(req,res){
  let time=getpauseandend.returntime()
  console.log(time)
  res.send({pause:time})
})



//Trigger General Store
app.get("/generaltrigger",function(req,res){
  let socket=req.query.socket
  //Count live number
  let livecount=0
  playerData.forEach(player=>{
    if(player.currentLife>0){
      livecount++
    }
  })
let countlistplayingcards=listplaycards.length
if(countlistplayingcards>=livecount&&livecount>1){
listcards= getgeneral.getplayingcards(listplaycards,livecount)
getgeneral.removegeneralcard(playerData,socket)
io.emit("handUpdate",JSON.stringify(playerData))
io.to(socket).emit("GeneralModal",listcards)
pausetime=0
getpauseandend.setintervaltime(pausetime)
statuspause="off"
res.send("OK")
}
else{
res.send("Do not have enough playing cards or All others players was died")
}
})
//Continue General Store Process
app.get("/continueprocessgeneral",function(req,res){
  let position=req.query.position
  let socket=req.query.socket
  let namecard=req.query.namecard
  let socketnext
  if(listcards.length!=0){
    listcards.splice(position,1)

  getgeneral.pushcardtohand(playerData,socket,namecard)
  io.emit("handUpdate",JSON.stringify(playerData))
  if(listcards.length!=0){
  socketnext= getgeneral.checknextuser(playerData,socket)
 io.to(socketnext).emit("GeneralModal",listcards)
  }
  }
if(listcards.length==0){
  pausetime=getpauseandend.returnpausetime()
  getpauseandend.resettime()
  playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
  statuspause="on"
}


  res.send("OK")
})


//Trigger wells fargo
app.get("/wellsfargo",function(req,res){
  let socket=req.query.socket
  let statuspick=getwellfargo.randompickthreecards(listplaycards,playerData,socket)
  if(statuspick=="Canpick"){
  getwellfargo.removeWells(playerData,socket)
  }
  io.emit("handUpdate",JSON.stringify(playerData))
  res.send("OK")
  //Testing phase WellFargo
  testingWellFargo(playerData,socket)
})

//Trigger Indians
app.get("/indianstrigger",function(req,res){
  countgatling=0
  countresponsegatling=0
  let checkhavingbang="false"
  let socket=req.query.socket
  let attackername
  getindians.removeIndians(playerData,socket)
  io.emit("handUpdate",JSON.stringify(playerData))
  playerData.forEach(player=>{
    if(player.socket==socket){
      attackername=player.name
    }
  })
  let statusbang="false"
  playerData.forEach(player=>{
    let statusbeer="false"
   let  statusbang="false"
    let currentlife="true"
    if(player.currentLife<1){
      currentlife="false"
    }
if(currentlife=="true")
{
    player.hand.forEach(data=>{
      if(data.card=="bang"){
        statusbang="true"
      }
      if(data.card=="beer"){
        statusbeer="true"
      }
    })
  if(statusbang=="true"){
    countgatling++
    checkhavingbang="true"
    io.to(player.socket).emit("IndiansOption",attackername)
  }

else{
  if(statusbeer=="true"&&player.currentLife==1){
    player.currentLife = player.currentLife
    getbeer.removebeerGalting(playerData,player.socket)
    io.emit("handUpdate",JSON.stringify(playerData))
  }
  else{
  player.currentLife = player.currentLife -1
  const data ={
    name: attackername,
    action: `shot ${player.name}`
  }
  if (player.currentLife < 1) {
    eliminatePlayer(player, null);
  }
  io.emit("bulletUpdate", JSON.stringify(playerData))
  io.emit("updateactionlog",data)
  }

}
}
  })
  if(checkhavingbang=="true"){
    pausetime=0
    getpauseandend.setintervaltime(pausetime)
    statuspause="off"
  }
    if(countgatling==0){
    playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
    io.emit("bulletUpdate", JSON.stringify(playerData))
    }
res.send("OK")
})


//Response Indians
app.get("/responseIndians",function(req,res){
  let msg=req.query.msg
  let socket=req.query.socket
  
if(msg=="No"){
countresponsegatling++
playerData.forEach(player=>{
  if(player.socket==socket){
    let statusbeer="false"
    player.hand.forEach(data=>{
      if(data.card=="beer"){
        statusbeer="true"
      }
    })
    if(statusbeer=="true"&&player.currentLife==1){
      console.log("OK")
      getbeer.removebeerGalting(playerData,socket)
      io.emit("handUpdate",JSON.stringify(playerData))
    }
    else{
      const data ={
        name: req.query.attackname,
        action: `shot ${player.name}`
      }
    player.currentLife = player.currentLife -1
    if (player.currentLife < 1) {
      eliminatePlayer(player, null);
    }
    io.emit("bulletUpdate", JSON.stringify(playerData))
    io.emit("updateactionlog",data)
    }
  }
})
}
else{
countresponsegatling++
getduel.removeBangCard(playerData,socket)
io.emit("handUpdate",JSON.stringify(playerData))
}
console.log(countresponsegatling)
console.log(countgatling)


if(countresponsegatling==countgatling){
  pausetime=getpauseandend.returnpausetime()
  getpauseandend.resettime()
  playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
  io.emit("bulletUpdate", JSON.stringify(playerData))
  statuspause="on"
  countgatling=0
  countresponsegatling=0
}
res.send("OK")
})


//Function to manage victim repsonse using beer card when gatling attack
app.get("/responsebeercard",function(req,res){
  let msg=req.query.msg
  let socket=req.query.socket
  countresponsegatling++
  if(msg=="No"){
    playerData.forEach(player=>{
      if(player.socket==socket){
        player.currentLife = player.currentLife -1
        const data ={
          name: req.query.attackname,
          action: `shot ${player.name}`
        }
        io.emit("updateactionlog",data)
        res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
      }
    })

  }
else{
res.send("Finish")
playerData.forEach(player=>{
  if(player.socket==socket){
    getbeer.removebeerGalting(playerData,socket)
io.emit("handUpdate",JSON.stringify(playerData))
console.log(player.name +" use 1 beer card")
  }
})
}

playerData.forEach(player=>{
  if(player.socket==socket){
    if (player.currentLife < 1) {
      eliminatePlayer(player, null);
    }
  }
  io.emit("bulletUpdate", JSON.stringify(playerData))
})


//Check enough response from victim to restart time
if(countresponsegatling==countgatling){
  pausetime=getpauseandend.returnpausetime()
  getpauseandend.resettime()
  playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
  statuspause="on"
  countgatling=0
  countresponsegatling=0
}
})

//Function to manage victim repsonse using missed card when gatling attack
app.get("/responsemissedcard",function(req,res){
let msg=req.query.msg
let attackerName=req.query.attackname
let socket=req.query.socket
//When victim do not want use missed card=> server will check beer card
if(msg=="No"){
  playerData.forEach(player=>{
    if(player.socket==socket){
      let statusbeercard="false"
      //Check beer card and victim life=1
      player.hand.forEach(data=>{
        if(data.card=="beer" && player.currentLife==1){
          io.to(player.socket).emit("beerOptionVT", attackerName)
          statusbeercard="true"
          return
        }
      })
      // If victim do not have beer card or their life>1=> They will be decreased their life
      if(statusbeercard=="false"){
           countresponsegatling++     
          player.currentLife = player.currentLife -1
          const data ={
            name: req.query.attackname,
            action: `shot ${player.name}`
          }
          io.emit("updateactionlog",data)
          console.log(player.name+"is now on " +player.currentLife)   
      }
      res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
    }
  })
}
//If they choose use missed card=> They are not decreased their life but one missed card will be lost.
else{
countresponsegatling++
res.send("Finish")
playerData.forEach(player=>{
  if(player.socket==socket){
getgatling.removemissedinGalting(playerData,socket)
io.emit("handUpdate",JSON.stringify(playerData))
console.log(player.name+" With Current Life "+player.currentLife)
console.log(player.name +" use 1 missed card")
  }
})

}
playerData.forEach(player=>{
  if(player.socket==socket){
    if (player.currentLife < 1) {
      eliminatePlayer(player, null);
    }
  }
  io.emit("bulletUpdate", JSON.stringify(playerData))

})

//Function to check enough response from victim to restart time
if(countresponsegatling==countgatling){
  pausetime=getpauseandend.returnpausetime()
  getpauseandend.resettime()
  playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
  statuspause="on"
  countgatling=0
  countresponsegatling=0
}

})




//This function happens when Galting card active
app.get("/gatlingattack",function(req,res){
  countgatling=0
  countresponsegatling=0
  pausetimeforgatling="false"
  let sock=req.query.socket
  let attackerName=getgatling.getattackername(playerData,sock)
  console.log(attackerName)
  //After Playing Gatling card => Remove this card from hand
  getgatling.removeGatling(playerData,sock)
  io.emit("handUpdate",JSON.stringify(playerData))

  playerData.forEach(player=>{
     if(player.socket!=sock){
      let checklivestatus="true"
      if(player.currentLife<1){
        checklivestatus="false"
      }
      let checkmissedcard="false"
      if(checklivestatus=="true"){
 
      //If victim has missed card=> They can choose use it or cancel
      player.hand.forEach(data=>{
        if(data.card=="missed"&&checkmissedcard=="false"){
          countgatling++
          //Emit to all victims for choosing use missed card or not
          io.to(player.socket).emit("missedOptionVT", attackerName)
          checkmissedcard="true"
          pausetimeforgatling="true"
          res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
        }
      })

      //If victim do not have missed card=> server will check victim have beer cards or not?
      if(checkmissedcard=="false"){
              //Check beer card
        let checkbeercard="false"
        //If victim has beer cards and their life==1=> Server will ask them use beer card or not        
        player.hand.forEach(data=>{
        if(data.card=="beer"&&player.currentLife==1&&checkbeercard=="false"){
          countgatling++
          pausetimeforgatling="true"
          checkbeercard="true"
          io.to(player.socket).emit("beerOptionVT", attackerName)
          return
        }
      })
              //If victim do not have beer card=> They will be decreased their life
              if(checkbeercard=="false"){
                player.currentLife = player.currentLife -1
                const data ={
                  name: attackerName,
                  action: `shot ${player.name}`
                }
                io.emit("updateactionlog",data)
                console.log(player.name+" is now on " +player.currentLife)   
              }
        res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
      }
    }
    res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))

      if (player.currentLife < 1) {
        eliminatePlayer(player, null);
      }
    
  }
  })
  // If gatling is active and waiting response from victim, we will temporarily stop the time for waiting victims response
if(pausetimeforgatling=="true"){
  pausetime=0
  getpauseandend.setintervaltime(pausetime)
  statuspause="off"
}
io.emit("bulletUpdate", JSON.stringify(playerData))

})

//Function for trigger beer action in phase 2 of user
app.get("/beertrigger",function(req,res){
  let sock=req.query.socket
  let statusheal=getbeer.BeerHealBlood(sock,playerData,res)
  if(statusheal!="UnHealed"){
  getbeer.removebeerGalting(playerData,sock)
  }
  io.emit("handUpdate",JSON.stringify(playerData))
  io.emit("bulletUpdate", JSON.stringify(playerData))

  //Testing for beer
  testingbeer(sock)


})


//Function in replying Duel action
app.get("/responseduel",function(req,res){
  let msg=req.query.msg
  let attackerName=req.query.attackname
  let socketattacker
  let playerduel=""


  //Find socketid of attacker
  playerData.forEach(player=>{
      if(player.name==attackerName){
        socketattacker=player.socket
      }
  })

  let socket=req.query.socket
if(msg=="No"){
  playerData.forEach(player=>{
    if(player.socket==socket){
      let beercardstatus="false"
      playerduel=player.name
      const data ={
        name: req.query.attackname,
        action: `shot ${player.name}`
      }
      //Check beer card =>If having beer card and current life==1 => Automatically use beer card
      player.hand.forEach(data=>{
        if(data.card=="beer"){
          beercardstatus="true"
        }
      })
      if(beercardstatus=="true"&&player.currentLife==1){
        player.currentLife=player.currentLife
        getbeer.removebeerGalting(playerData,socket)
        io.emit("handUpdate",JSON.stringify(playerData))
      }
      else{
        player.currentLife = player.currentLife -1
      }
      io.emit("updateactionlog",data)
      pausetime=getpauseandend.returnpausetime()
      getpauseandend.resettime()
      console.log(pausetime)
      statuspause="on"
      console.log(player.name+"is now on " +player.currentLife)
    }
  })
}
else{
  let checkbangcard="false"
  playerData.forEach(player=>{
    if(player.socket==socket){
      playerduel=player.name
      player.hand.forEach(data=>{
        if(data.card=="bang"){
          checkbangcard="true"
        }
      })
    }
  })
 

//When user do not have bang card
if(checkbangcard=="false"){
  let beercardstatus="false"
  playerData.forEach(player=>{
    if(player.socket==socket){
      const data ={
        name: req.query.attackname,
        action: `shot ${player.name}`
      }

      //Check beer card =>If having beer card and current life==1 => Automatically use beer card
      player.hand.forEach(data=>{
        if(data.card=="beer"){
          beercardstatus="true"
        }
      })
      if(beercardstatus=="true"&&player.currentLife==1){
        player.currentLife=player.currentLife
        getbeer.removebeerGalting(playerData,socket)
        io.emit("handUpdate",JSON.stringify(playerData))
      }
      else{
        player.currentLife = player.currentLife -1
      }



      io.emit("updateactionlog",data)
      pausetime=getpauseandend.returnpausetime()
      getpauseandend.resettime()
      console.log(pausetime)
      statuspause="on"
      console.log(player.name+"is now on " +player.currentLife)
    }
  })
}
//If user have bang card=> User will use bang card for duello
else if(checkbangcard=="true"){
getduel.removeBangCard(playerData,socket)

io.to(socketattacker).emit("DuelOption", playerduel)
io.emit("handUpdate",JSON.stringify(playerData))
}
}
playerData.forEach(player=>{
  if(player.socket==socket){
    if (player.currentLife < 1) {
      eliminatePlayer(player, null);
    }
  }
})
io.emit("bulletUpdate", JSON.stringify(playerData))
res.send ("OK")
})

app.get('/discardHandCard', function (req, res) {
  let index = req.query.index;
  let name = req.query.name;
  let discardedCard = [];
  playerData.forEach(player => {
    if (player.name == name) {
      discardedCard = player.hand.splice(index, 1);
      discardPile.push({ "card": discardedCard[0].card });
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
    //once all players have disconnected, clear playerdata for new game
    /* *****
    let allEliminated = true;
    playerData.forEach((user) => {
      if (user.eliminated != true) {
        allEliminated = false;
      }
    });
    if (allEliminated) {
    statusgame = "";
    playerData.splice(0, playerData.length);
    }*/
  } 
}

function initialiseGameData(){
 count = 0;
 listdesuser = [];
 checkuserexist = false;
 statusgame = ""
 socketofeachuser ="";
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
 listcharactercards =[];
listedrolecards = [] 
readcharactercardfromdb()
 setTimeout(()=>{
  playerData.splice(0, playerData.length);
  discardPile.splice(0, playerData.length);
}, 3000)
}


//Function trigger DuelService
app.get("/dueltrigger",function(req,res){
  let idvictim=req.query.targetId
   let nameattacker=req.query.name
   let checklivestatus="true"
   playerData.forEach(player => {
    if(player.id==idvictim&&player.currentLife<1){
      checklivestatus="false"
    }
   })
if(checklivestatus=="true"){

   getduel.removeDuelCard(playerData,nameattacker)
   io.emit("handUpdate",JSON.stringify(playerData))
// Check user have bang card or not
   playerData.forEach(player => {
     if(player.id==idvictim){
       let checkstatusbangcard="false"
      player.hand.forEach(data=>{
        if(data.card=="bang"){
          checkstatusbangcard="true"
        }
      })  
      //If having bang card=> Starting Duello
  if(checkstatusbangcard=="true"){
    triggerduel(idvictim,nameattacker)
    io.emit("handUpdate",JSON.stringify(playerData))

  }
//If do not have bang card=> Continue check beer card=> If do not have beer card, user will be automatically decresed their life
   else if(checkstatusbangcard=="false"){
     let beercardstatus="false"
      const data ={
        name: nameattacker,
        action: `shot ${player.name}`
      }
            //Check beer card
        player.hand.forEach(data=>{
              if(data.card=="beer"){
                beercardstatus="true"
              }
            })
            if(beercardstatus=="true"&&player.currentLife==1){
              player.currentLife=player.currentLife
              getbeer.removebeerGalting(playerData,player.socket)
              io.emit("handUpdate",JSON.stringify(playerData))
            }
            else{
              player.currentLife = player.currentLife -1
              if (player.currentLife < 1) {
                eliminatePlayer(player, null);
              }
            }

      io.emit("updateactionlog",data)
      console.log(player.name+"is now on " +player.currentLife)
    }
     }
   })
  }
  io.emit("bulletUpdate", JSON.stringify(playerData))

  res.send("Finished Duel")   
})


//New function for duel
function triggerduel(idvictim,nameattacker){
  let countbangvictim=0
  let countbangattacker=0
  let socketvictim
  let socketattacker
  let nameattack
  let namevictim


  playerData.forEach(player=>{
    if(player.id==idvictim){
      socketvictim=player.socket
      namevictim=player.name
      player.hand.forEach(function(data,index,object){
        if(data.card=="bang"){
          countbangvictim++
        }
      })
    }
  })
  playerData.forEach(player=>{
    if(player.name==nameattacker){
      socketattacker=player.socket
      nameattack=player.name
      player.hand.forEach(function(data,index,object){
        if(data.card=="bang"){
          countbangattacker++

        }
      })
    }
  })



  io.emit("handUpdate",JSON.stringify(playerData))

  console.log("Countvictim "+countbangvictim)
  console.log("Countvictim "+countbangattacker)

  if(countbangattacker>=countbangvictim){    
    for(let i=0;i<countbangvictim;i++){
      getduel.removeBangCard(playerData,socketvictim)
      getduel.removeBangCard(playerData,socketattacker)
    }
    const data ={
      name: nameattack,
      action: "shot " +namevictim
    }
    io.emit("updateactionlog",data)

    playerData.forEach(player=>{
      if(player.id==idvictim){
        player.currentLife--
        console.log(player.currentLife)
        if (player.currentLife < 1) {
          eliminatePlayer(player, null);
        }
      }
    })

  }
  else{
    const data ={
      name: namevictim,
      action: "shot " +nameattack
    }
    io.emit("updateactionlog",data)

    if(countbangattacker==0){
      getduel.removeBangCard(playerData,socketvictim)
    }
    else{
    for(let i=0;i<countbangattacker;i++){
      getduel.removeBangCard(playerData,socketvictim)
      getduel.removeBangCard(playerData,socketattacker)
    }
  }
    playerData.forEach(player=>{
      if(player.name==nameattacker){
        player.currentLife--
        console.log(player.currentLife)
        if (player.currentLife < 1) {
          eliminatePlayer(player, null);
        }
      }
    })
  }

}



/* ---------------------------------------------------Bang/Miss Start ------------------------------------------------------*/
app.get('/shootBang', function(req,res){
  const targetId = req.query.targetId
  const attackerName = req.query.name
  const distance = req.query.distance
const data ={
  targetId:targetId,
  attackerName: attackerName,
  distance: distance
}
console.log(data)
bang.checkDistance(data,playerData, io)
playerData.forEach(player=>{
  if(player.id==targetId){
    if (player.currentLife < 1) {
      eliminatePlayer(player, null);
    }
  }
})
res.send("200")
})




/* ---------------------------------------------------Bang/Miss End ------------------------------------------------------*/

/* ---------------------------------------------------stageCoach Start ---------------------------------------------------*/
app.get("/stagecoach",function(req,res){
  const data ={
    socket: req.query.socket
   }

  drawCards(playerData,listplaycards,data,io)
  playerData.forEach(player=>{
    if(player.socket== data.socket){
    let status="true"  
      player.hand.forEach(function(data,index,object){
        if(data.card=="stagecoach"&&status=="true"){
          status="false"  
          object.splice(index,1)
          return
        }
      })
    }
  })
  io.emit("handUpdate",JSON.stringify(playerData))
  res.send("200")

})

/*------------------------------------------------------stageCoach End-------------------------------------------------*/

/* ---------------------------------------------------- scope Start ---------------------------------------------------*/
app.get("/addSope",function(req,res){
  const data ={
    socket: req.query.socket
   }
scope.scopeAdd(data,playerData,io)
res.send("200")
})

/*------------------------------------------------------scope End-------------------------------------------------*/

app.get("/addBarrel",function(req,res){
  const data ={
    socket: req.query.socket
   }
barrel.barrelAdd(data,playerData,io)
res.send("200")
})

/*------------------------------------------------------scope End-------------------------------------------------*/

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
           myobj = { user_name: "voungtan", Score: 37000 ,Round:1,Datetime:"04/30/2020 13:01:01"};
           await col.insertOne(myobj);
           col = db.collection("historytabledata");
           myobj = { user_name: "voungtan", Score: 37000 ,Round:1,Datetime:"04/30/2020 13:01:01"};
           await col.insertOne(myobj);
  
           col = db.collection("startinggamedata");
           myobj = { user_name: "voungtan", Total_players: 5,Character_Cards:16,Role_Cards:7,Playing_Cards:80,Character_Card_Name:"Bart Cassidy" ,Character_Card_Feature_Description:"This is a card",Character_Bullets:4,Role_Card_Name:"Sheriff"
           ,Role_Card_Feature_Description:"This is Description",Playing_Card_Name:"Playing_Card_Name",Color_Playing_Card :"Blue",Character_Card_Images:"",Role_Card_Images:"",Playing_Card_Images:""};
           await col.insertOne(myobj);
           col = db.collection("Displaygameinterface");
           myobj = { user_name: "voungtan", User_character_card_Images: "",User_Role_Card_Images:"",User_Playing_card_Images:"",Current_Bullets:"",Table_Card_Images:"" };
           await col.insertOne(myobj);
           col = db.collection("Randomlygiveonecharactercard");
           myobj = { user_name: "voungtan", Character_Cards: "Highway 37",Character_Card_Name:"" };
           await col.insertOne(myobj);
           col = db.collection("Applylimitedtimeplayerturn");
           myobj = { user_name: "voungtan", Current_time: "Highway 37",Limited_time:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyfeatureofcharactercard");
           myobj = { user_name: "voungtan", Character_Card_Name: "Highway 37",CharacterCard_Feature_Description:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyfeatureofrolecard");
           myobj = { user_name: "voungtan", Role_Card_name: "Highway 37",Role_Card_Feature_Description:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyplayersorder");
           myobj = { user_name: "voungtan", User_Order: 4};
           await col.insertOne(myobj);
           col = db.collection("Applycurrentdistance");
           myobj = { user_name: "voungtan", Distance_user_to_opponents: 4,Distance_opponents_to_user:2};
           await col.insertOne(myobj);
           col = db.collection("Drawingcards");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Usercanplayspecificcards");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Rewardfunction");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Bangfunction");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_Bullets:"",Current_Bullets:""};
           await col.insertOne(myobj);
           col = db.collection("Missedfunction");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order"};
           await col.insertOne(myobj);
           col = db.collection("ncreaseandDecreaseDistance");
           myobj = { user_name: "voungtan", Target_name: "tst",increaseorDecrease_Distance_user_opponents:"order",IncreaseorDecreaseDistance_opponents_user:"",
           Distance_user_to_opponents:"Distance_user_to_opponents",Distance_opponents_to_user:'Distance_opponents_to_user'};
           await col.insertOne(myobj);
           col = db.collection("changingweapon");
           myobj = { user_name: "voungtan", Current_Weapon: "tst",Distance_current_weapon:"order",Updated_Weapon:"",Distance_updated_weapon:""}
           await col.insertOne(myobj);
         
           col = db.collection("DrawFunction");
           myobj = { user_name: "voungtan", Playing_Card_Name: "tst",Used_Compared_Card:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Drawoneplayerscard");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Discardingcardfromanotherperson");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Discardingcardfromgame");
           myobj = { user_name: "voungtan", Playing_Card_Name: "tst",Updated_Table_Card :"order"}
           await col.insertOne(myobj);
           col = db.collection("Jailfunction");
           myobj = { user_name: "voungtan", Targetname : "tst",Playing_Card_Name :"order"}
           await col.insertOne(myobj);
           col = db.collection("Gunbattle");
           myobj = { user_name: "voungtan", Targetname : "tst",Playing_Card_Name :"order",Current_Bullets:3,Updated_Bullets:2}
           await col.insertOne(myobj);
           col = db.collection("Storeusersscore");
           myobj = { user_name: "voungtan", Rank : 1,Round :1}
           await col.insertOne(myobj);
           col = db.collection("Displaywinningplayer");
           myobj = { user_name: "voungtan", Rank : 1,Round :1}
           await col.insertOne(myobj);
           col = db.collection("Disconnection");
           myobj = { user_name: "voungtan", Rank : 1,Round :1,User_Order:4}
           await col.insertOne(myobj);
           col = db.collection("HistoryRecord");
           myobj = { RecordID: 1, Username : "Abo",Rank :1,Round:4}
           await col.insertOne(myobj);
           col = db.collection("PlayingCard");
           myobj = { PlayingCardID: 1, PlayingCardID :"ACE",PlayingCardDescription :"hbchj",PlayingCardImages:"101124"}
           await col.insertOne(myobj);
           col = db.collection("RoleCard");
           myobj = { RoleCardID: 1, RoleCardName :"ACE",RoleCardDescription :"hbchj",RoleCardImages:"101124"}
           await col.insertOne(myobj);
           col = db.collection("CharacterCard");
           myobj = { CharacterCardID: 1, CharacterCardName :"ACE",CharacterCardDescription :"hbchj",CharacterCardImages:"101124"}
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
  function readcharactercardfromdb(){
    MongoClient.connect("mongodb+srv://eGTB4yl0HFJQ6lzD:eGTB4yl0HFJQ6lzD@project.wdfid.mongodb.net/Project?retryWrites=true&w=majority", function(err, db) {
      if (err) throw err;
      var dbo = db.db("project");
      //Find all documents in the customers collection:
      dbo.collection("PlayingCardDB").find({}).toArray(function(err, result) {
        if (err) throw err;
        pushdbtolistplaycards(result)
      });
      dbo.collection("CharacterCardDB").find({}).toArray(function(err, result) {
        if (err) throw err;
        pushtolistcharacter(result)
      });
      dbo.collection("RoleCardDB").find({}).toArray(function(err, result) {
        if (err) throw err;
        pushdbtolistrole(result)
      });
      db.close()


    });
  }

  function connection(){
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
    for(let i=0;i<20;i++){
      let elemtnt={"id":1,"playcard":"duel"}
      listplaycards.push(elemtnt)
    }
    readcharactercardfromdb()
    console.log('listening on *:3000');
});

app.get('/newUser', function (data) {
  const name = data.name
  const socketid = data.socket })

//-----------------------Testing phase--------------------------//
function testingvalidation1(socketid){
  if(socketid==null){
      error=("Error in Testing validation 1")
      throw error
  }
  else{
      console.log("Passed Testing validation 1")
  }
  }
  
  function testingvalidataion2(socketid,res){
   let usernametest=null
   let messagetest
   messagetest=checkvalidation(usernametest,socketid,res)
   if(messagetest!="Error"){
      error=("Error in Testing validation 2")
      throw error
  }
  else{
      console.log("Passed  Testing validation 2")
  }
  }

  function testingWellFargo(playerData,socket){
    let listcard=[{"id":1,"playingcard":"bang"},
    {"id":1,"playingcard":"bang"}
      ]
      let statuspicktest
     statuspicktest=getwellfargo.randompickthreecards(listcard,playerData,socket)
    if(statuspicktest!="Cannotpick"){
      error=("Error in Testing Well Fargo")
      throw error
  }
  else{
      console.log("Passed  Testing Well Fargo")
  }
  }
  function testingbeer(sockettest){
    playerData.forEach(data=>{
      if(data.socket==sockettest){
        if(data.currentLife>data.maxLife){
          error=("Error in Testing Beer Function")
          throw error
      }
      else{
          console.log("Passed  Testing Beer Function")
      }
        
      }
    })
  }
