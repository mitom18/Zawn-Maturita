//startovaci souradnice hrace a urceni poctu levelu jako globalni promenne
var startingPositionX;
var startingPositionY;
var level = 1;
var levelMax = 10;

function checkWorld(world) {
  //funkce zkontroluje, zda se neexistuje na mape nedosazitelne policko (prohledavani do sirky)
  var w = world[0].length; //sirka
  var h = world.length; //vyska
  var n = w * h; //pocet policek
  var walls = []; //plan zdi
  for (var i = 0; i < n; i++) walls.push(0);
  var distance = []; //plan navstivenych policek (+ vzdalenosti od startu)
  for (var i = 0; i < n; i++) distance.push(-1);
  var tasks = []; //seznam ukolu pro BFS
  //urceni startu, cile a zdi
  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      if (world[i][j] == 0) var start = w * i + j;
      if (world[i][j] == 1) var finish = w * i + j;
      if (world[i][j] == 6) walls[w * i + j] = 1;
    }
  }
  var neighbors = []; //seznam sousedu prochazenych policek
  for (var v = 0; v < n; v++) {
    neighbors.push([]);
    if (v+w < n && walls[v+w] == 0) neighbors[v].push(v+w);
    if (v-w >= 0 && walls[v-w] == 0) neighbors[v].push(v-w);
    if ((v%w)+1 < w && walls[v+1] == 0) neighbors[v].push(v+1);
    if ((v%w)-1 >= 0 && walls[v-1] == 0) neighbors[v].push(v-1);
  }

  distance[start] = 0;
  tasks.push(start);
  while (tasks.length > 0) {
    var task = tasks.shift();
    for (var neighbor of neighbors[task]) {
      if (distance[neighbor] < 0) {
        distance[neighbor] = distance[task] + 1;
        tasks.push(neighbor);
      }
    }
  }

  var evaluatedWorld = []; //plan pro hodnoceni, po secteni zustane -1 na polickach, ktera jsou nedosazitelna
  for (var i = 0; i < n; i++) {
    evaluatedWorld.push(walls[i] + distance[i]);
  }

  var isNotOK = false;
  var coordsWrong = [];
  evaluatedWorld.forEach(function(item, index) {
    if (item < 0) {
      isNotOK = true;
      var i = Math.floor(index / w); //cislo radku
      var j = index % w; //cislo sloupce
      coordsWrong.push([j, i]);
    }
  });
  return [isNotOK, coordsWrong];
}

function generateLevelInEndless(generatedLevel, returning) {
  class newLevel {
    constructor(generatedLevel, checkedItem, amount, roomsInLevel) {
      this.level = generatedLevel;
      this.item = checkedItem;
      this.itemAmount = amount;
      this.rooms = roomsInLevel;
    }
  }
  var difficulty = generatedLevel*100;
  var enemies = [Spider, Ogre, Minotaur, Demon, Orc, Diablo, Boss];
  var enemiesRooms = [9, 5, 11, 13, 15, 16, 17];
  var randomIndex1 = Math.floor(Math.random()*enemies.length);
  var mainEnemy = enemies[randomIndex1];
  var mainEnemyRoom = enemiesRooms[randomIndex1];
  var checkedItem = new mainEnemy().loot.constructor;
  var amount = Math.floor(difficulty/(new mainEnemy().hp*2));
  var randomIndex2 = Math.floor(Math.random()*enemies.length);
  var goblinNumber = Math.floor(Math.random() * 5) + 1;
  var lootNumber = Math.floor((amount*((new mainEnemy().damagemax+new mainEnemy().damagemin)/2))/2);
  var roomsInLevel = [[mainEnemyRoom, amount], [12, goblinNumber], [8, 2], [4, lootNumber]];

  console.log(checkedItem);
  console.log(amount);
  console.log(roomsInLevel);
  if (generatedLevel == 1 && window.createdLevel == undefined) {
    window.createdLevel = new newLevel(generatedLevel, checkedItem, amount, roomsInLevel);
  } else {
    if (createdLevel.level != generatedLevel) {
      createdLevel.level = generatedLevel;
      createdLevel.itemAmount = amount;
      createdLevel.rooms = roomsInLevel;
      createdLevel.item = checkedItem;
    }
  }
  if (returning == "amount") return createdLevel.itemAmount;
  if (returning == "roomsInLevel") return createdLevel.rooms;
  if (returning == "checkedItem") return createdLevel.item;
}

