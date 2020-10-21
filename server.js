const { json } = require('express');
const express = require('express')
const moment=require('moment')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const getrandomcharactercards = require("./Modules-ServerSide/randomCharacterModule")
const getrandomrolecards = require("./Modules-ServerSide/randomRoleModule")
const getpauseandend = require("./Modules-ServerSide/PauseAndEndServerModule")
const getgatling = require("./Modules-ServerSide/GaltingModule")
const getbeer = require("./Modules-ServerSide/BeerModule")
const getwellfargo = require("./Modules-ServerSide/WellsFargoModule")
const getduel = require("./Modules-ServerSide/DuelModule")
const getindians = require("./Modules-ServerSide/IndiansModule")


let countgatling=0
let countresponsegatling=0
let pausetimeforgatling="false"

let count=0
let listdesuser=[]
let checkuserexist=false
let statusgame=""
let socketofeachuser;
let checksocketexist=false
let playerData=[]

let currenttime=""
let phasetime=""
let phasestatus=""
let statuscharactercard=""

let minutes=""
let seconds=""
let idround=1


let statusphase=""
let statuspause=""
let pausetime=0
let listcharactercards= require("./json lists/CharacterCardsList.json")
let listedrolecards = require("./json lists/roleCardList.json")
let newPlayer = require("./json lists/playerDataList.json");
const { removeGatling } = require('./Modules-ServerSide/GaltingModule');
const { Console } = require('console');
let myvar2;
let listplaycards=[{ "id":1,"playcard":"beer"},{
  "id":2,"playcard":"beer"},{
  "id":3,"playcard":"indians"},{
  "id":4,"playcard":"Gatling"},{
  "id":5,"playcard":"Wells Fargo"},{
  "id":6,"playcard":"indians"},{
  "id":7,"playcard":"Gatling"},{
  "id":8,"playcard":"Gatling"},{
  "id":9,"playcard":"Gatling"},{
  "id":10,"playcard":"indians"},{
  "id":11,"playcard":"beer"},{
  "id":12,"playcard":"Gatling"},{
  "id":13,"playcard":"Wells Fargo"},{
  "id":14,"playcard":"Gatling"},{
  "id":15,"playcard":"indians"},{
  "id":16,"playcard":"missed"},{
  "id":17,"playcard":"Gatling"},{
  "id":18,"playcard":"indians"},{
  "id":19,"playcard":"missed"},{
  "id":20,"playcard":"beer"},{
  "id":21,"playcard":"Gatling"},{
  "id":22,"playcard":"Wells Fargo"},
  {"id":23,"playcard":"missed"},
  {"id":24,"playcard":"Gatling"},
  {"id":25,"playcard":"Wells Fargo"},
  {"id":26,"playcard":"indians"},
  {"id":27,"playcard":"beer"},
  {"id":28,"playcard":"beer"},

]
  function getrandomplaycards(playerData,items){
  playerData.forEach(player=>{
    let maxlife=player.maxLife
    for(var i=0;i<maxlife;i++){
      let item = items[Math.floor(Math.random() * items.length)];
      let charactername=item["playcard"]
      let element={"id":i+1,"card":charactername}
      player.hand.push(element)
      let index = items.indexOf(item);
      items.splice(index, 1);
    }
  }) 
  }


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
      {"id": 1, "name": 'empty', }
  ],
}
//Interval for getting time
let myVar = setInterval(checkcurrenttime, 100);
//Interval for updating phase
let myVar1 = setInterval(updatephase, 100);
//Interval for Gatling pause



//Run node as a web server for hosting static files (html)
app.use(express.static(__dirname+"/public"))

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
    io.emit("randomgivecharacter",JSON.stringify(playerData))
    getrandomrolecards.getrandomRole(listedrolecards, playerData)
    getrandomplaycards(playerData,listplaycards)
    console.log(playerData)
    io.emit("updateRole",JSON.stringify(playerData))
    io.emit("weaponUpdate",JSON.stringify(playerData))
    io.emit("updatePlayerName",JSON.stringify(playerData))
    io.emit("handUpdate",JSON.stringify(playerData))
    io.emit("bangUpdate",JSON.stringify(playerData))
    statuscharactercard="Finished"
  }
