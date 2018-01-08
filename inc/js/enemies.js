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
    super("Ogre", 30, 4, 7, new Key());
  }
}
