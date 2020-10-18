function beerOptionVT(){
    let countsubmit=0
    let countcancel=0
    socket.on("beerOptionVT", attackerName=>{
    $(document).ready(function(){
        $("#id02").modal('open')
        countsubmit=0;
        countcancel=0;
        $("#SubmitBeer").click(function(){
            countsubmit++
            console.log("HAHA ")

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