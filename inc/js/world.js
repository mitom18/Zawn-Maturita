//startovaci souradnice hrace a urceni poctu levelu jako globalni promenne
var startingPositionX;
var startingPositionY;
var level = 1;
var levelMax = 4;

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

function generateWorld(width, height, uroven) {
  //funkce vygeneruje mapu sveta na zaklade podminek, ale nahodne podle seedu (mapu lze reprodukovat)
  if (!seed) {
    var cookietoseed = getCookie("seed");
    if (cookietoseed != "") {
      window.seed = cookietoseed;
    } else {
      var d = new Date();
      window.seed = d.getTime();
    }
  }

  console.log(seed);
  console.log(getCookie("seed"));
  $('#seedshow').text("world seed: " + seed.toString());
  Math.seedrandom(seed.toString());


  //napln celou mapku prazdnymi mistnostmi
  var svet = new Array();
  for (var i = 0; i < height; i++) {
    var rada = new Array();
    for (var j = 0; j < width; j++) {
      rada.push(2);
    }
    svet.push(rada);
  }

  //urceni startu a cile a cesty do cile, kde nebudou zdi
  if (Math.random() < 0.5) {
    svet[0][0] = 0;
    startingPositionX = 0;
    startingPositionY = 0;
    svet[height-1][width-1] = 1;

    var x = 0;
    var y = 0;
    for (var i = 0; i < width-1; i++) {
      if (Math.random() < 0.5) {
        if (x < width-1) x++;
        if (svet[y][x] === 2) svet[y][x] = 10;
      } else {
        if (y < height-1) y++;
        if (svet[y][x] === 2) svet[y][x] = 10;
        i--;
      }

      if (x == width-1 && y != height-1) {
        while (y != height-1) {
          y++;
          if (svet[y][x] === 2) svet[y][x] = 10;
          i--;
        }
      }
      else if (x != width-1 && y == height-1) {
        while (x != width-1) {
          x++;
          if (svet[y][x] === 2) svet[y][x] = 10;
          i--;
        }
      }
    }
  } else {
    svet[height-1][0] = 0;
    startingPositionX = 0;
    startingPositionY = height-1;
    svet[0][width-1] = 1;

    var x = 0;
    var y = height - 1;
    for (var i = 0; i < width-1; i++) {
      if (Math.random() < 0.5) {
        if (x < width-1) x++;
        if (svet[y][x] === 2) svet[y][x] = 10;
      } else {
        if (y > 0) y--;
        if (svet[y][x] === 2) svet[y][x] = 10;
        i--;
      }

      if (x == width-1 && y != 0) {
        while (y != 0) {
          y--;
          if (svet[y][x] === 2) svet[y][x] = 10;
          i--;
        }
      }
      else if (x != width-1 && y == 0) {
        while (x != width-1) {
          x++;
          if (svet[y][x] === 2) svet[y][x] = 10;
          i--;
        }
      }
    }
  }

  //urceni zdi
  var maze = [0, 0, svet[0].length, svet.length];
  var stack = [maze];
  var counter1 = 0;
  while (stack.length > 0) {
    var area = stack.shift();
    if (area[2] > 1 && area[3] > 1) {
      if (area[2] > area[3]) {
        var xova = Math.floor(Math.random() * (area[2] - 1 - area[0] + 1)) + area[0];
        for (var i = area[1]; i < area[3]; i++) {
          if (Math.random() < 0.9999) {
            if (i >= 0 && xova < svet[0].length) if (svet[i][xova] == 2) svet[i][xova] = 6;
          } else {
            if (i >= 0 && xova < svet[0].length) if (svet[i][xova] == 2) svet[i][xova] = 10;
          }
        }
        var newArea1 = [area[0], area[1], xova-area[0], area[3]];
        var newArea2 = [xova+1, area[1], area[2]-xova+1, area[3]];
        if (newArea1[2] > 2) stack.push(newArea1);
        if (newArea2[2] > 2) stack.push(newArea2);
      } else {
        var yova = Math.floor(Math.random() * (area[3] - 1 - area[1] + 1)) + area[1];
        for (var i = area[0]; i < area[2]; i++) {
          if (Math.random() < 0.9999) {
            if (i >= 0 && yova < svet.length) if (svet[yova][i] == 2) svet[yova][i] = 6;
          } else {
            if (i >= 0 && yova < svet.length) if (svet[yova][i] == 2) svet[yova][i] = 10;
          }
        }
        var newArea1 = [area[0], area[1], area[2], yova-area[1]];
        var newArea2 = [area[0], yova+1, area[2], area[3]-yova+1];
        if (newArea1[3] > 2) stack.push(newArea1);
        if (newArea2[3] > 2) stack.push(newArea2);
      }
    }
    if (counter1 > 1000) {
      break;
    }
    counter1++;
  }

  //z nedosazitelnych policek se udelaji zdi
  var repareWorld = checkWorld(svet);
  if (repareWorld[0]) {
    repareWorld[1].forEach(function(item, index) {
      var x = item[0];
      var y = item[1];
      svet[y][x] = 6;
    })
  }

  //urceni dalsich mistnosti podle urovni
  if (uroven == 1) {
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 9;
        break;
      }
    }
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 12;
        break;
      }
    }
    for (var i = 0; i < 3; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 4;
          break;
        }
      }
    }
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 3;
        break;
      }
    }

  }
  else if (uroven == 2) {
    for (var i = 0; i < 2; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 5;
          break;
        }
      }
    }
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 12;
        break;
      }
    }
    for (var i = 0; i < 4; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 4;
          break;
        }
      }
    }
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 8;
        break;
      }
    }
  }
  else if (uroven == 3) {
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 7;
        break;
      }
    }
    for (var i = 0; i < 4; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 4;
          break;
        }
      }
    }
    for (var i = 0; i < 3; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 12;
          break;
        }
      }
    }
  }
  else if (uroven == 4) {
    while (true) {
      var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      if (svet[randomY][randomX] == 2) {
        svet[randomY][randomX] = 11;
        break;
      }
    }
    for (var i = 0; i < 3; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 12;
          break;
        }
      }
    }
    for (var i = 0; i < 2; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 8;
          break;
        }
      }
    }
    for (var i = 0; i < 6; i++) {
      while (true) {
        var randomX = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
        if (svet[randomY][randomX] == 2) {
          svet[randomY][randomX] = 4;
          break;
        }
      }
    }
  }

  console.log(svet);
  return svet;
}

