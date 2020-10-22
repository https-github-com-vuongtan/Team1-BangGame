function Duelopt(){
    let countsubmit=0
    let countcancel=0

    socket.on("DuelOption", attackerName=>{
    console.log("Attackername:" +attackerName)
    $(document).ready(function(){
        $(document).click(function(e) {
            if (!$(e.target).closest('.modal').length && $('#id03').is(':visible')) {
                $("#id03").modal('open')
            }
        });
        $("#id03").modal('open')
        countsubmit=0;
        countcancel=0;

        $("#SubmitDuel").click(function(){
            countsubmit++
            let req={
                attackname:attackerName,
                msg:"Yes",
                socket:socketid
            }
            if(countsubmit==1){
        $.get("responseduel",req,data=>{
            console.log(data)
        })
    }

        $("#id03").modal('close')
        console.log(countsubmit)
        })
        
        $("#CancelDuel").click(function(){
            countcancel++
            let req={
                attackname:attackerName,
                msg:"No",
                socket:socketid
            }
            if(countcancel==1){
        $.get("responseduel",req,data=>{
            console.log(data)
        })
    }
        $("#id03").modal('close')
        console.log(countcancel)
        })
        })
    })

}