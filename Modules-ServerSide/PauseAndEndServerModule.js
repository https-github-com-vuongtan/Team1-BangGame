let time=""
var interval
function setintervaltime(pausetime){
    time=pausetime
    interval=setInterval(checkpausetime,1000)
}

function checkpausetime(){
    time++
    }
function returnpausetime(){
    clearInterval(interval)
    return time
}
function endphase(phasetime,currenttime){
    phasetime=new Date (currenttime );
    phasetime.setSeconds (phasetime.getSeconds() + 1 );
    return phasetime
}    
module.exports= {
    checkpausetime,
    setintervaltime,
    endphase,
    returnpausetime
} 