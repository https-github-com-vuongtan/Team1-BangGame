function bangAttack(socketid){
    $(`.bang`).click(function() {
      let bangCurrent
      let req={
        socket:socketid
    }
      $.get("/getcurrentbang",req,data2=>{

        bangCurrent=data2
      })
        $.get("/getpausetime",data=>{
          let req={
            socket:socketid
        }

        if(socketphase==socketid&&phasenumber==2&&data.pause==0&&bangCurrent.bang==false){
          updatetypecard("bang")
            $(`#bangModal`).modal('open')
        }
        })
     
    })
}


