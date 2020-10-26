function BangAttack(socketid){
    $(`.bang`).click(function() {
      let lifecurrent
      let req={
        socket:socketid
    }
      $.get("/getcurrentlife",req,data2=>{

        lifecurrent=data2
      })
        $.get("/getpausetime",data=>{
          let req={
            socket:socketid
        }

        if(socketphase==socketid&&phasenumber==2&&data.pause==0&&lifecurrent.life>0){
            $(`#bangModal`).modal('open')
        }
        })
     
    })
}


