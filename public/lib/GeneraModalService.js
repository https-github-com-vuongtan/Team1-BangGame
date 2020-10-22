function GeneralOption(){
    let countsubmit=0
    let countcancel=0
    socket.on("GeneralModal", data=>{
    $(document).ready(function(){
        $(document).click(function(e) {
            if (!$(e.target).closest('.modal').length&& $('#id05').is(':visible')) {
                $("#id05").modal('open')
            }
        });
        $("#clearfix5").empty()
        $("#id05").modal('open')
        countsubmit=0;

        for (let i=0;i<data.length;i++){
        if(data[i].playcard=="Wells Fargo"){
        $("#clearfix5").append(`<img data-distance="2" id="${i+"generalmodal"}"  data-target="${data[i].playcard}Modal" href="#${data[i].playcard}Modal"src="assets/cards/${data[i].playcard}.png" alt="Wells" class="responsive ${data[i].playcard}">`)
            }
            else if(data[i].playcard=="general store"){
                $("#clearfix5").append(`<img data-distance="2" id="${i+"generalmodal"}" data-target="${data[i].playcard}Modal" href="#${data[i].playcard}Modal"src="assets/cards/${data[i].playcard}.png" alt="general" class="responsive ${data[i].playcard}">`)
            }
            else{
        $("#clearfix5").append(`<img data-distance="2" id="${i+"generalmodal"}" data-target="${data[i].playcard}Modal" href="#${data[i].playcard}Modal"src="assets/cards/${data[i].playcard}.png" alt="${data[i].playcard}" class="responsive ${data[i].playcard}">`)
            }



        }
        for (let i=0;i<data.length;i++){
        $("#"+i+"generalmodal").click(function(){
            let datainfo={
                position:i,
                namecard:data[i].playcard,
                socket:socketid
            }
            $.get("/continueprocessgeneral",datainfo,res=>{

            })
        
        $("#id05").modal('close')

        })
    }

        })
    })

}