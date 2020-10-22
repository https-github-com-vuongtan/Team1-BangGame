function IndianModal(){
    let countsubmit=0
    let countcancel=0
    socket.on("IndiansOption", attackerName=>{
    $(document).ready(function(){
        $(document).click(function(e) {
            if (!$(e.target).closest('.modal').length&& $('#id04').is(':visible')) {
                $("#id04").modal('open')
            }
        });
        $("#id04").modal('open')
        countsubmit=0;
        countcancel=0;
        $("#SubmitIndians").click(function(){
            countsubmit++

            let req={
                attackname:attackerName,
                msg:"Yes",
                socket:socketid
            }
            if(countsubmit==1){
        $.get("responseIndians",req,data=>{
            console.log(data)
        })
    }
        $("#id04").modal('close')
        console.log(countsubmit)
        })
        $("#CancelIndians").click(function(){
            countcancel++
            let req={
                attackname:attackerName,
                msg:"No",
                socket:socketid
            }
            if(countcancel==1){
        $.get("responseIndians",req,data=>{
            console.log(data)
        })
    }
        $("#id04").modal('close')
        console.log(countcancel)

        })

        })
    })

}