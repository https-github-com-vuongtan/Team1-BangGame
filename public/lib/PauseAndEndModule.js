
$(document).ready(function(){
    $("#pausetimer").click(function(){
    if(socketphase==socketid){
        let status={
            stat:statuspause
        }

        $.get("/pause",status,function (data)
        {    
            console.log("OK")
        })
        if(statuspause=="off"){
            statuspause="on"
        }
        else{
            statuspause="off"
        }
    }
    })
})
$(document).ready(function(){
    $("#endphase").click(function(){
        if(socketphase==socketid){
            $.get("/endphase",function(data){
             console.log("OK")
            })
        }
    })
})