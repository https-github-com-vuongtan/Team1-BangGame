let socketid;
let statusregis;
let nameplayer;

let role;
let action;
let character;

let phasenumber
let phaseuser
let socketphase;
let eliminated = false;

let socket=io.connect('http://localhost:3000');

let statuspause="off"
window.onload = function(e){ 
  $.get('/desuser', function(res){
    $('#waiting').text(res)
  });
  $.get('/socketid', function(res){
    socketid=res
  });

  $('.modal').modal();
  getdescriptionofuser()
  getstatusgame()
  updatechatbox () 
  updateActionLog()
  randomdelivercharactercard()
  getinforphase()
  updatetime()
  updateWeapon()
  updateName()
  displayWelcomeScreen()
  displayHand()
  displayBullets()
  updateRole()
  updateBang()
  //missedOption()
  //Vuong Tan
  GeneralOption()
  general()
  IndianModal()
  Indians()
  Duel()
  Duelopt()
  GatlingAttack()
  WellFar()
  BeerHeal()
  beerOptionVT()
  missOptionVT()
  //Katrina
  displayBullets()
  endGame()
  displayCardsInPlay()
  displayEliminations()
  // shotBang()
}
