
    socket.on("missedOption", attackerName=>{
      if (confirm(`${attackerName} targeted you with a bang! Use a missed?`)){
          console.log('Missed Played')
      } else {
          console.log('Bang Hit')
      }
    })




//   socket.on("missedOption",data=>{
//     console.log("missed modal hit")
//     $(`#missedModal`).modal('open')
