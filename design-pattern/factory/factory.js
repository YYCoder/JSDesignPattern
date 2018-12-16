/**
 * 工厂模式
 *
 * 介绍：
 *   1. 工厂模式是用来创建对象的一种最常用的设计模式
 *   2. 我们不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂
 *   3. 工厂模式根据抽象程度的不同可以分为：简单工厂，工厂方法和抽象工厂
 * 
 */
const { log } = require('../../utils')
/**
 * 简单工厂模式
 *
 * 思路：如下例即为一个简单工厂模式，它根据用户输入判断应返回的对象类型，用户无需关心内部如何实现，只需传入指定参数即可得到相应对象
 *
 * 适用场景：由于每当要新增创建对象的类型时，都要修改工厂内部代码，当判断逻辑很多时会让该工厂变成一个非常庞大的函数。因此简单工厂只适用于所需创建对象类型较少，创建对象逻辑不复杂的场景
 */
function humanFactory(sex, name) {
  function Man(name) {
    this.type = 'man'
    this.name = name
  }
  function Woman(name) {
    this.type = 'woman'
    this.name = name
  }

  return new {
    'man': Man,
    'woman': Woman
  }[sex](name)
}
// const Markey = humanFactory('man', 'Markey')
// log(Markey)

/**
 * 工厂方法模式
 *
 * 核心：将创建实例推迟到子类中进行（本例即 Man、Woman）
 *
 * 思路：
 *   1. 安全模式：即无论是否添加 new 运算符，都会正常实例化对象的构造函数模式
 *   2. 将不同对象的构造函数放入构造函数的原型中，这样每当要添加新的类型时，只需修改工厂方法的原型，无需再修改工厂方法
 */
// 使用安全模式创建工厂构造函数
function UserFactory(sex, name) {
  // 若使用 new 运算符，则该条件为 true
  if (this instanceof UserFactory) return new this[sex](name)
  return new UserFactory(sex, name)
}
UserFactory.prototype.Man = function (name) {
  this.type = 'man'
  this.name = name
}
UserFactory.prototype.Woman = function (name) {
  this.type = 'woman'
  this.name = name
}
// const Markey = UserFactory('Man', 'Markey')
// log(Markey)

/**
 * 抽象工厂模式
 *
 * 思路：
 *   1. 抽象工厂模式并不直接生成实例，而是用于对类的继承（其实作用跟继承函数 extend 相同，只不过将要被继承的类放在抽象工厂的属性中）
 */
function AbstractUserFactory(subClass, superClass) {
  if (typeof AbstractUserFactory[superClass] === 'function') {
    const F = function () {}
    F.prototype = AbstractUserFactory[superClass].prototype
    subClass.prototype = new F
    subClass.prototype.constructor = subClass
    return subClass
  }
  else throw new Error(`抽象工厂不存在父类 ${superClass}`)
}
AbstractUserFactory.Man = function Man() {}
AbstractUserFactory.Man.prototype = {
  constructor: AbstractUserFactory.Man,
  sex: 'man',
  getName() {
    throw new Error('抽象方法不可调用')
  }
}
AbstractUserFactory.Woman = function Woman() {}
AbstractUserFactory.Woman.prototype = {
  constructor: AbstractUserFactory.Woman,
  sex: 'woman',
  getName() {
    throw new Error('抽象方法不可调用')
  }
}
// 定义子类，继承抽象类
function Coder(type, name) {
  this.type = type
  this.name = name
  this.getName = function () {
    log(this.name)
  }
}
const ManCoder = AbstractUserFactory(Coder, 'Man')
const Markey = new ManCoder('FE', 'Markey')
log(Markey, Markey.sex, Markey.type, Markey.name)
Markey.getName()