function generateWorld(width, height, generatedLevel) {
  //funkce vygeneruje mapu sveta na zaklade podminek, ale nahodne podle seedu (mapu lze reprodukovat)
  if (window.endless != "on" || generatedLevel == 1) {
    if (!seed) {
      var cookietoseed = getCookie("seed");
      if (cookietoseed != "") {
        window.seed = cookietoseed;
      } else {
        var d = new Date();
        window.seed = d.getTime();
      }
    }

    $('#seedshow').text("world seed: " + seed.toString());
    Math.seedrandom(seed.toString());
  }


  //napln celou mapku prazdnymi mistnostmi
  var genWorld = new Array();
  for (var i = 0; i < height; i++) {
    var rada = new Array();
    for (var j = 0; j < width; j++) {
      rada.push(2);
    }
    genWorld.push(rada);
  }

  //urceni startu a cile a cesty do cile, kde nebudou zdi
  if (Math.random() < 0.5) {
    genWorld[0][0] = 0; //start
    startingPositionX = 0;
    startingPositionY = 0;
    genWorld[height-1][width-1] = 1; //cil

    var x = 0;
    var y = 0;
    for (var i = 0; i < width-1; i++) {
      if (Math.random() < 0.5) { //s 50% sanci jdi doprava nebo dolu, opakuj dal
        if (x < width-1) x++;
        if (genWorld[y][x] === 2) genWorld[y][x] = 10;
      } else {
        if (y < height-1) y++;
        if (genWorld[y][x] === 2) genWorld[y][x] = 10;
        i--;
      }
      //pokud narazis na posledni x, posun se k cili tim sloupcem, tzn. jdi jen dolu
      if (x == width-1 && y != height-1) {
        while (y != height-1) {
          y++;
          if (genWorld[y][x] === 2) genWorld[y][x] = 10;
          i--;
        }
      } //pokud narazis na posledni y, posun se k cili tou radou, tzn. jdi jen doprava
      else if (x != width-1 && y == height-1) {
        while (x != width-1) {
          x++;
          if (genWorld[y][x] === 2) genWorld[y][x] = 10;
          i--;
        }
      }
    }
  } else {
    genWorld[height-1][0] = 0; //start
    startingPositionX = 0;
    startingPositionY = height-1;
    genWorld[0][width-1] = 1; //cil

    var x = 0;
    var y = height - 1;
    for (var i = 0; i < width-1; i++) {
      if (Math.random() < 0.5) { //s 50% sanci jdi doprava nebo nahoru, opakuj dal
        if (x < width-1) x++;
        if (genWorld[y][x] === 2) genWorld[y][x] = 10;
      } else {
        if (y > 0) y--;
        if (genWorld[y][x] === 2) genWorld[y][x] = 10;
        i--;
      }
      //pokud narazis na posledni x, posun se k cili tim sloupcem, tzn. jdi jen nahoru
      if (x == width-1 && y != 0) {
        while (y != 0) {
          y--;
          if (genWorld[y][x] === 2) genWorld[y][x] = 10;
          i--;
        }
      } //pokud narazis na posledni y, posun se k cili tou radou, tzn. jdi jen doprava
      else if (x != width-1 && y == 0) {
        while (x != width-1) {
          x++;
          if (genWorld[y][x] === 2) genWorld[y][x] = 10;
          i--;
        }
      }
    }
  }

  //urceni zdi
  var maze = [0, 0, genWorld[0].length, genWorld.length];
  var stack = [maze];
  while (stack.length > 0) {
    var area = stack.pop();
    if (area[2] > 2 || area[3] > 2) {
      if (area[2] > area[3]) {
        var xova = Math.floor(Math.random() * (area[0] + area[2] - 1 - area[0] + 1)) + area[0];
        for (var i = area[1]; i < area[1]+area[3]; i++) {
          if (Math.random() < 0.75) {
            if (i >= 0 && xova < genWorld[0].length) if (genWorld[i][xova] == 2) genWorld[i][xova] = 6;
          } else {
            if (i >= 0 && xova < genWorld[0].length) if (genWorld[i][xova] == 2) genWorld[i][xova] = 10;
          }
        }
        var newArea1 = [area[0], area[1], xova-area[0], area[3]];
        var newArea2 = [xova+1, area[1], area[2]-(newArea1[2]+1), area[3]];
        if (newArea1[2] > 2 || newArea1[3] > 2) stack.push(newArea1);
        if (newArea2[2] > 2 || newArea2[3] > 2) stack.push(newArea2);
      } else {
        var yova = Math.floor(Math.random() * (area[1] + area[3] - 1 - area[1] + 1)) + area[1];
        for (var i = area[0]; i < area[0]+area[2]; i++) {
          if (Math.random() < 0.75) {
            if (i >= 0 && yova < genWorld.length) if (genWorld[yova][i] == 2) genWorld[yova][i] = 6;
          } else {
            if (i >= 0 && yova < genWorld.length) if (genWorld[yova][i] == 2) genWorld[yova][i] = 10;
          }
        }
        var newArea1 = [area[0], area[1], area[2], yova-area[1]];
        var newArea2 = [area[0], yova+1, area[2], area[3]-(newArea1[3]+1)];
        if (newArea1[3] > 2 || newArea1[2] > 2) stack.push(newArea1);
        if (newArea2[3] > 2 || newArea2[2] > 2) stack.push(newArea2);
      }
    }
  }

  //z nedosazitelnych policek se udelaji zdi
  var repareWorld = checkWorld(genWorld);
  if (repareWorld[0]) {
    repareWorld[1].forEach(function(item, index) {
      var x = item[0];
      var y = item[1];
      genWorld[y][x] = 6;
    })
  }

  //urceni dalsich mistnosti podle urovni
  if (window.endless != "on") {
    if (generatedLevel == 1) {
      //dvourozmerne pole, [[typ mistnosti, pocet mistnosti toho typu], [dalsi mistnost, jeji pocet]...]
      var roomsInLevel = [[9, 1], [12, 1], [4, 3], [3, 1]];
    }
    else if (generatedLevel == 2) var roomsInLevel = [[5, 2], [12, 1], [4, 4], [8, 1]];
    else if (generatedLevel == 3) var roomsInLevel = [[7, 1], [12, 3], [4, 4]];
    else if (generatedLevel == 4) var roomsInLevel = [[11, 1], [12, 3], [8, 2], [4, 6]];
    else if (generatedLevel == 5) var roomsInLevel = [[14, 1], [13, 2], [12, 2], [8, 1], [4, 5]];
    else if (generatedLevel == 6) var roomsInLevel = [[15, 2], [5, 1], [12, 1], [8, 1], [4, 6]];
    else if (generatedLevel == 7) var roomsInLevel = [[15, 2], [13, 1], [12, 1], [8, 1], [4, 7]];
    else if (generatedLevel == 8) var roomsInLevel = [[16, 1], [13, 2], [15, 1], [8, 1], [4, 7]];
    else if (generatedLevel == 9) var roomsInLevel = [[15, 3], [13, 3], [12, 1], [8, 1], [4, 7]];
    else if (generatedLevel == 10) var roomsInLevel = [[17, 1], [15, 2], [13, 2], [9, 1], [8, 1], [4, 7]];
  } else {
    var roomsInLevel = generateLevelInEndless(generatedLevel, "roomsInLevel");
  }
  roomsInLevel.forEach(function (item, index) {
    for (var i = 0; i < item[1]; i++) {
      while (true) { //vyber nahodnou mistnost, kde je volno, a dej ji zadany typ
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (genWorld[randomY][randomX] == 2 || genWorld[randomY][randomX] == 10) {
          genWorld[randomY][randomX] = item[0];
          break;
        }
      }
    }
  });

  console.log(genWorld);
  return genWorld;
}

