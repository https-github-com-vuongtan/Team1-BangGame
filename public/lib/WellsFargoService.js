function WellFar(socketid){
    $('.Wells').click(function(){
        let pausetime;
        $.get("/getpausetime",data=>{
            let req={
                socket:socketid
            }
            if(socketphase==socketid&&phasenumber==2&&data.pause==0){ 
            $.get("/wellsfargo",req,data=>{
              console.log(data)
            })
        }
        })
 
    })
}