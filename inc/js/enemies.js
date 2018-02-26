class Enemy {
  constructor(name, hp, damagemin, damagemax, loot) {
    this.name = name;
    this.hp = hp;
    this.damagemin = damagemin;
    this.damagemax = damagemax;
    this.loot = loot;
  }
  isAlive() {
    return this.hp > 0;
  }
}

class Ogre extends Enemy {
  constructor() {
    super("Ogre", 30, 4, 6, new Saphir());
  }
}

class Goblin extends Enemy {
  constructor() {
    super("Goblin", 20, 3, 5, new Gold(10));
  }
}

class Spider extends Enemy {
  constructor() {
    super("Spider", 10, 1, 4, new SmallSpider());
  }
}

class Minotaur extends Enemy {
  constructor() {
    super("Minotaur", 30, 6, 12, new Key());
  }
}

class Demon extends Enemy {
  constructor() {
    super("Demon", 30, 4, 9, new Poison());
  }
}

class Orc extends Enemy {
  constructor() {
    super("Orc", 35, 5, 11, new Amulet());
  }
}

class Diablo extends Enemy {
  constructor() {
    super("Diablo", 40, 7, 12, new Skull());
  }
}

class Boss extends Enemy {
  constructor() {
    super("Boss", 50, 12, 15, new Key());
  }
}
