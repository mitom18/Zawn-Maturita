//startovaci souradnice hrace a seed jako globalni promenne
var startingPositionX;
var startingPositionY;
var level = 1;
var levelMax = 2;
var seed;

function generateWorld(width, height, uroven) {
  //funkce vygeneruje mapu sveta na zaklade podminek, ale nahodne podle seedu (mapu lze reprodukovat)
  var d = new Date();
  seed = d.getTime();

  //napln celou mapku prazdnymi mistnostmi
  var svet = new Array();
  for (var i = 0; i < height; i++) {
    var rada = new Array();
    for (var j = 0; j < width; j++) {
      rada.push(2);
    }
    svet.push(rada);
  }

  if (uroven == 1 || uroven == 2) {

    if (seed % 2 == 0) {
      //urceni startu a cile
      svet[0][0] = 0;
      startingPositionX = 0;
      startingPositionY = 0;
      svet[height-1][width-1] = 1;
      //urceni zdi
      if (seed % 4 == 0) {
        for (var i = 0; i < height; i++) {
          if (i % 2 != 0) {
            svet[i][Math.floor(width/2)] = 2;
          } else {
            svet[i][Math.floor(width/2)] = 6;
          }
        }
        for (var i = 0; i < width; i++) {
          if (i % 3 <= 1) {
            svet[Math.floor(height/2)][i] = 6;
          }
        }
      } else {
        for (var i = 0; i < width; i++) {
          if (i % 3 > 1) {
            svet[Math.floor(height/2)][i] = 2;
          } else {
            svet[Math.floor(height/2)][i] = 6;
          }
        }
        for (var i = 0; i < height; i++) {
          if (i % 2 != 0) {
            svet[i][Math.floor(width/2)] = 6;
          }
        }
      }
      //urceni ostatnich mistnosti
      if (seed % 10 == 1 || seed % 10 == 4 || seed % 10 == 7) {
        svet[height-1][Math.floor(width/4)] = 4;
        svet[0][Math.floor(width*0.75)] = 3;
      }
      else if (seed % 10 == 2 || seed % 10 == 3 || seed % 10 == 8) {
        svet[height-1][Math.floor(width/4)] = 3;
        svet[0][Math.floor(width*0.75)] = 4;
      }
      else if (seed % 10 == 9 || seed % 10 == 5 || seed % 10 == 0) {
        svet[height-1][Math.floor(width/3)] = 3;
        svet[0][Math.floor(width*0.9)] = 4;
      }
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 5;
          break;
        }
      }

      /*
      svet[Math.floor(height/2)][Math.floor(width/2)] = 6;
      svet[Math.floor(height/2)][Math.floor(width/2)-1] = 4;
      svet[Math.floor(height/2)][Math.floor(width/2)+1] = 5;
      svet[Math.floor(height/2)-1][Math.floor(width/2)] = 3;
      svet[Math.floor(height/2)+1][Math.floor(width/2)] = 7;
      */

    } else {
      //urceni startu a cile
      svet[height-1][0] = 0;
      startingPositionX = 0;
      startingPositionY = height-1;
      svet[0][width-1] = 1;
      //urceni zdi
      if (seed % 5 == 0) {
        for (var i = 0; i < height; i++) {
          if (i % 2 != 0) {
            svet[i][Math.floor(width/2)] = 2;
          } else {
            svet[i][Math.floor(width/2)] = 6;
          }
        }
        for (var i = 0; i < width; i++) {
          if (i % 3 <= 1) {
            svet[Math.floor(height/2)][i] = 6;
          }
        }
      } else {
        for (var i = 0; i < width; i++) {
          if (i % 3 > 1) {
            svet[Math.floor(height/2)][i] = 2;
          } else {
            svet[Math.floor(height/2)][i] = 6;
          }
        }
        for (var i = 0; i < height; i++) {
          if (i % 2 != 0) {
            svet[i][Math.floor(width/2)] = 6;
          }
        }
      }
      //urceni ostatnich mistnosti
      if (seed % 10 == 1 || seed % 10 == 4 || seed % 10 == 7 || seed % 10 == 6) {
        svet[0][Math.floor(width/4)] = 4;
        svet[height-1][Math.floor(width*0.75)] = 3;
      }
      else if (seed % 10 == 2 || seed % 10 == 3 || seed % 10 == 8) {
        svet[0][Math.floor(width/4)] = 3;
        svet[height-1][Math.floor(width*0.75)] = 4;
      }
      else if (seed % 10 == 9 || seed % 10 == 5 || seed % 10 == 0) {
        svet[0][Math.floor(width/3)] = 3;
        svet[height-1][Math.floor(width*0.9)] = 4;
      }
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 5;
          break;
        }
      }
    }

      /*
      svet[Math.floor(height/2)][Math.floor(width/2)] = 6;
      svet[Math.floor(height/2)-1][Math.floor(width/2)] = 4;
      svet[Math.floor(height/2)+1][Math.floor(width/2)] = 5;
      */
  }

  console.log(seed);
  console.log(svet);
  return svet;
}

