/**
 * 简单的接口实现，通过 checkImplements 检查是否存在指定属性或方法
 */
class Interface {
  constructor(name, methods = []) {
    this.name = name
    this.methods = methods
  }
  checkImplements(instance) {
    return this.methods.every((method) => method in instance)
  }
}

module.exports = Interface