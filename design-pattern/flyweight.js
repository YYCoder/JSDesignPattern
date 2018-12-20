/**
 * 享元模式：该模式旨在减少应用所占用内存大小，是一种纯粹的优化模式
 *
 * 思想：本质是分离与共享，分离变与不变，并且共享不变
 *   1. 通过将对象属性划分为 内在数据 与 外在数据，让内在数据相同的对象能够复用，从而减少对象的数量
 *   2. 内在数据（Intrinsic Data）：不变、不唯一的属性（如唯一id），若使用了唯一的属性，则就没有任何共享的效果了
 *   3. 外在数据（Extrinsic Data）：可变的属性。可从类中剥离存储在外部，需要时可通过参数传入
 *
 * 使用场景：
 *   1. 需要使用大量同类的对象
 *   2. 这些对象中所保存的数据至少有一部分能提取出来作为外在数据，这些数据可作为参数传递给需要的方法
 *   3. 将外在数据提取出去之后，能够使得独一无二的对象相对较少（理想情况是只有一个）
 * 
 * 实现步骤：
 *   1. 提取外在数据：把外在数据保存在管理器中，这些数据可通过管理器将它们作为参数提供给需要的方法
 *   2. 创建该类实例化的工厂：这个工厂要能掌控所有已有的创建出来的独一无二的实例，从而能够使用已创建的实例，避免创建重复的实例。实现思路如下：
 *     1. 通过对象保存独一无二实例的内部数据组合，以这个组合作为键，当遇到与这个键相同的组合时，直接返回这个键对应的实例
 *     2. 利用对象池（pooling）技术：通过数组保存所有已创建的实例的引用，并限制对象池的长度在指定长度内，这个方法适合注重可共享实例数量而不是配置唯一性的场合
 *   3. 创建保存外在数据的管理器：管理器中保存着所有外在数据
 *     1. 创建实例由管理器完成，而不是直接实例化类
 *     2. 更优雅的方式是让返回的实例与未使用享元的实例完全一样，无需使用管理器调用方法
 */
const { log } = require('../utils')
function getDateString(timestamp) {
  return new Date(timestamp).toDateString()
}
// 原始 computer 对象：所有属性都保存在实例中，若需要多个不同属性的实例，即使实例中某些属性是相同的，则要重复实例化多个，浪费内存
class Computer {
  constructor({ cpu, ram, rom, id, owner }) {
    this.cpu = cpu
    this.ram = ram
    this.rom = rom
    this.id = id
    this.date = getDateString(Date.now())
    this.owner = owner
  }
  start() {
    log(`computer ${this.id} is
      using cpu ${this.cpu}
      ${this.useStorage('ram')}
      ${this.useStorage('rom')}
      to start up`)
  }
  useStorage(type = 'ram') {
    return {
      ram: `using ram ${this.ram}GB`,
      rom: `using rom ${this.rom}GB`
    }[type]
  }
  addRAM(gb) {
    this.ram += gb
  }
  addROM(gb) {
    this.rom += gb
  }
}
/*const computer = new Computer({
  cpu: 'i7', ram: 6, rom: 128, id: 1, owner: 'Markey'
})
computer.start()
computer.addRAM(8)*/

// 1. 使用管理器对象管理所有享元对象
// 享元对象（ConcreteFlyweight）：使用享元模式，将类进行内部、外部数据的划分
class FlyweightComputer {
  constructor({ cpu, date }) {
    // 不可变且不唯一的属性即为内部属性
    this.cpu = cpu
    this.date = date
  }
}
// 享元工厂（FlyweightFactory）
// 注：享元工厂使用了单例模式（singleton）
const flyweightFactory = (function () {
  // 用对象模式保存享元对象
  const cachedFlyweight = {}
  return function ({ cpu, date }) {
    const dataKey = `${cpu}-${date}`
    // 若已有该享元，则直接返回
    if (cachedFlyweight[dataKey]) return cachedFlyweight[dataKey]
    return (cachedFlyweight[dataKey] = new FlyweightComputer({ cpu, date }))
  }
})()
// 享元管理器对象（FlyweightManager）：以对象的唯一id作为key，创建不同实例，对象内部提供享元，并且原本的实例方法都要通过该管理器调用
// 注：享元管理器使用了单例模式（singleton）
const computerManager = (function () {
  // 实例管理对象：用于存放外部数据（Extrinsic Data）及其所属的享元对象
  const computerRecord = {}

  return {
    createComputer({ id, cpu, ram, rom, owner }) {
      const flyweight = flyweightFactory({
        cpu,
        date: getDateString(Date.now())
      })
      const newRecord = {
        id, ram, rom, owner,
        cpu: flyweight.cpu,
        date: flyweight.date
      }
      // 为了让使用享元的对象能够跟原对象使用起来完全一样，把原型直接复制过来即可
      newRecord.__proto__ = Computer.prototype
      // 保存实例并返回
      return (computerRecord[id] = newRecord)
    }
  }
})()
const c1 = computerManager.createComputer({
  id: 2,
  ram: 8,
  rom: 1024,
  cpu: 'i5',
  owner: 'Markey'
})
const c2 = computerManager.createComputer({
  id: 3,
  ram: 2,
  rom: 256,
  cpu: 'i5',
  owner: 'Michael'
})
/*c1.addRAM(5)
log(c1)
log(c2)
log(c1 instanceof Computer)*/


// 2. 使用组合模式共享享元对象，所有享元对象都是叶子对象
// 年月日组合对象：让所有 Day 对象都使用享元，它的 display 方法的值通过参数传入，从而无需实例化365个 Day 对象
class Year {
  constructor(year) {
    this.year = year
    this.numOfDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    this.months = this.numOfDays.map((days, index) => new Month(index+1, days))
    function isLeapYear(year) {
      return year > 0 && (year % 4) === 0
    }
  }
  display() {
    log(`${this.year}年：`)
    this.months.forEach(month => month.display())
  }
}
class Month {
  constructor(month, days) {
    this.month = month
    this.numOfDays = days
    this.days = []
    for (let i = 1; i <= days; i++) {
      // 若不使用享元，则传统的方法是在这里实例化每个 Day 对象，display 方法中就是调用每个实例的 display 方法
      this.days[i] = i
    }
  }
  display() {
    log(`  ${this.month}月：`)
    log(this.days.reduce(
      (prev, next) => prev + flyweightDay.display(next) + ' ',
      '    '
    ))
  }
}
class Day {
  constructor() {}
  display(day) {
    return day + '号'
  }
}
/*const flyweightDay = new Day()
const year = new Year(2017)
year.display()*/

























