function GatlingAttack(socketid){
    $('.Gatling').click(function(){
        $.get("/getpausetime",data=>{
          let req={
            socket:socketid
        }
        if(socketphase==socketid&&phasenumber==2&&data.pause==0){
        $.get("/gatlingattack",req,data=>{
          console.log(data)
        })
        }
        })
     
    })
}