function describeWorld(world) {
  //funkce doplni do sveta instance trid mistnosti na zaklade cisel v puvodni mapce
  var world = world;
  var newWorld = new Array();
  world.forEach(function(item, index) {
    var newRow = new Array();
    item.forEach(function(item2, index2) {
      if (item2 === 0) {
        var room = new roomStart(index2, index);
      }
      else if (item2 === 1) {
        var room = new roomFinal(index2, index);
      }
      else if (item2 === 2 || item2 === 10) {
        var room = new emptyPath(index2, index);
      }
      else if (item2 === 3) {
        var room = new roomLootGold(index2, index);
      }
      else if (item2 === 4) {
        var room = new roomLootRandom(index2, index);
      }
      else if (item2 === 5) {
        var room = new roomEnemyOgre(index2, index);
      }
      else if (item2 === 6) {
        var room = new Wall(index2, index);
      }
      else if (item2 === 7) {
        var room = new roomLootHammer(index2, index);
      }
      else if (item2 === 8) {
        var room = new roomMerchant(index2, index);
      }
      else if (item2 === 9) {
        var room = new roomEnemySpider(index2, index);
      }
      else if (item2 === 11) {
        var room = new roomEnemyMinotaur(index2, index);
      }
      else if (item2 === 12) {
        var room = new roomEnemyGoblin(index2, index);
      }
      else if (item2 === 13) {
        var room = new roomEnemyDemon(index2, index);
      }
      else if (item2 === 14) {
        var room = new roomLootPoison(index2, index);
      }
      else if (item2 === 15) {
        var room = new roomEnemyOrc(index2, index);
      }
      else if (item2 === 16) {
        var room = new roomEnemyDiablo(index2, index);
      }
      else if (item2 === 17) {
        var room = new roomEnemyBoss(index2, index);
      }
      newRow.push(room);
    });
    newWorld.push(newRow);
  });
  return newWorld;
}

