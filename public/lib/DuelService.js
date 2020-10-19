function Duel(socketid){
    $('.duel').click(function(){
        let pausetime;
        $.get("/getpausetime",data=>{
            let req={
                socket:socketid
            }
            if(socketphase==socketid&&phasenumber==2&data.pause==0){
            console.log("Why?")    
            updatetypecard("duel")
            $(`#bangModal`).modal('open') ;
        }
        })
 
    })
}