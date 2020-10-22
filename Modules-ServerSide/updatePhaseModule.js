//Function for updating phase
function updatephase(){
if(statusgame=='START GAME'&&phasestatus==""){
  phasestatus="Starting"
}
if(phasestatus=="Starting"){
   statusphase={id:idround,phase:1,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
   phasetime=new Date (currenttime );
   phasetime.setSeconds (phasetime.getSeconds() + 1 );
   io.emit("infophase",statusphase)  
   phasestatus="Ongoing"
  return;
}
if(minutes==0&&seconds==0&&phasestatus=="Ongoing"&&statusphase.phase==1){
  statusphase={id:idround,phase:2,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
  phasetime=new Date (currenttime );
  phasetime.setSeconds ( phasetime.getSeconds() + 1 );  
  io.emit("infophase",statusphase)  
  return;

}
if(minutes==0&&seconds==0&&phasestatus=="Ongoing"&&statusphase.phase==2){
  statusphase={id:idround,phase:3,name:playerData[idround-1].name,socket:playerData[idround-1].socket}
   phasetime=new Date (currenttime );
   phasetime.setSeconds (phasetime.getSeconds() + 1 );
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
  phasetime.setSeconds (phasetime.getSeconds() + 1 );
  io.emit("infophase",statusphase)  
  return;
}
}
