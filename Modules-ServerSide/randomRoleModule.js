function getrandomRole(items,playerData){
    let item = items[Math.floor(Math.random() * items.length)];
    let role=item["RoleCardName"]
    playerData[0].role=role
    if (role == "Sheriff"){
        playerData[0].maxLife = playerData[0].maxLife + 1
        playerData[0].currentLife = playerData[0].currentLife + 1
    }
    let index = items.indexOf(item);
    items.splice(index, 1);
  
    item = items[Math.floor(Math.random() * items.length)];
    role=item["RoleCardName"]
    playerData[1].role=role
    if (role =="Sheriff"){
        playerData[1].maxLife = playerData[1].maxLife + 1
        playerData[1].currentLife = playerData[1].currentLife + 1
    }
    index = items.indexOf(item);
    items.splice(index, 1);
  
    item = items[Math.floor(Math.random() * items.length)];
    role=item["RoleCardName"]
    playerData[2].role=role
    if (role == "Sheriff"){
        playerData[2].maxLife = playerData[2].maxLife + 1
        playerData[2].currentLife = playerData[2].currentLife + 1
    }
    index = items.indexOf(item);
    items.splice(index, 1);
  
    item = items[Math.floor(Math.random() * items.length)];
    role=item["RoleCardName"]
    playerData[3].role=role
    if (role == "Sheriff"){
        playerData[3].maxLife = playerData[3].maxLife + 1
        playerData[3].currentLife = playerData[3].currentLife + 1
    }
    index = items.indexOf(item);
    items.splice(index, 1);
  
    item = items[Math.floor(Math.random() * items.length)];
    role=item["RoleCardName"]
    playerData[4].role=role
    if (role == "Sheriff"){
        playerData[4].maxLife = playerData[4].maxLife + 1
        playerData[4].currentLife = playerData[4].currentLife + 1
    }
  }
  
module.exports= {
    getrandomRole,
}  