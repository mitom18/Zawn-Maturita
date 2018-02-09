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
    super("Ogre", 30, 4, 7, new Saphir());
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
    super("Minotaur", 35, 8, 12, new Key());
  }
}
