class Item {
  constructor(name, description, value) {
    this.name = name;
    this.description = description;
    this.value = value;
  }
  itemDescription() {
    return "{0}{1} Value: {2}".format(this.name, this.description, this.value);
  }
}

class Gold extends Item {
  constructor(amt) {
    super("Coin", "A round coin with {0} stamped on the front.".format(amt), amt);
    this.image = document.getElementById("coin");
  }
}

class LifePotion extends Item {
  constructor(amt) {
    super("Healing potion", "A potion that restores {0} HP.".format(amt), amt);
    this.image = document.getElementById("lifepotion");
  }
}

class Key extends Item {
  constructor() {
    super("Key", "A key with skeleton head.", 100);
    this.image = document.getElementById("key");
  }
}

class SmallSpider extends Item {
  constructor() {
    super("Small spider", "A small spider, child of a deadly creature.", 50);
    this.image = document.getElementById("smallspider");
  }
}

class Saphir extends Item {
  constructor() {
    super("Saphir amulet", "An amulet made from saphir.", 60);
    this.image = document.getElementById("saphir");
  }
}

class Hammer extends Item {
  constructor() {
    super("Hammer", "A hammer which looks like the Thor's one. Should be enough to break the wall.", 70);
    this.image = document.getElementById("hammer");
  }
}

class Weapon extends Item {
  constructor(name, description, value, damagemin, damagemax) {
    super(name, description, value);
    this.damagemin = damagemin;
    this.damagemax = damagemax;
  }
}

class Rock extends Weapon {
  constructor() {
    super("Rock", "A fist-sized rock, good for basic defence.", 0, 2, 5);
    this.image = document.getElementById("rock")
  }
}

class Dagger extends Weapon {
  constructor() {
    super("Dagger", "A small dagger with some rust. Somewhat more dangerous than a rock.", 25, 6, 9);
    this.image = document.getElementById("dagger")
  }
}

class Sword extends Weapon {
  constructor() {
    super("Sword", "A sharp looking sword. This weapon is good for some knight things.", 50, 10, 13);
    this.image = document.getElementById("sword")
  }
}