var _world = generateWorld(7, 5, level);

var _worldPuv = [
  [0,3,2,2,5],
  [4,2,4,2,6],
  [3,6,6,5,2],
  [2,2,4,3,2],
  [5,3,2,2,1]
]

function describeWorld(svet) {
  //funkce doplni do sveta instance trid mistnosti na zaklade cisel v puvodni mapce
  var svet = svet;
  var newSvet = new Array();
  svet.forEach(function(item, index) {
    var newRada = new Array();
    item.forEach(function(item2, index2) {
      if (item2 === 0) {
        var mistnost = new roomStart(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 1) {
        var mistnost = new roomFinal(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 2) {
        var mistnost = new emptyPath(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 3) {
        var mistnost = new roomLootGold(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 4) {
        var mistnost = new roomLootRandom(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 5) {
        var mistnost = new roomEnemyOgre(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 6) {
        var mistnost = new Wall(index2, index);
        newRada.push(mistnost);
      }
      else if (item2 === 7) {
        var mistnost = new roomLootDagger(index2, index);
        newRada.push(mistnost);
      }
    });
    newSvet.push(newRada);
  });
  return newSvet;
}

function drawMap(x, y, playerX, playerY, world) {
  //funkce vykresluje grafickou mapku na zaklade cisel v puvodni mapce
  Context.context.save();
  Context.context.clearRect(x, y-30, world.length*15, world[0].length*15+30);
  Context.context.fillText("Map:", x, y-15);
  var Xpuv = x;
  var Ypuv = y;
  var xova = x;
  var yova = y;
  world.forEach(function(item, index) {
    item.forEach(function(item2, index2) {
      if (item2 === 0) {
          Context.context.fillStyle = 'pink';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 1) {
          Context.context.fillStyle = 'yellow';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 2) {
          Context.context.fillStyle = 'grey';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 3) {
          Context.context.fillStyle = 'gold';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 4) {
          Context.context.fillStyle = 'silver';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 5) {
          Context.context.fillStyle = 'red';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 6) {
          Context.context.fillStyle = 'black';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
      else if (item2 === 7) {
          Context.context.fillStyle = 'orange';
          Context.context.fillRect(xova, yova, 15, 15);
          xova += 15;
      }
    });
    xova = Xpuv;
    yova += 15;
  });
  Context.context.fillStyle = 'blue';
  Context.context.fillRect(Xpuv+playerX*15, Ypuv+playerY*15, 15, 15);
  Context.context.restore();
}

function stepInTile(x, y, world) {
  //vrati tridu mistnosti na uvedenych souradnicich
  return world[y][x];
}

//TRIDY VSECH MISTNOSTI

class mapTile {
  //zakladni trida vsech mistnosti
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  intro_text() {
    return null;
  }
  modify_player(player) {
    return null;
  }
}

class roomStart extends mapTile {
  intro_text() {
    this.image = document.getElementById("entrance");
    if (level == 1) {
      this.text = "You find yourself in a room with flickering torches on the walls. You can make out several paths, each equally as dark and foreboding.";
    } else {
      this.text = "You go deeper into the dungeon...";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
    player.inCombat = false;
    document.getElementById("combathudba").pause();
    document.getElementById("combathudba").currentTime = 0;
    document.getElementById("pozadihudba").play();
  }
}

class Wall extends mapTile {
  intro_text() {
    return null;
  }
  modify_player(player) {
    return null;
  }
}

class emptyPath extends mapTile {
  intro_text() {
    this.image = document.getElementById("path");
    this.text = "Another unremarkable part of the dungeon. You must forge onwards.";
    Context.context.drawImage(this.image, 80, 50, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
    player.inCombat = false;
    document.getElementById("combathudba").pause();
    document.getElementById("combathudba").currentTime = 0;
    document.getElementById("pozadihudba").play();
  }
}

class roomFinal {
  intro_text(player) {
    this.klic = false;
    for (var item of player.inventory) {
      if (item instanceof Key) {
        this.image = document.getElementById("exit");
        this.text = "The key matches and you unlock the door! You are free, you made it!";
        this.klic = true;
        break;
      }
    };
    if (!this.klic) {
      if (level == levelMax) {
        this.image = document.getElementById("exit");
        this.text = "You have to find a key to unlock the exit door.";
      } else {
        this.image = document.getElementById("cage");
        this.text = "You have to find a key to continue your journey.";
      }
    }
    Context.context.drawImage(this.image, 75, 30, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
    player.inCombat = false;
    document.getElementById("combathudba").pause();
    document.getElementById("combathudba").currentTime = 0;
    document.getElementById("pozadihudba").play();
    if (this.klic) {
      if (level == levelMax) {
        player.victory = true;
      } else {
        level += 1;
        _world = generateWorld(10, 5, level); //generace noveho levelu
        player.inventory.forEach(function(item, index) {
          if (item instanceof Key) {
            player.inventory.splice(index, 1);
          }
        });
        player.locationX = startingPositionX;
        player.locationY = startingPositionY;
        window.described_world = describeWorld(_world); //inicializace noveho levelu
        var novaAktualniMistnost = stepInTile(startingPositionX, startingPositionY, described_world);
        Context.context.clearRect(0, 0, player.platno.width/2+10, player.platno.height);
        novaAktualniMistnost.intro_text();
      }
    }
  }
}

class roomLoot extends mapTile {
  //zakladni trida pro mistnosti s lootem
  constructor(x, y, item) {
    super(x, y);
    this.item = item;
    this.taken = false;
  }
  addLoot(player) {
    if (!this.taken) {
      player.inventory.push(this.item);
      player.printInventory(480, 315);
      Context.context.clearRect(0, 0, player.platno.width/2+10, player.platno.height);
      Context.context.drawImage(document.getElementById("lootopened"), 80, 50, 250, 250);
      Context.context.drawImage(this.item.image, 175, 180, 30, 30);
      wrapText(Context.context, "You found a {0}!".format(this.item.name), 15, 330, 400, 25);
    }
    this.taken = true;
  }
  modify_player(player) {
    player.inCombat = false;
    document.getElementById("combathudba").pause();
    document.getElementById("combathudba").currentTime = 0;
    document.getElementById("pozadihudba").play();
  }
}

class roomLootRandom extends roomLoot {
  constructor(x, y) {
    var randomIndex = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    if (randomIndex == 0) var item = new LifePotion(10);
    if (randomIndex == 1) var item = new Gold(10);
    if (randomIndex == 2) var item = new Dagger();
    super(x, y, item);
  }
  intro_text() {
    if (!this.taken) {
      this.image = document.getElementById("lootclosed");
      this.text = "That's a chest! What treasures hide in it?";
    } else {
      this.image = document.getElementById("lootopened");
      this.text = "The chest has been already looted. You will find nothing here.";
    }
    Context.context.drawImage(this.image, 80, 50, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomLootGold extends roomLoot {
  constructor(x, y) {
    super(x, y, new Gold(15));
  }
  intro_text() {
    if (!this.taken) {
      this.image = document.getElementById("lootclosed");
      this.text = "That's a chest! What treasures hide in it?";
    } else {
      this.image = document.getElementById("lootopened");
      this.text = "The chest has been already looted. You will find nothing here.";
    }
    Context.context.drawImage(this.image, 80, 50, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomLootDagger extends roomLoot {
  constructor(x, y) {
    super(x, y, new Dagger());
  }
  intro_text() {
    if (!this.taken) {
      this.image = document.getElementById("lootclosed");
      this.text = "That's a chest! What treasures hide in it?";
    } else {
      this.image = document.getElementById("lootopened");
      this.text = "The chest has been already looted. You will find nothing here.";
    }
    Context.context.drawImage(this.image, 80, 50, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomEnemy extends mapTile {
  //zakladni trida pro mistnosti s neprately
  constructor(x, y, enemy) {
    super(x, y);
    this.enemy = enemy;
  }
  modify_player(player) {
    if (this.enemy.isAlive()) {
      player.inCombat = true;
      document.getElementById("pozadihudba").pause();
      document.getElementById("combathudba").play();
    }
  }
  enemy_attack(player) {
    if (this.enemy.isAlive()) {
      var damage = Math.floor(Math.random() * (this.enemy.damagemax - this.enemy.damagemin + 1)) + this.enemy.damagemin;
      player.hp = player.hp - damage;
      if (player.isAlive()) {
        player.printInventory(480, 315);
        Context.context.clearRect(15, 400, 320, 320);
        wrapText(Context.context, "{0} does {1} damage. You have {2} HP remaining.".format(this.enemy.name, damage, player.hp), 15, 390, 400, 25);
      } else {
        player.printInventory(480, 315);
        Context.context.fillStyle = 'white';
        Context.context.globalAlpha = 0.2;
        Context.context.fillRect(0, 0, player.platno.width, player.platno.height);
        Context.context.globalAlpha = 1.0;
        Context.context.fillStyle = 'red';
        Context.context.font = '35pt Bryant';
        Context.context.textAlign = "center";
        Context.context.shadowOffsetX = 3;
        Context.context.shadowBlur = 5;
        Context.context.shadowColor = 'black';
        Context.context.fillText("YOU DIED", player.platno.width/2+1, player.platno.height/2+1);
        document.getElementById("combathudba").pause();
        $('#playagain').css('display', 'inline-block');
        document.getElementById("defeathudba").play();
      }
    }
  }
  addLoot(player) {
    player.inventory.push(this.enemy.loot);
  }
}

class roomEnemyOgre extends roomEnemy {
  constructor(x, y) {
    super(x, y, new Ogre());
  }
  intro_text() {
    if (this.enemy.isAlive()) {
      this.image = document.getElementById("ogre");
      this.text = "An ogre is attacking you with a huge club! You can attack him by pressing D or flee by pressing F.";
    } else {
      this.image = document.getElementById("enemydead");
      this.text = "The corpse of a dead ogre lies on the ground.";
    }
    Context.context.drawImage(this.image, 80, 50, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}
