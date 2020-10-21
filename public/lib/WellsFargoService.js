function WellFar(socketid){
    $('.Wells').click(function(){
        let pausetime;
        let data2
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
            console.log(lifecurrent.life)
            if(socketphase==socketid&&phasenumber==2&&data.pause==0&&lifecurrent.life>0){ 
            $.get("/wellsfargo",req,data=>{
              console.log(data)
            })
        }
        })
 
    })
}