function describeWorld(svet) {
  //funkce doplni do sveta instance trid mistnosti na zaklade cisel v puvodni mapce
  var svet = svet;
  var newSvet = new Array();
  svet.forEach(function(item, index) {
    var newRada = new Array();
    item.forEach(function(item2, index2) {
      if (item2 === 0) {
        var mistnost = new roomStart(index2, index);
      }
      else if (item2 === 1) {
        var mistnost = new roomFinal(index2, index);
      }
      else if (item2 === 2 || item2 === 10) {
        var mistnost = new emptyPath(index2, index);
      }
      else if (item2 === 3) {
        var mistnost = new roomLootGold(index2, index);
      }
      else if (item2 === 4) {
        var mistnost = new roomLootRandom(index2, index);
      }
      else if (item2 === 5) {
        var mistnost = new roomEnemyOgre(index2, index);
      }
      else if (item2 === 6) {
        var mistnost = new Wall(index2, index);
      }
      else if (item2 === 7) {
        var mistnost = new roomLootHammer(index2, index);
      }
      else if (item2 === 8) {
        var mistnost = new roomMerchant(index2, index);
      }
      else if (item2 === 9) {
        var mistnost = new roomEnemySpider(index2, index);
      }
      else if (item2 === 11) {
        var mistnost = new roomEnemyMinotaur(index2, index);
      }
      else if (item2 === 12) {
        var mistnost = new roomEnemyGoblin(index2, index);
      }
      newRada.push(mistnost);
    });
    newSvet.push(newRada);
  });
  return newSvet;
}

