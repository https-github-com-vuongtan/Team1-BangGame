function Duelopt(){
    let countsubmit=0
    let countcancel=0

    socket.on("DuelOption", attackerName=>{

    $(document).ready(function(){
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
        $.get("responsemissedcard",req,data=>{
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
        $.get("responsemissedcard",req,data=>{
            console.log(data)
        })
    }
        $("#id03").modal('close')
        console.log(countcancel)

        })

        })
    })

}