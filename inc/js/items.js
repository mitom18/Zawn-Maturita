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
    super("Dagger", "A small dagger with some rust. Somewhat more dangerous than a rock.", 11, 7, 11);
    this.image = document.getElementById("dagger")
  }
}
