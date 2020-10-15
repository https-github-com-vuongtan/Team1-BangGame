//Send message to chat box
$(document).ready(function(){
  $("#sendMsgBtn").click(function(){
   const text=$('#msgInput').val()
   let action = 'sent a message'
   if(text!=""&&(statusregis=="Successful"||statusregis=="You already registered")){
    const data={
      name:nameplayer,
      descriptiontext:text,
      action:action
    }

    $.get('/chatbox',data, function (responsedata) {
    })

    $.get('/actionLog',data)

    $('#msgInput').val("")
   }
   else if(text=="") {
    alert("Please input text on chatbox")
   }
   else{
    alert("You must register before starting chat")
   }
  });

  $("#msgInput").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      const text=$('#msgInput').val()
      let action = 'sent a message'
      if(text!=""&&(statusregis=="Successful"||statusregis=="You already registered")){
       const data={
         name:nameplayer,
         descriptiontext:text,
         action:action
       }
 
       $.get('/chatbox',data, function (responsedata) {
       })
 
       $.get('/actionLog',data)
 
       $('#msgInput').val("")
      }
      else if(text=="") {
       alert("Please input text on chatbox")
      }
      else{
       alert("You must register before starting chat")
      }
    }
});
});


  //Update message chat on chat box
  function updatechatbox(){
      socket.on('updatechatbox', data => {
      $('#messageWindow').append(`${data.name}: ${data.description}<br/>`)
    }); 
  }