function drawMap(x, y, playerX, playerY, world) {
  //funkce vykresluje grafickou mapku na zaklade cisel v puvodni mapce
  Context.context.save();
  Context.context.clearRect(x, y-30, 19*15, world.length*15+30);
  Context.context.fillText("Map:", x, y-15);
  Context.context.fillText("Level: {0}".format(level), x+165, y-15);
  var Xpuv = x;
  var Ypuv = y;
  var xova = x;
  var yova = y;
  world.forEach(function(item, index) {
    item.forEach(function(item2, index2) {
      if (Math.abs(playerX - index2) <= 3 && Math.abs(playerY - index) <= 3) { //zobrazuj jen policka ve 3x3 ctverci kolem hrace
        if (item2 === 0) {
            Context.context.fillStyle = 'pink'; //start
        }
        else if (item2 === 1) {
            Context.context.fillStyle = 'yellow'; //cil
        }
        else if (item2 === 2 || item2 === 10 || item2 === 3 || item2 === 4 || item2 === 14) {
            Context.context.fillStyle = 'grey'; //obycejne mistnosti/obycejny loot
        }
        else if (item2 === 5 || item2 === 9 || item2 === 11 || item2 == 12 || item2 === 13 || item2 === 15 || item2 === 16 || item2 === 17) {
            Context.context.fillStyle = 'red'; //nepratele
        }
        else if (item2 === 6) {
            Context.context.fillStyle = 'black'; //zed
        }
        else if (item2 === 7) {
            Context.context.fillStyle = 'orange'; //specialni loot
        }
        else if (item2 === 8) {
            Context.context.fillStyle = 'green'; //obchodnik
        }
      } else {
        Context.context.fillStyle = 'black'; //prilis vzdalene policko
      }
      Context.context.fillRect(xova, yova, 15, 15);
      xova += 15;
    });
    xova = Xpuv;
    yova += 15;
  });
  Context.context.fillStyle = 'blue'; //hracova pozice
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
  constructor(x, y, image, text) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.text = text;
  }
  intro_text(player) { //vypise uvodni text mistnosti a jeji uvodni grafiku
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) { //obstara pri vstupu do mistnosti ostatni potrebne funkce
    player.inCombat = false;
    document.getElementById("combatmusic").pause();
    document.getElementById("combatmusic").currentTime = 0;
    document.getElementById("bgmusic").play();
  }
}

class roomStart extends mapTile {
  constructor(x, y) {
    var image = document.getElementById("entrance");
    if (level == 1) {
      var text = "You find yourself in a room with flickering torches on the walls. You can make out several paths, each equally as dark and foreboding.";
    } else {
      var text = "You go deeper into the dungeon...";
    }
    super(x, y, image, text);
  }
}

class Wall extends mapTile {
  intro_text(player) {
    return null;
  }
  modify_player(player) {
    return null;
  }
}

class emptyPath extends mapTile {
  constructor(x, y) {
    var image = document.getElementById("path");
    var text = "Another unremarkable part of the dungeon. You must forge onwards.";
    super(x, y, image, text);
  }
}

class roomFinal {
  check_item(player, checkedItem, amount) {
    var inInventory = false;
    var counter = 0;
    if (checkedItem instanceof Array) {
      goThroughInv: {
        for (var item of checkedItem) {
          var checkedItem1 = item;
          for (var item2 of player.inventory) {
            if (item2 instanceof checkedItem1) {
              counter++;
              if (counter == amount) {
                inInventory = true;
                break goThroughInv;
              }
            }
          }
          counter = 0;
        }
      }
    } else {
      var checkedItem1 = checkedItem;
      for (var item of player.inventory) {
        if (item instanceof checkedItem) {
          counter++;
          if (counter == amount) {
            inInventory = true;
            break;
          }
        }
      }
    }
    return [inInventory, checkedItem1];
  }

  intro_text(player, intro, proceed) {
    if (intro == undefined || proceed == undefined) {
      return null;
    } else {
      if (intro == 1) {
        this.image = document.getElementById("finalgnome");
        if (proceed) this.text = "What a cute spider! Thank you!";
        else this.text = "Stop! Bring me a small spider and I will let you get through. If you have it, press D.";
      }
      else if (intro == 2) {
        this.image = document.getElementById("finalguard");
        if (proceed) this.text = "Nice work, you can go on now.";
        else this.text = "Stop! I won't let you continue until you give me 2 saphir amulets. If you have them, press D.";
      }
      else if (intro == 3) {
        this.image = document.getElementById("wall");
        if (proceed) this.text = "One punch and the wall breaks apart. You can continue.";
        else this.text = "This wall seems weak. With a good tool you should be able to break through. If you have something to use, press D.";
      }
      else if (intro == 4) {
        this.image = document.getElementById("cage");
        if (proceed) this.text = "The key matches and you unlock the door! You can go on.";
        else this.text = "The door is locked. You have to find a key to go on. If you have it, press D to proceed.";
      }
      else if (intro == 5) {
        this.image = document.getElementById("finalgargoyle");
        if (proceed) this.text = "Thank you! Now you can go on.";
        else this.text = "Stop! Bring me 3 bottles of poison and then I'll let you continue. If you have them, press D.";
      }
      else if (intro == 6) {
        this.image = document.getElementById("finalguard");
        if (proceed) this.text = "Thank you! Now you can continue.";
        else this.text = "Stop! Bring me a saphir amulet or a golden amulet and I'll let you get through. If you have it, press D.";
      }
      else if (intro == 7) {
        this.image = document.getElementById("finalelf");
        if (proceed) this.text = "Nice work, you can go on now.";
        else this.text = "Stop! Bring me 2 golden amulets and then I'll let you continue. If you have them, press D.";
      }
      else if (intro == 8) {
        this.image = document.getElementById("finalkenku");
        if (proceed) this.text = "Thank you! Nice work, you can continue.";
        else this.text = "Hold on! I won't let you get through until you bring me a skull of diablo. If you have it, press D.";
      }
      else if (intro == 9) {
        this.image = document.getElementById("finalfairy");
        if (proceed) this.text = "Thank you, my hero! Good luck on your journey.";
        else this.text = "My saviour! I need 3 golden amulets or 3 bottles of poison, will you help me? (Well, you have to..) If you have it, press D.";
      }
      else if (intro == 10) {
        this.image = document.getElementById("exit");
        if (proceed) this.text = "The key matches and you unlock the door! You are free, you made it!";
        else this.text = "The door is locked. You have to find a key to go on. If you have it, press D to proceed.";
      }
      else if (intro instanceof Array) {
        this.image = document.getElementById("finalkenku");
        if (proceed) this.text = "Thank you! Nice work, you can continue.";
        else {
          var wantedItem = intro[0];
          if (intro[1] > 1) this.text = "Stop! Bring me {0} {1}s and I'll let you continue. If you have it, press D to proceed.".format(intro[1], new wantedItem().name);
          else this.text = "Stop! Bring me {0} and I'll let you continue. If you have it, press D to proceed.".format(new wantedItem().name);
        }
      }
      Context.context.drawImage(this.image, 65, 25, 250, 250);
      wrapText(Context.context, this.text, 15, 330, 400, 25);
    }
  }

