/**
 * 实现JS继承的几种方法
 *
 * 1. 类式继承
 * 2. 原型式继承
 * 3. 掺元类继承
 */
const { log } = require('../utils')

// 1. 类式继承
/**
 * 关键函数 extend
 * @param  {Function} subClass   [子类]
 * @param  {Function} superClass [父类]
 *
 * 思路：
 *   1. 使用一个新函数来继承父类的 prototype，防止再调用一次父类构造函数，因为构造函数中可能有大量计算任务或副作用
 *   2. 将子类原型赋值为空函数的实例，从而继承父类的原型
 *   3. 恢复子类原型的 constructor 为子类构造函数
 *   4. 通过 superClass 保存父类构造函数，让子类与父类构造函数名解耦
 */
function extend(subClass, superClass) {
  const F = function () {}
  F.prototype = superClass.prototype
  subClass.prototype = new F
  subClass.prototype.constructor = subClass
  subClass.superClass = superClass
}
// 父类
function Person(name) {
  this.name = name
}
// 子类
function Coder(name, type) {
  // 构造式继承父类的实例属性
  Coder.superClass.call(this, name)
  this.type = type
}
extend(Coder, Person)
// const coder = new Coder('Markey', 'FE')
// log(coder)


// 2. 原型式继承：使用该方式要忘却一切类的知识。无需使用构造函数（类）定义实例结构，直接创建对象即可。继承通过空构造函数实现
/**
 * 关键函数 clone
 * @param  {Object} super [父对象]
 * @return {Object}       [继承了父对象的对象]
 *
 * 思路：
 *   1. 使用一个新函数来继承父对象的实例属性及原型
 *   2. 实例本身的属性、方法还需要自行添加
 *
 * 缺陷：
 *   1. 容易修改到父对象上的同名属性，因为若子对象还没有定义该属性，会通过原型链查找到父对象，并且所有子对象都是继承自一个父对象，会影响到所有使用该属性的子对象
 */
function clone(superObj = {}) {
  const F = function () {}
  F.prototype = superObj
  return new F
}
const person = {
  name: 'Markey',
  getName() {
    log(this.name)
  }
}
const coder = clone(person)
coder.type = 'FE'
// coder.getName()
// log(coder)


/**
 * 3. 掺元类继承：
 * 
 * 思路：
 *   1. 有时实现代码复用无需继承，只需要把需要的方法添加到类中即可，类似一种类的扩充（augmentation），而没有父子关系。这种包含通用方法的类即 掺元类（mixin class），它们通常不被实例化，而只是向其他类提供自己的方法
 *   2. 要将掺元类中的方法添加到指定类中，需要实现 augment 方法
 */
// 可以把它看做实现多继承方法的一种
function augment(subClass = () => {}, mixins = () => {}, ...methods) {
  const mixinProto = mixins.prototype
  const subClassProto = subClass.prototype
  // 若指定了要mixin的方法名称，则只添加这些方法
  if (methods.length > 0) {
    methods.forEach((method) => {
      if (mixinProto[method] && !subClassProto[method]) {
        subClassProto[method] = mixinProto[method]
      }
    })
  }
  else {
    for (let method in mixinProto) {
      if (!subClassProto[method]) {
        subClassProto[method] = mixinProto[method]
      }
    }
  }
}
// 掺元类
function Mixins() {}
Mixins.prototype = {
  getAllKeys() {
    for (let k in this) {
      log(k)
    }
  }
}
// augment(Person, Mixins, 'getAllKeys')
// const augmentedPerson = new Person('Markey')
// augmentedPerson.getAllKeys()
// log(Person.prototype.getAllKeys)





















