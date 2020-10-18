let time=0
var interval
function setintervaltime(pausetime){
    time=pausetime
    interval=setInterval(checkpausetime,1000)
}

function returntime(){
    return time;
}

function checkpausetime(){
    time++
    }
function returnpausetime(){
    clearInterval(interval)
    return time
}
function resettime(){
    time=0
}
function endphase(phasetime,currenttime){
    phasetime=new Date (currenttime );
    phasetime.setSeconds (phasetime.getSeconds() + 1 );
    return phasetime
}

function restarttimeaftergatling(countresponsegatling,countgatling,statuspause,pausetime){
    if(countresponsegatling==countgatling){
        pausetime= returnpausetime()
        resettime()
        console.log(pausetime)
        statuspause="on"
        countgatling=0
        countresponsegatling=0
      }
}
module.exports= {
    checkpausetime,
    setintervaltime,
    endphase,
    returntime,
    resettime,
    restarttimeaftergatling,
    returnpausetime
} 