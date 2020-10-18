function BeerHeal(socketid,countliveuser){
    $('.beer').click(function(){
        let pausetime;
        $.get("/getpausetime",data=>{
            let req={
                socket:socketid
            }
            console.log(data.pause)
            if(socketphase==socketid&&phasenumber==2&&countliveuser>2&&data.pause==0){
            $.get("/beertrigger",req,data=>{
              console.log(data)
            })
        }
        })
 
    })
}