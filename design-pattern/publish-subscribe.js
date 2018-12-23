/**
 * 发布-订阅模式
 *
 * 思想：
 *   1. 发布者根据事件类型保存订阅者，当触发指定类型事件时，只会通知订阅了该类型的订阅者
 *   2. 定义了一种一对多的依赖关系，让多个订阅者对象同时监听某一个主题对象。这个主题对象在自身状态变化时，会通知所有订阅者对象，使它们能够自动更新自己的状态
 *
 * 使用场景：
 *   1. DOM事件使用的模式即为发布-订阅模式，发布者为浏览器，中介为浏览器事件系统，订阅者为事件的回调函数
 */
const { log } = require('../utils')
/**
 * 1. 极简的发布订阅模式
 *
 * 特点：
 *   1. SimplePub类即为发布者，它的 events 属性为中介，订阅者即为回调函数
 *   2. 为避免事件名称与 Object 类型内置方法名一样（如 toString），导致报错问题，使用 Object.create(null) 创建对象
 */
class SimplePub {
  constructor() {
    // this.events = {}
    this.events = Object.create(null)
  }
  on(name, sub) {
    const { events } = this
    if (typeof(name) !== 'string') throw new Error(`on()第一个参数必须是字符串类型`)
    if (typeof(sub) !== 'function') throw new Error(`on()第二个参数必须是函数类型`)
    if (!events[name]) events[name] = []
    events[name].push(sub)
    return this
  }
  off(name) {
    delete this.events[name]
    return this
  }
  emit(name, data) {
    const subs = this.events[name]
    if (subs) {
      subs.forEach((sub) => sub(data))
    }
    return this
  }
}
/*const pub = new SimplePub
pub.on('off', () => log('哈哈哈'))
  .on('off', () => log('呵呵呵'))
  .on('event', (data) => log('嘻嘻嘻 ' + data))
  .on('toString', () => log('toString'))
  .off('off')
  .emit('event', 'data')
  .emit('toString')
  .emit('off')*/


/**
 * 2. 较复杂的发布订阅模式
 *
 * 特点：
 *   1. 将Pub类与中介类（Events）解耦，发布者只负责订阅、发布，通知订阅者完全由中介（Events）负责
 */
class Pub {
  constructor() {
    this.events = new Events
  }
  on(name, sub) {
    this.events.on(name, sub)
    return this
  }
  once(name, sub) {
    this.events.once(name, sub)
    return this
  }
  off(name) {
    this.events.off(name)
    return this
  }
  emit(name, data, cb) {
    this.events.emit(name, data, cb)
    return this
  }
}
class Events {
  constructor() {
    this.events = Object.create(null)
  }
  on(name, sub) {
    const { events } = this
    if (!events[name]) events[name] = []
    events[name].push(sub)
  }
  once(name, sub) {
    const { events } = this
    const wrappedSub = (data, cb) => {
      sub(data, cb)
      // 注：这里直接修改 events[name] 属性不会影响之后的调用，因为 emit 方法开始 forEach 时，循环数组的引用就已经确定了，此时对它重新赋值不会影响已经启动的循环
      events[name] = events[name].filter((fn) => fn.originCb !== sub)
    }
    // 通过该属性标识，用来在调用后清除这个订阅者
    wrappedSub.originCb = sub
    this.on(name, wrappedSub)
  }
  off(name) {
    delete this.events[name]
  }
  emit(name, data, cb) {
    const { events } = this
    if (events[name]) {
      events[name].forEach((sub) => sub(data, cb))
    }
  }
}
const pub = new Pub
pub.on('1', (data, cb) => {
    log(`hahahaha: ${data}`)
    // cb('1cb')
  })
  .once('1', (data) => {
    log(`hahaha: ${data}`)
  })
  .on('1', (data) => {
    log(`xixixi: ${data}`)
  })
  .on('2', (data, cb) => {
    log(`hahahaha: ${data}`)
    cb('1cb')
  })
  .off('2')
  .emit('1', 'data1', (res) => log(res))
  .emit('2', 'data2', (res) => log(res))
  .emit('1', 'data1:again', (res) => log(res))
  .emit('1', 'data1:again:again', (res) => log(res))


























