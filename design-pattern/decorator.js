/**
 * 装饰者模式
 *
 * 思想：透明地把对象包装到另一个拥有相同接口的对象中，从而可以给方法添加行为，并把调用传递给原对象
 *
 * 使用场景：
 *   1. 要为类添加特性或功能，并且从该类派生子类并不实际的话，可以使用装饰者模式。派生子类不切实际的原因往往是因为要添加的特性的数量和组合需要使用大量子类
 *   2. 为对象添加特性又不想改变使用该对象的代码，可以使用装饰者模式
 */
const { log } = require('../utils')

/**
 * 1. 以电脑为例。电脑可以加装显示器、键盘、鼠标等等外设，同时价格也会增加
 *
 * 思路：
 *   1. 内部引用：每个装饰者构造函数中传入具体被装饰对象（ConcreteComponent），将该对象用装饰者（Decorator）进行装饰后在内部保存其引用，之后具体装饰者（ConcreteDecorator）装饰同名方法时可在内部调用具体被装饰对象（ConcreteComponent）的方法
 *   2. 增量装饰：每次装饰过后要使用装饰过的对象继续装饰，不要重新使用原对象，这样已装饰的部分就失效了（参考最后调用）
 *   3. 通道方法：若有装饰者添加了新的方法，则当该装饰者被新装饰者装饰后它添加的方法就被覆盖了，因此要在装饰者类中添加通道方法
 *   4. super()：具体装饰者（ConcreteDecorator）的构造函数中要通过调用装饰者（Decorator）来继承装饰者类的实例属性
 */
// 电脑基类（ConcreteComponent）
class Computer {
  constructor(price) {
    this.price = price
  }
  getPrice() {
    return this.price
  }
}
// 装饰者类（Decorator）
class ComputerDecorator {
  constructor(computer) {
    this.computer = computer
    // 添加通道方法：解决具体装饰者（ConcreteDecorator）添加了新方法被其他具体装饰者（ConcreteDecorator）顶掉的问题
    if (new.target !== ComputerDecorator) {
      const proto = computer.__proto__
      // 注：由于ES6 class语法中声明的方法及属性是在原型对象上，并且是不可枚举的，不能用for...in遍历
      Object.getOwnPropertyNames(proto)
        .filter(key => typeof proto[key] === 'function' && !this[key])
        .forEach(method => this[method] = proto[method])
    }
  }
  getPrice() {
    return this.computer.getPrice()
  }
}
// 显示器装饰者（ConcreteDecorator）
class ComputerWithScreen extends ComputerDecorator {
  constructor(computer, price) {
    super(computer)
    this.price = price
  }
  display() {
    log('I can display')
  }
  getPrice() {
    return this.computer.getPrice() + this.price
  }
}
// 鼠标装饰者（ConcreteDecorator）
class ComputerWithMouse extends ComputerDecorator {
  constructor(computer, price) {
    super(computer)
    this.price = price
  }
  click() {
    log('I can click')
  }
  getPrice() {
    return this.computer.getPrice() + this.price
  }
}
// let computer = new Computer(5000)
// computer = new ComputerDecorator(computer)
// log(computer.getPrice())
// computer = new ComputerWithScreen(computer, 2000)
// log(computer.getPrice())
// computer.display()
// computer = new ComputerWithMouse(computer, 500)
// log(computer.getPrice())
// computer.click()
// computer.display()

/**
 * 2. 函数装饰：即高阶函数应用，传入要调用的函数，返回一个函数包装要调用的函数，在返回的函数中进行装饰
 */
// 统计函数调用时间
function callTimeDecorator(cb) {
  return function (...args) {
    let start = Date.now()
    const res = cb(...args)
    log(`调用时间为 ${Date.now() - start}`)
    return res
  }
}
function count(num) {
  const start = Date.now()
  while (true) {
    if (Math.floor((Date.now() - start) / 1000) >= num) return
  }
}
const countWithCallTime = callTimeDecorator(count)
log(countWithCallTime(2))























