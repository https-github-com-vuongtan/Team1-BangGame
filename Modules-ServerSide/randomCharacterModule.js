function getrandomcharactercards(items,playerData){
    let item = items[Math.floor(Math.random() * items.length)];
    let charactername=item["charactername"]
    let maxlife=item["maxLife"]
    playerData[0].character=charactername
    playerData[0].maxLife=maxlife
    playerData[0].currentLife=maxlife
  
    let index = items.indexOf(item);
    items.splice(index, 1);
  
     item = items[Math.floor(Math.random() * items.length)];
      charactername=item["charactername"]
      maxlife=item["maxLife"]
     playerData[1].character=charactername
     playerData[1].maxLife=maxlife
     playerData[1].currentLife=maxlife

     index = items.indexOf(item);
    items.splice(index, 1);
  
     item = items[Math.floor(Math.random() * items.length)];
      charactername=item["charactername"]
      maxlife=item["maxLife"]
      playerData[2].maxLife=maxlife
     playerData[2].character=charactername
     playerData[2].currentLife=maxlife
     index = items.indexOf(item);
    items.splice(index, 1);
  
     item = items[Math.floor(Math.random() * items.length)];
      charactername=item["charactername"]
      maxlife=item["maxLife"]
      playerData[3].maxLife=maxlife
     playerData[3].character=charactername
     playerData[3].currentLife=maxlife
     index = items.indexOf(item);
    items.splice(index, 1);
  
     item = items[Math.floor(Math.random() * items.length)];
      charactername=item["charactername"]
      maxlife=item["maxLife"]
      playerData[4].maxLife=maxlife
      playerData[4].character=charactername
      playerData[4].currentLife=maxlife
  }
  
module.exports= {
    getrandomcharactercards,
}  