  modify_player(player) {
    player.inCombat = false;
    document.getElementById("combatmusic").pause();
    document.getElementById("combatmusic").currentTime = 0;
    document.getElementById("bgmusic").play();
    if (window.endless != "on") this.intro_text(player, level, false);
    else this.intro_text(player, [generateLevelInEndless(level, "checkedItem"), generateLevelInEndless(level, "amount")], false);
  }
  toNewLevel(player) {
    if (window.endless != "on") {
      if (level == levelMax) {
        var checkedItem = Key;
        var amount = 1;
        var intro = 10;
      }
      else if (level == 1) {
        var checkedItem = SmallSpider;
        var amount = 1;
        var intro = 1;
      }
      else if (level == 2) {
        var checkedItem = Saphir;
        var amount = 2;
        var intro = 2;
      }
      else if (level == 3) {
        var checkedItem = Hammer;
        var amount = 1;
        var intro = 3;
      }
      else if (level == 4) {
        var checkedItem = Key;
        var amount = 1;
        var intro = 4;
      }
      else if (level == 5) {
        var checkedItem = Poison;
        var amount = 3;
        var intro = 5;
      }
      else if (level == 6) {
        var checkedItem = new Array(Saphir, Amulet);
        var amount = 1;
        var intro = 6;
      }
      else if (level == 7) {
        var checkedItem = Amulet;
        var amount = 2;
        var intro = 7;
      }
      else if (level == 8) {
        var checkedItem = Skull;
        var amount = 1;
        var intro = 8;
      }
      else if (level == 9) {
        var checkedItem = new Array(Amulet, Poison);
        var amount = 3;
        var intro = 9;
      }
    } else {
      var checkedItem = generateLevelInEndless(level, "checkedItem");
      var amount = generateLevelInEndless(level, "amount");
      var intro = [checkedItem, amount];
    }
    var checkedItemArray = this.check_item(player, checkedItem, amount);
    if (checkedItemArray[0]) {
      this.intro_text(player, intro, true);
      if (level == levelMax && window.endless != "on") {
        player.victory = true;
        Context.context.clearRect(15, 305, 400, 320);
        this.intro_text(player, intro, true);
        Context.context.fillStyle = 'white';
        Context.context.globalAlpha = 0.2;
        Context.context.fillRect(0, 0, player.canvas.width, player.canvas.height);
        Context.context.globalAlpha = 1.0;
        Context.context.fillStyle = 'gold';
        Context.context.font = '35pt Bryant';
        Context.context.textAlign = "center";
        Context.context.shadowOffsetX = 3;
        Context.context.shadowBlur = 5;
        Context.context.shadowColor = 'black';
        Context.context.fillText("VICTORY", player.canvas.width/2+1, player.canvas.height/2+1);
        document.cookie = "seed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        setCookie("watchedIntro", "true", 30);
        setCookie("wasInShop", "true", 30);
        setCookie("enableEndless", "true", 30);
        document.getElementById("bgmusic").pause();
        $('#playagain').css('display', 'inline-block');
        document.getElementById("victorymusic").play();
      } else {
        level += 1;
        var deleteQuestItems = checkedItemArray[1];
        if (window.endless == "on") {
          var newLevelWidth = 19;
          var newLevelHeight = 11;
        } else {
          if (level == 2) {
            var newLevelWidth = 10;
            var newLevelHeight = 6;
          }
          else if (level == 3) {
            var newLevelWidth = 11;
            var newLevelHeight = 7;
          }
          else if (level == 4) {
            var newLevelWidth = 12;
            var newLevelHeight = 8;
          }
          else if (level == 5) {
            var newLevelWidth = 15;
            var newLevelHeight = 10;
          }
          else if (level == 6) {
            var newLevelWidth = 15;
            var newLevelHeight = 11;
          }
          else if (level == 7) {
            var newLevelWidth = 16;
            var newLevelHeight = 11;
          }
          else if (level == 8) {
            var newLevelWidth = 17;
            var newLevelHeight = 11;
          }
          else if (level == 9) {
            var newLevelWidth = 18;
            var newLevelHeight = 11;
          }
          else if (level == 10) {
            var newLevelWidth = 19;
            var newLevelHeight = 11;
          }
        }
        Context.context.clearRect(480, 50, _world[0].length*15, _world.length*15+30); //vycisteni mapy
        _world = generateWorld(newLevelWidth, newLevelHeight, level); //generace noveho levelu
        do {
          var i = 0;
          for (var item of player.inventory) {
            if (item instanceof deleteQuestItems) {
              player.inventory.splice(i, 1);
              break;
            }
            i++;
          }
          amount--;
        }
        while (amount > 0);
        player.locationX = startingPositionX;
        player.locationY = startingPositionY;
        window.described_world = describeWorld(_world); //inicializace noveho levelu
        var newCurrentRoom = stepInTile(startingPositionX, startingPositionY, described_world);
        drawMap(480, 80, player.locationX, player.locationY, _world);
        player.printInventory(480, 315);
        player.currentRoom = newCurrentRoom;
        Context.context.clearRect(0, 0, player.canvas.width/2+10, player.canvas.height);
        newCurrentRoom.intro_text(player);
        newCurrentRoom.modify_player(player);
      }
    } else {
      Context.context.clearRect(0, 0, player.canvas.width/2+10, player.canvas.height);
      this.intro_text(player, intro, false);
      Context.context.clearRect(15, 305, 400, 320);
      wrapText(Context.context, "You don't have all the required items. You must bring them to continue.", 15, 330, 400, 25);
    }
  }
}

