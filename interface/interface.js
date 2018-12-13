class Interface {
  constructor(name, methods = []) {
    this.name = name
    this.methods = methods
  }
  checkImplements(instance) {
    const keys = Object.getOwnPropertyNames(instance)
    return this.methods.every((method) => keys.indexOf(method) !== -1)
  }
}

module.exports = Interface