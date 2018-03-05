class Item {
  constructor(name, description, value) {
    this.name = name;
    this.description = description;
    this.value = value;
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
    super("Key", "A key with skeleton head.", 0);
    if (level == levelMax) this.image = document.getElementById("keyFin");
    else this.image = document.getElementById("key");
  }
}

class SmallSpider extends Item {
  constructor() {
    super("Small spider", "A small spider, child of a deadly creature.", 0);
    this.image = document.getElementById("smallspider");
  }
}

class Saphir extends Item {
  constructor() {
    super("Saphir amulet", "An amulet made from saphir.", 0);
    this.image = document.getElementById("saphir");
  }
}

class Amulet extends Item {
  constructor() {
    super("Golden amulet", "An amulet made from gold.", 10);
    this.image = document.getElementById("amulet");
  }
}

class Hammer extends Item {
  constructor() {
    super("Hammer", "A hammer which looks like the Thor's one. Should be enough to break the wall.", 0);
    this.image = document.getElementById("hammer");
  }
}

class Poison extends Item {
  constructor() {
    super("Poison bottle", "A bottle which contains poison retrieved from dead demon.", 15);
    this.image = document.getElementById("poison");
  }
}

class Skull extends Item {
  constructor() {
    super("Skull", "A skull wrested from the corpse of diablo.", 0);
    this.image = document.getElementById("skull");
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