function drawMap(x, y, playerX, playerY, world) {
  //funkce vykresluje grafickou mapku na zaklade cisel v puvodni mapce
  Context.context.save();
  Context.context.clearRect(x, y-30, world[0].length*15, world.length*15+30);
  Context.context.fillText("Map:", x, y-15);
  var Xpuv = x;
  var Ypuv = y;
  var xova = x;
  var yova = y;
  world.forEach(function(item, index) {
    item.forEach(function(item2, index2) {
      if (Math.abs(playerX - index2) <= 3 && Math.abs(playerY - index) <= 3) {
        if (item2 === 0) {
            Context.context.fillStyle = 'pink';
        }
        else if (item2 === 1) {
            Context.context.fillStyle = 'yellow';
        }
        else if (item2 === 2 || item2 === 10 || item2 === 3 || item2 === 4) {
            Context.context.fillStyle = 'grey';
        }
        else if (item2 === 5 || item2 === 9 || item2 === 11 || item2 == 12) {
            Context.context.fillStyle = 'red';
        }
        else if (item2 === 6) {
            Context.context.fillStyle = 'black';
        }
        else if (item2 === 7) {
            Context.context.fillStyle = 'orange';
        }
        else if (item2 === 8) {
            Context.context.fillStyle = 'green';
        }
      } else {
        Context.context.fillStyle = 'black';
      }
      Context.context.fillRect(xova, yova, 15, 15);
      xova += 15;
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
  constructor(x, y, image, text) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.text = text;
  }
  intro_text(player) {
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
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
    for (var item of player.inventory) {
      if (item instanceof checkedItem) {
        counter++;
        if (counter == amount) {
          inInventory = true;
          break;
        }
      }
    }
    return inInventory;
  }

  intro_text(player, intro, postup) {
    if (intro == undefined || postup == undefined) {
      return null;
    } else {
      if (intro == 1) {
        this.image = document.getElementById("finalgnome");
        if (postup) {
          this.text = "What a cute spider! Thank you!";
        } else {
          this.text = "Stop! Bring me a small spider and I will let you get through. If you have it, press D.";
        }
      }
      else if (intro == 2) {
        this.image = document.getElementById("finalguard");
        if (postup) {
          this.text = "Nice work, you can go on now.";
        } else {
          this.text = "Stop! I won't let you continue until you give me 2 saphir amulets. If you have them, press D.";
        }
      }
      else if (intro == 3) {
        this.image = document.getElementById("wall");
        if (postup) {
          this.text = "One punch and the wall breaks apart. You can continue.";
        } else {
          this.text = "This wall seems weak. With a good tool you should be able to break through. If you have something to use, press D.";
        }
      }
      else if (intro == 4) {
        this.image = document.getElementById("exit");
        if (postup) {
          this.text = "The key matches and you unlock the door! You are free, you made it!";
        } else {
          this.text = "The door is locked. You have to find a key to go on. If you have it, press D to proceed.";
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
    this.intro_text(player, level, false);
  }
  toNewLevel(player) {
    if (level == levelMax) {
      var checkedItem = Key;
      var amount = 1;
      var intro = 4;
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
    if (this.check_item(player, checkedItem, amount)) {
      this.intro_text(player, intro, true);
      if (level == levelMax) {
        player.victory = true;
        Context.context.clearRect(15, 305, 400, 320);
        this.intro_text(player, intro, true);
        Context.context.fillStyle = 'white';
        Context.context.globalAlpha = 0.2;
        Context.context.fillRect(0, 0, player.platno.width, player.platno.height);
        Context.context.globalAlpha = 1.0;
        Context.context.fillStyle = 'gold';
        Context.context.font = '35pt Bryant';
        Context.context.textAlign = "center";
        Context.context.shadowOffsetX = 3;
        Context.context.shadowBlur = 5;
        Context.context.shadowColor = 'black';
        Context.context.fillText("VICTORY", player.platno.width/2+1, player.platno.height/2+1);
        document.cookie = "seed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.getElementById("bgmusic").pause();
        $('#playagain').css('display', 'inline-block');
        document.getElementById("victorymusic").play();
      } else {
        level += 1;
        var deleteQuestItems = checkedItem;

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

        Context.context.clearRect(480, 50, _world[0].length*15, _world.length*15+30); //vycisteni mapy
        _world = generateWorld(newLevelWidth, newLevelHeight, level); //generace noveho levelu
        do {
          player.inventory.forEach(function(item, index) {
            if (item instanceof deleteQuestItems) {
              player.inventory.splice(index, 1);
            }
          });
          amount--;
        }
        while (amount > 0);
        player.locationX = startingPositionX;
        player.locationY = startingPositionY;
        window.described_world = describeWorld(_world); //inicializace noveho levelu
        var novaAktualniMistnost = stepInTile(startingPositionX, startingPositionY, described_world);
        drawMap(480, 80, player.locationX, player.locationY, _world);
        player.printInventory(480, 315);
        player.aktualniMistnost = novaAktualniMistnost;
        Context.context.clearRect(0, 0, player.platno.width/2+10, player.platno.height);
        novaAktualniMistnost.intro_text(player);
        novaAktualniMistnost.modify_player(player);
      }
    } else {
      Context.context.clearRect(0, 0, player.platno.width/2+10, player.platno.height);
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
    if (level == 2) {
      this.inventory = [new Dagger(), new LifePotion(5), new Dagger(), new LifePotion(5)];
    }
    else if (level == 4) {
      this.inventory = [new Sword(), new LifePotion(7), new Dagger(), new LifePotion(7), new Sword()];
    }
    else {
      this.inventory = [new Dagger(), new Sword()];
    }
    this.invIndex = 0;
    this.aktualniItem = this.inventory[this.invIndex];
  }
  choosingItem(smer) {
    //prochazeni nabidky obchodnika
    if (smer) {
      this.invIndex++;
      if (this.invIndex > this.inventory.length-1) this.invIndex = 0;
    } else {
      this.invIndex--;
      if (this.invIndex < 0) this.invIndex = this.inventory.length-1;
    }
    this.aktualniItem = this.inventory[this.invIndex];
  }
  buyItem(player) {
    //hrac kupuje item
    var counter = 0;
    for (var item of this.inventory) {
      if (item.constructor.name === this.aktualniItem.constructor.name) counter++;
    }
    if (counter > 1) {
      if (player.money >= this.aktualniItem.value) {
        player.money -= this.aktualniItem.value;
        player.inventory.push(this.aktualniItem);
        this.inventory.splice(this.invIndex, 1);
        this.invIndex = 0;
        this.text = "Enjoy your new {0}, my friend.".format(this.aktualniItem.name);
        this.aktualniItem = this.inventory[this.invIndex];
        this.printInventory(20, 255);
      } else {
        this.text = "You have not enough money to buy this item.";
      }
    } else {
      this.text = "Sorry, my friend. I won't sell you this item, but I'll buy it from you if you have one.";
    }
    Context.context.clearRect(15, 305, 400, 320);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  sellItem(player) {
    //hrac prodava item
    this.haveItem = false;
    var i = 0;
    for (var item of player.inventory) {
      if (item.constructor.name === this.aktualniItem.constructor.name) {
        this.haveItem = true;
        break;
      }
      i++;
    };
    if (this.haveItem) {
      player.money += this.aktualniItem.value;
      this.inventory.push(player.inventory[i]);
      player.inventory.splice(i, 1);
      this.text = "Thank you for this {0}, my friend.".format(this.aktualniItem.name);
      this.printInventory(20, 255);
    } else {
      this.text = "This item is not in your inventory. You can't sell it.";
    }
    Context.context.clearRect(15, 305, 400, 320);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  printInventory(x, y) {
    //funkce kresli inventar obchodnika
    Context.context.save();
    Context.context.clearRect(x, y, 330, 50);
    var xova = x;
    var yova = y;

    if (this.tradeInicialization) {
      this.canTrade = true;
      this.tradeInicialization = false;
    }

    //kresli inventar obchodnika
    var polozka = 0;
    function compare(a, b) {
      //seradi itemy podle atributu value
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    };
    var inv = this.inventory.sort(compare);
    //vykresli inventar do 1 rady po 10 itemech, stejne itemy se nestackuji
    for (var j = 0; j < 10; j++) {
      if (inv[polozka]) {
        if (this.aktualniItem == inv[polozka]) {
          Context.context.drawImage(inv[polozka].image, xova, yova, 40, 40);
          Context.context.save();
          Context.context.font = '10pt Bryant';
          Context.context.clearRect(xova, yova+27, 30, 15);
          Context.context.drawImage(document.getElementById("coin"), xova, yova+30, 10, 10);
          Context.context.fillText(this.aktualniItem.value, xova+12, yova+40);
          Context.context.restore();
          Context.context.clearRect(15, 305, 400, 320);
          wrapText(Context.context, this.aktualniItem.description, 15, 330, 400, 25);
        } else {
          Context.context.drawImage(inv[polozka].image, xova, yova, 33, 33);
        }
        xova += 38;
        polozka++;
      } else {
        break;
      }
    }
    Context.context.restore();
  }
  intro_text(player) {
    this.image = document.getElementById("merchant");
    this.text = "Greetings, {0}! Are you interested in trading with me? Push Left or Right Arrow to see what I'm offering. You can buy item with D, sell with F and leave with ESC.".format(player.name);
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
  modify_player(player) {
    player.inCombat = false;
    player.inShop = true;
    this.canTrade = false;
    this.tradeInicialization = true;
    $('#escape').css('display', 'inline');
    $('#attack').text('buy (d)');
    $('#flee').text('sell (f)');
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
      Context.context.clearRect(0, 0, player.platno.width/2+10, player.platno.height);
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
    if (level == 3 || level == 4) {
      var propDagger = 0.05;
      var propSword = 0.06;
      var propPotion = 0.35;
    } else {
      var propDagger = 0.05;
      var propSword = 0;
      var propPotion = 0.35;
    }

    if (Math.random() < propDagger) {
      var item = new Dagger();
    }
    else if (Math.random() < propSword) {
      var item = new Sword();
    }
    else if (Math.random() < propPotion) {
      var item = new LifePotion(5);
    }
    else {
      var item = new Gold(2);
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

class roomEnemy extends mapTile {
  //zakladni trida pro mistnosti s neprately
  constructor(x, y, enemy) {
    super(x, y);
    this.enemy = enemy;
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
      if (player.isAlive()) {
        player.printInventory(480, 315);
        Context.context.clearRect(15, 400, 320, 320);
        wrapText(Context.context, "{0} does {1} damage. You have {2} HP remaining.".format(this.enemy.name, damage, player.hp), 15, 390, 400, 25);
      } else {
        player.printInventory(480, 315);
        Context.context.clearRect(15, 400, 320, 320);
        wrapText(Context.context, "{0} does {1} damage. You are dead.".format(this.enemy.name, damage), 15, 390, 400, 25);
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
    super(x, y, new Ogre());
  }
  intro_text(player) {
    if (this.enemy.isAlive()) {
      this.image = document.getElementById("ogre");
      this.text = "An ogre is attacking you with a huge club! You can attack him by pressing D or flee by pressing F.";
    } else {
      this.image = document.getElementById("enemydead");
      this.text = "The corpse of a dead ogre lies on the ground.";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomEnemySpider extends roomEnemy {
  constructor(x, y) {
    super(x, y, new Spider());
  }
  intro_text(player) {
    if (this.enemy.isAlive()) {
      this.image = document.getElementById("spider");
      this.text = "A giant spider is approaching! You can attack it by pressing D or flee by pressing F.";
    } else {
      this.image = document.getElementById("enemydead");
      this.text = "The corpse of a dead spider lies on the ground.";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomEnemyGoblin extends roomEnemy {
  constructor(x, y) {
    super(x, y, new Goblin());
  }
  intro_text(player) {
    if (this.enemy.isAlive()) {
      this.image = document.getElementById("goblin");
      this.text = "A currish goblin is trying to rob you! You can attack it by pressing D or flee by pressing F.";
    } else {
      this.image = document.getElementById("enemydead");
      this.text = "The corpse of a dead goblin lies on the ground.";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}

class roomEnemyMinotaur extends roomEnemy {
  constructor(x, y) {
    super(x, y, new Minotaur());
  }
  intro_text(player) {
    if (this.enemy.isAlive()) {
      this.image = document.getElementById("minotaur");
      this.text = "A frightening minotaur is approaching and everything trembles! You can attack it by pressing D or flee by pressing F.";
    } else {
      this.image = document.getElementById("enemydead");
      this.text = "The corpse of a dead minotaur lies on the ground.";
    }
    Context.context.drawImage(this.image, 65, 25, 250, 250);
    wrapText(Context.context, this.text, 15, 330, 400, 25);
  }
}
