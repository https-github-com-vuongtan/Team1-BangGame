function missOptionVT(){
    let countsubmit=0
    let countcancel=0

    socket.on("missedOptionVT", attackerName=>{

    $(document).ready(function(){
        $(document).click(function(e) {
            if (!$(e.target).closest('.modal').length&& $('#id01').is(':visible')) {
                $("#id01").modal('open')
            }
        });
        $("#id01").modal('open')
        countsubmit=0;
        countcancel=0;
        $("#Submit").click(function(){
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

        $("#id01").modal('close')
        console.log(countsubmit)
        })
        $("#Cancel").click(function(){
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
        $("#id01").modal('close')
        console.log(countcancel)

        })

        })
    })

}