class roomMerchant extends mapTile {
  //mistnost s obchodnikem
  constructor(x, y) {
    super(x, y);
    if (window.endless == "on") {
      this.inventory = [new Dagger(), new Sword(), new LifePotion(10), new LifePotion(5)];
    } else {
      if (level == 2) {
        this.inventory = [new Dagger(), new LifePotion(5), new LifePotion(5)];
      }
      else if (level == 4) {
        this.inventory = [new Sword(), new LifePotion(7), new Dagger(), new LifePotion(7)];
      }
      else if (level == 5) {
        this.inventory = [new Poison(), new LifePotion(10), new Sword];
      }
      else if (level == 6) {
        this.inventory = [new LifePotion(5), new LifePotion(10), new Sword];
      }
      else if (level == 7) {
        this.inventory = [new Poison(), new LifePotion(10), new LifePotion(5)];
      }
      else if (level == 8) {
        this.inventory = [new LifePotion(10), new LifePotion(5), new Amulet()];
      }
      else if (level == 9) {
        this.inventory = [new LifePotion(10), new Poison(), new Amulet()];
      }
      else if (level == 10) {
        this.inventory = [new LifePotion(10), new LifePotion(5), new LifePotion(7)];
      }
      else {
        this.inventory = [new Dagger(), new Sword(), new LifePotion(5)];
      }
    }
    this.boolBuy = true;
    this.invIndex = 0;
    this.currentItem = this.inventory[this.invIndex];
  }
  choosingAction() {
    //prepinani mezi kupovanim a prodavanim
    this.boolBuy = !this.boolBuy;
    this.invIndex = 0;
    if (this.boolBuy) $('#attack').text('buy (d)');
    else $('#attack').text('sell (d)');
  }
  choosingItem(direction, player) {
    if (this.boolBuy) {
      //prochazeni nabidky obchodnika, pokud hrac kupuje
      if (direction) {
        this.invIndex++;
        if (this.invIndex > this.inventory.length-1) this.invIndex = 0;
      } else {
        this.invIndex--;
        if (this.invIndex < 0) this.invIndex = this.inventory.length-1;
      }
      this.currentItem = this.inventory[this.invIndex];
    } else {
      //prochazeni inventare hrace, pokud hrac prodava
      if (direction) {
        this.invIndex++;
        if (this.invIndex > player.inventory.length-1) this.invIndex = 0;
      } else {
        this.invIndex--;
        if (this.invIndex < 0) this.invIndex = player.inventory.length-1;
      }
      this.currentItem = player.inventory[this.invIndex];
    }
  }
  buyItem(player) {
    //hrac kupuje item
    if (this.inventory.length > 0) {
      if (player.money >= this.currentItem.value) {
        player.money -= this.currentItem.value;
        player.inventory.push(this.currentItem);
        this.inventory.splice(this.invIndex, 1);
        this.invIndex = 0;
        this.text = "Enjoy your new {0}, my friend.".format(this.currentItem.name);
        this.currentItem = this.inventory[this.invIndex];
        this.printInventory(20, 255, player);
      } else {
        this.text = "You have not enough money to buy this item.";
      }
    }
    Context.context.clearRect(15, 305, 400, 320);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  sellItem(player) {
    //hrac prodava item
    if (this.currentItem.value > 0) {
      var i = 0;
      for (var item of player.inventory) {
        if (item.constructor.name === this.currentItem.constructor.name) break;
        i++;
      };
      player.money += this.currentItem.value;
      this.inventory.push(player.inventory[i]);
      player.inventory.splice(i, 1);
      this.text = "Thank you for this {0}, my friend.".format(this.currentItem.name);
      this.printInventory(20, 255, player);
    } else {
      this.text = "This is trash! I won't buy it from you.";
    }
    Context.context.clearRect(15, 305, 400, 320);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  printInventory(x, y, player, checkText) {
    //funkce kresli inventar obchodnika
    Context.context.save();
    Context.context.clearRect(x, y, 360, 50);
    var xova = x+45;
    var yova = y;

    //kresli inventar obchodnika
    if (this.boolBuy) var description = "BUY";
    else var description = "SELL";
    var item = 0;
    function compare(a, b) {
      //seradi itemy podle atributu value
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    };
    if (this.boolBuy) {
      var inv = this.inventory.sort(compare);
    } else {
      player.printInventory(480, 315);
      var inv = player.inventory.sort(compare);
    }
    this.currentItem = inv[this.invIndex];
    //vykresli inventar do 1 rady po 10 itemech, stejne itemy se nestackuji
    Context.context.save();
    Context.context.font = '12pt Bryant';
    Context.context.fillText(description, x, y+25);
    Context.context.restore();
    if (this.invIndex > 7) item = this.invIndex - 7;
    for (var j = 0; j < 8; j++) {
      if (inv[item]) {
        if (this.currentItem == inv[item]) {
          Context.context.drawImage(inv[item].image, xova, yova, 40, 40);
          Context.context.save();
          Context.context.font = '10pt Bryant';
          Context.context.clearRect(xova, yova+27, 30, 15);
          Context.context.drawImage(document.getElementById("coin"), xova, yova+30, 10, 10);
          Context.context.fillText(this.currentItem.value, xova+12, yova+40);
          Context.context.restore();
          if (checkText === undefined) {
            Context.context.clearRect(15, 305, 400, 320);
            wrapText(Context.context, this.currentItem.description, 15, 330, 400, 25);
          }
        } else {
          Context.context.drawImage(inv[item].image, xova, yova, 33, 33);
        }
        xova += 38;
        item++;
      } else {
        break;
      }
    }
    Context.context.restore();
  }
  intro_text(player) {
    this.image = document.getElementById("merchant");
    this.text = "Greetings, {0}! Push Left or Right to go through items and Up or Down to switch between buying and selling. You can buy or sell item with D and leave with F.".format(player.name);
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    stopTyping = false;
    var wasInShop = getCookie("wasInShop");
    if (wasInShop == "true" || !player.isAlive()) wrapText(Context.context, this.text, 15, 330, 400, 25);
    else typeOut(Context.context, this.text, 15, 330, 415, 25);
  }
  modify_player(player) {
    player.inCombat = false;
    player.inShop = true;
    setCookie("wasInShop", "true", 30);
    this.printInventory(20, 255, player, true);
    $('#attack').text('buy (d)');
    $('#flee').text('leave (f)');
    document.getElementById("combatmusic").pause();
    document.getElementById("combatmusic").currentTime = 0;
    document.getElementById("bgmusic").play();
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
      Context.context.clearRect(0, 0, player.canvas.width/2+10, player.canvas.height);
      Context.context.drawImage(document.getElementById("lootopened"), 65, 25, 250, 250);
      Context.context.drawImage(this.item.image, 170, 175, 30, 30);
      wrapText(Context.context, "You found something! {0}".format(this.item.description), 15, 330, 400, 25);
    }
    this.taken = true;
  }
  intro_text(player) {
    if (!this.taken) {
      this.image = document.getElementById("lootclosed");
      this.text = "That's a chest! What treasures hide in it?";
    } else {
      this.image = document.getElementById("lootopened");
      this.text = "The chest has been already looted. You will find nothing here.";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomLootRandom extends roomLoot {
  constructor(x, y) {
    if (window.endless == "on") {
      var probDagger = 0.15;
      var probSword = 0.2;
      var probPotion = 0.4;
    } else {
      if (level == 3 || level == 4) {
        var probDagger = 0.05;
        var probSword = 0.0500000000002;
        var probPotion = 0.35;
      } else {
        var probDagger = 0.05;
        var probSword = 0;
        var probPotion = 0.4;
      }
    }
    if (Math.random() < probDagger) {
      var item = new Dagger();
    }
    else if (Math.random() < probSword) {
      var item = new Sword();
    }
    else if (Math.random() < probPotion) {
      var item = new LifePotion(Math.floor(Math.random() * 4) + 5);
    }
    else {
      var item = new Gold(Math.floor(Math.random() * 3) + 2);
    }
    super(x, y, item);
  }
}

class roomLootGold extends roomLoot {
  constructor(x, y) {
    super(x, y, new Gold(10));
  }
}

class roomLootHammer extends roomLoot {
  constructor(x, y) {
    super(x, y, new Hammer());
  }
}

class roomLootPoison extends roomLoot {
  constructor(x, y) {
    super(x, y, new Poison());
  }
}

class roomEnemy extends mapTile {
  //zakladni trida pro mistnosti s neprately
  constructor(x, y, image, text, enemy) {
    super(x, y);
    this.image1 = image;
    this.text1 = text;
    this.enemy = enemy;
  }
  intro_text(player) {
    if (this.enemy.isAlive()) {
      this.image = this.image1;
      this.text = "{0} You can attack by pressing D or flee by pressing F.".format(this.text1);
    } else {
      this.image = document.getElementById("enemydead");
      if (this.enemy.name == "Boss") this.text = "The corpse of a dead monster lies on the ground. It was perhaps the last obstacle on your way to escape.";
      else this.text = "The corpse of a dead {0} lies on the ground.".format(this.enemy.name);
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
    if (this.enemy.isAlive()) {
      player.inCombat = true;
      document.getElementById("bgmusic").pause();
      document.getElementById("combatmusic").play();
    }
  }
  enemy_attack(player) {
    if (this.enemy.isAlive()) {
      var damage = Math.floor(Math.random() * (this.enemy.damagemax - this.enemy.damagemin + 1)) + this.enemy.damagemin;
      player.hp = player.hp - damage;
      if (player.isAlive()) { //vypsani informace o prubehu boje
        player.printInventory(480, 315);
        Context.context.clearRect(15, 400, 320, 320);
        wrapText(Context.context, "{0} does {1} damage. You have {2} HP remaining.".format(this.enemy.name, damage, player.hp), 15, 390, 400, 25);
      } else { //spusteni konce hry
        player.printInventory(480, 315);
        Context.context.clearRect(15, 400, 320, 320);
        wrapText(Context.context, "{0} does {1} damage. You are dead.".format(this.enemy.name, damage), 15, 390, 400, 25);
        Context.context.fillStyle = 'white';
        Context.context.globalAlpha = 0.2;
        Context.context.fillRect(0, 0, player.canvas.width, player.canvas.height);
        Context.context.globalAlpha = 1.0;
        Context.context.fillStyle = 'red';
        Context.context.font = '35pt Bryant';
        Context.context.textAlign = "center";
        Context.context.shadowOffsetX = 3;
        Context.context.shadowBlur = 5;
        Context.context.shadowColor = 'black';
        Context.context.fillText("YOU DIED", player.canvas.width/2+1, player.canvas.height/2+1);
        setCookie("seed", window.seed.toString(), 30);
        document.getElementById("combatmusic").pause();
        $('#playagain').css('display', 'inline-block');
        document.getElementById("defeatmusic").play();
      }
    }
  }
  addLoot(player) {
    player.inventory.push(this.enemy.loot);
  }
}

class roomEnemyOgre extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("ogre");
    var text = "An ogre is attacking you with a huge club!";
    super(x, y, image, text, new Ogre());
  }
}

class roomEnemySpider extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("spider");
    var text = "A giant spider is approaching!";
    super(x, y, image, text, new Spider());
  }
}

class roomEnemyGoblin extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("goblin");
    var text = "A currish goblin is trying to rob you!";
    super(x, y, image, text, new Goblin());
  }
}

class roomEnemyMinotaur extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("minotaur");
    var text = "A frightening minotaur is approaching and everything trembles!";
    super(x, y, image, text, new Minotaur());
  }
}

class roomEnemyDemon extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("demon");
    var text = "A red demon is flying in your direction.";
    super(x, y, image, text, new Demon());
  }
}

class roomEnemyOrc extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("orc");
    var text = "An orc is attacking you with a huge club!";
    super(x, y, image, text, new Orc());
  }
}

class roomEnemyDiablo extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("diablo");
    var text = "A diablo showed in front of you and is laughing at you!";
    super(x, y, image, text, new Diablo());
  }
}

class roomEnemyBoss extends roomEnemy {
  constructor(x, y) {
    var image = document.getElementById("boss");
    var text = "Suddenly, you see frightening jaws moving in your direction. The monster is growling!";
    super(x, y, image, text, new Boss());
  }
}
