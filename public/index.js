let socketid;
let statusregis;
let nameplayer;

let role;
let action;
let character;

let phasenumber
let phaseuser

let socket=io.connect('http://localhost:3000');


window.onload = function(e){ 
  $.get('/desuser', function(res){
    $('#waiting').text(res)
  });
  $.get('/socketid', function(res){
    socketid=res
  });
  getdescriptionofuser()
  getstatusgame()
  updatechatbox () 
  updateActionLog()
  randomdelivercharactercard()
  getinforphase()
  updatetime()
  updateWeapon()
}