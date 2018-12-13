const { log } = require('../utils')
const Interface = require('./interface')
const Animal = new Interface('Animal', ['eat', 'drink'])
class Cat {
  constructor(name) {
    this.name = name
  }
  eat() {
    log(`${this.name} can eat`)
  }
  drink() {
    log(`${this.name} can drink`)
  }
}

const myCat = new Cat('lulu')
log(Animal.checkImplements(myCat, [Animal]))
