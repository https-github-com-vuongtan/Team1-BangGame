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

module.exports= {
    checkpausetime,
    setintervaltime,
    endphase,
    returntime,
    resettime,
    returnpausetime
} 