if(phasetime!=""){
  let data={min:minutes,sec:seconds,name:statusphase.name,phase:statusphase.phase}
  io.emit("timeupdate",data)
}
}
app.get("/pause",function(req,res){
  let status=req.query.stat
  console.log(status)
  if(status=="off"&&countgatling==0){
    res.send("OK")
    pausetime=0
    getpauseandend.setintervaltime(pausetime)
    statuspause="off"
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
app.get("/endphase",function(req,res){
  phasetime=getpauseandend.endphase(phasetime,currenttime)
  res.send("OK")

})


//Function for updating phase
function updatephase(){
if(statusgame=='START GAME'&&phasestatus==""){
  phasestatus="Starting"
}
if(phasestatus=="Starting"){
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
  phasetime=new Date (currenttime );
  phasetime.setSeconds ( phasetime.getSeconds() + 60 );  
  data = {name: statusphase.name, action: ` Started Phase ${statusphase.phase} `}
  io.emit("updateactionlog",data)
  io.emit("infophase",statusphase)  
  return;

}
if(minutes==0&&seconds==0&&phasestatus=="Ongoing"&&statusphase.phase==2){
  statusphase={id:idround,phase:3,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
   phasetime=new Date (currenttime );
   phasetime.setSeconds (phasetime.getSeconds() + 20 );
   data = {name: statusphase.name, action: ` Started Phase ${statusphase.phase} `}
   io.emit("updateactionlog",data)
   io.emit("infophase",statusphase)    
   return;

  }
if(minutes==0&&seconds==0&&phasestatus=="Ongoing"&&statusphase.phase==3){
  if(idround==5){
    idround=1
  }
  else{
    idround++
  }
  statusphase={id:idround,phase:1,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
  phasetime=new Date (currenttime );
  phasetime.setSeconds (phasetime.getSeconds() + 15 );
  io.emit("infophase",statusphase)  
  return;
}
}

//Function to update user id (position) after one user go out the game room
function  order_user(deleteid)
{
if(deleteid==1){
  playerData.forEach((user) => { 
    user.id--
    user.position--
  });
}
else if(deleteid!=1&&deleteid<5){
  playerData.forEach((user) => { 
    if(user.id>deleteid){
      user.id--
      user.position--
    }    
  });
}
}

// Function to check username is exist or not
function checkexist(username,socketid){
  playerData.forEach((user) => {
    if(user.name==username){
      checkuserexist=true
      return;
    }
  });
}
// Function to check username is exist or not
function checksocketidexist(username,socketid){
  playerData.forEach((user) => {
    if(user.socket==socketid){
      checksocketexist=true
      return;
    }
  });
}
//Function to check validation of username input
function checkvalidation(username,socketid,res){
  checkexist(username,socketid)
  checksocketidexist(username,socketid)
  if(username==null){
    message="Error"
  }
  else if(checkuserexist==true){
    message="This username is exist"
    checkuserexist=false
  }
  else if(checksocketexist==true){
    message="You already registered"
    checksocketexist=false
  }
  else if(playerData.length>=5){
    message="There are five people in game room"
  }
  else{
    message="Successful"
}
return message
}

//Function to push user information to list
function pushdatatolist(username,socketid){
count++
let newPlayer =  {
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
  hand: [
  ],
}
playerData.push(newPlayer);
io.emit("descriptionuser",JSON.stringify(playerData))
io.emit("statusgame","Wating for more " +(5-playerData.length)+ " People") 
}

//Function to count the number players
function checknumberofplayer(){
  const numberofuser=playerData.length
   // If array length =5 (enough players) => Game Status=Game start
    if(numberofuser==5){
      statusgame="START GAME"
      io.emit("statusgame",statusgame)
    }
    //If do not have enough player => Return the amount of waiting players.
    else{
    statusgame="Wating for more " +(5-playerData.length)+ " People"
    io.emit("statusgame",statusgame) 
    }   
}
function checkuserdisconnect(socketid){
  let username
  playerData.forEach((user) => { 
    if(user.socket==socketid){
       username=user.name
      return
    }
  });
  return username
}


//Function when one user out game
function userdisconnection(socketidout){
  playerData.forEach((user) => {
    if(user.socket==socketidout){
      console.log(socketidout)
     let lengtharrayuser=playerData.length
     let deleteid=user.id
     playerData.splice((user.id-1),1)
     count--
     if(lengtharrayuser>0){
      order_user(parseInt(deleteid))
     }
     io.emit("descriptionuser",JSON.stringify(playerData)) 
    }
    return;
  });
    // Update the amount of waiting players
    if(statusgame!="start game"){
    io.emit("statusgame","Wating for more " +(5-playerData.length)+ " People") 
    }  
}



app.get('/submitname', function(req, res) {
const username=req.query.user
const socketid=req.query.socket
message=checkvalidation(username,socketid,res)
res.send(message)
if(message=="Successful"){
pushdatatolist(username,socketid)
}
checknumberofplayer()
});

app.get('/desuser', function(req, res){
  res.send("Wating for more " +(5-playerData.length)+ " People")
  io.emit("descriptionuser",JSON.stringify(playerData)) 
});

app.get('/status', function(req, res){
  io.emit("statusgame","Wating for more " +(5-playerData.length)+ " People")   
});
app.get('/socketid', function(req, res){
  res.send(socketofeachuser)
});

app.get('/chatbox', function(req, res){
    const name=req.query.name
    const description=req.query.descriptiontext
    const data={
      name:name,
      description:description,
      action:'purple monkey dishwasher'
    }
   io.emit("updatechatbox",data) 
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


//Function get pausetime
app.get("/getpausetime",function(req,res){
  let time=getpauseandend.returntime()
  console.log(time)
  res.send({pause:time})
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
})

//Trigger Indians
app.get("/indianstrigger",function(req,res){
  countgatling=0
  countresponsegatling=0
  let socket=req.query.socket
  let attackername
  getindians.removeIndians(playerData,socket)
  io.emit("handUpdate",JSON.stringify(playerData))
  playerData.forEach(player=>{
    if(player.socket==socket){
      attackername=player.name
    }
  })
  playerData.forEach(player=>{
    let statusbang="false"
    let statusbeer="false"
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
    pausetime=0
    getpauseandend.setintervaltime(pausetime)
    statuspause="off"
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
    name: req.query.attackname,
    action: `shot ${player.name}`
  }
  io.emit("updateactionlog",data)
  }

}
}
  })
    if(countgatling==0){
    playerData.forEach(player=>{console.log(player.name+"is now on " +player.currentLife)})
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
console.log(countresponsegatling)

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


  playerData.forEach(player=>{
     if(player.socket!=sock){
      let checklivestatus="true"
      if(player.currentLife<1){
        checklivestatus="false"
      }
      let checkmissedcard="false"
      if(checklivestatus=="true"){
              //After Playing Gatling card => Remove this card from hand
      getgatling.removeGatling(playerData,sock)
      io.emit("handUpdate",JSON.stringify(playerData))
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

  }
  })
  // If gatling is active and waiting response from victim, we will temporarily stop the time for waiting victims response
if(pausetimeforgatling=="true"){
  pausetime=0
  getpauseandend.setintervaltime(pausetime)
  statuspause="off"
}
})

//Function for trigger beer action in phase 2 of user
app.get("/beertrigger",function(req,res){
  let sock=req.query.socket
  let statusheal=getbeer.BeerHealBlood(sock,playerData,res)
  if(statusheal!="UnHealed"){
  getbeer.removebeerGalting(playerData,sock)
  }
  io.emit("handUpdate",JSON.stringify(playerData))
  
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
      res.send ("OK")
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
      res.send ("OK")
    }
  })
}
//If user have bang card=> User will use bang card for duello
else if(checkbangcard=="true"){
getduel.removeBangCard(playerData,socket)

io.to(socketattacker).emit("DuelOption", playerduel)
io.emit("handUpdate",JSON.stringify(playerData))
res.send ("Waiting response")
}
}
})




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
    io.to(player.socket).emit("DuelOption", nameattacker)
    pausetime=0
    getpauseandend.setintervaltime(pausetime)
    statuspause="off"
    res.send("Finished Duel")
  }
