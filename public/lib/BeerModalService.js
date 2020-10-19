function beerOptionVT(){
    let countsubmit=0
    let countcancel=0
    socket.on("beerOptionVT", attackerName=>{
    $(document).ready(function(){
        $(document).click(function(e) {
            if (!$(e.target).closest('.modal').length&& $('#id02').is(':visible')) {
                $("#id02").modal('open')
            }
        });
        $("#id02").modal('open')
        countsubmit=0;
        countcancel=0;
        $("#SubmitBeer").click(function(){
            countsubmit++

            let req={
                attackname:attackerName,
                msg:"Yes",
                socket:socketid
            }
            if(countsubmit==1){
        $.get("responsebeercard",req,data=>{
            console.log(data)
        })
    }
        $("#id02").modal('close')
        console.log(countsubmit)
        })
        $("#CancelBeer").click(function(){
            countcancel++
            let req={
                attackname:attackerName,
                msg:"No",
                socket:socketid
            }
            if(countcancel==1){
        $.get("responsebeercard",req,data=>{
            console.log(data)
        })
    }
        $("#id02").modal('close')
        console.log(countcancel)

        })

        })
    })

}