//If do not have bang card=> Continue check beer card=> If do not have beer card, user will be automatically decresed their life
   else if(checkstatusbangcard=="false"){
     let beercardstatus="false"
      const data ={
        name: req.query.attackname,
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
            }

      io.emit("updateactionlog",data)
      console.log(player.name+"is now on " +player.currentLife)
      res.send("Finished Duel")   
    }


     }
   })
  }
  res.send("Finished Duel")   
})


app.get('/shootBang', function(req,res){
  const targetId = req.query.targetId
  const attackerName = req.query.name
  playerData.forEach(player => {
    if(player.id==targetId){
      player.hand.forEach(card=>{
        console
        if (card.some =="missed"){
        io.to(player.socket).emit("missedOption",playerData, attackerName)
        }
        else{
          player.currentLife = player.currentLife -1
          const data ={
            name: attackerName,
            action: `shot ${player.name}`
          }
          io.emit("updateactionlog",data)
          res.send (console.log(`${player.name} is now on ${player.currentLife} lives`))
        }
      })
    
      
    }
     
    })
  //  playerData.forEach(attacker =>{})
  })
 

app.get('/newUser', function(data){
    const name = data.name
    const socketid = data.socket
 
})

io.on('connection', (socket) => {
    socketofeachuser=socket.id
    socket.on('disconnect', (reason) => {
      const data ={
        name:"user",
        action: " disconnected"
      }

      userdisconnection(socket.id)
      io.emit("updateactionlog",data) 
      });


  });


  function insertion(){
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
  connection();
  insertion(); //insertion now
  console.log('listening on *:3000');
});