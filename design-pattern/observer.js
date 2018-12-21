/**
 * 观察者模式
 *
 * 思想：
 *   1. 观察者可以观察多个发布者，在发布者中保存已观察它的观察者，发布者发布消息时会通知所有保存在它内部的观察者
 *
 * 使用场景：
 *   1. DOM事件监听器就是观察者模式，观察者是回调函数，发布者是浏览器
 * 
 */
const { log } = require('../utils')
/**
 * 1. 最简单的观察者模式
 *
 * 特点：
 *   1. 同观察者多次观察一个发布者，只会成功订阅第一次
 *   2. 观察者就是回调函数
 */
class SimpleSubject {
  constructor() {
    this.observers = []
  }
  observe(fn) {
    this.observers.push(fn)
    return this
  }
  remove(fn) {
    this.observers = this.observers.filter(observer => observer !== fn)
    return this
  }
  notify(data) {
    this.observers.forEach(observer => observer(data))
    return this
  }
}
function observerFactory(num) {
  return (data) => {
    log(`observer${num}: ${data}`)
  }
}
/*const subject = new SimpleSubject()
const observer1 = observerFactory(1)
const observer2 = observerFactory(2)
const observer3 = observerFactory(3)
subject.observe(observer1)
  .observe(observer2)
  .observe(observer3)
  .remove(observer1)
  .notify('hahahaha')*/


/**
 * 2. 较复杂的观察者模式：将发布者（Subject）及观察者（Observers）分开保存
 *
 * 特点：
 *   1. 使用新类观察者列表（ObserverList）保存所有观察者（Observer），而不是直接在发布者中维护，可以进一步解耦
 *   2. 发布者（Subject）通过观察者列表（ObserverList）操作观察者
 *   3. 观察者通过 fn 属性保存回调函数，同时通过该属性进行对比（参考 delete 方法），通过 update 方法调用回调函数
 *   4. 同一个观察者不能观察多次
 */
class Subject {
  constructor() {
    this.observers = new ObserverList()
  }
  observeOnce(fn) {
    this.observers.add(fn, true)
    return this
  }
  observe(fn) {
    this.observers.add(fn)
    return this
  }
  remove(fn) {
    this.observers.delete(fn)
    return this
  }
  notify(data) {
    const count = this.observers.length
    for (let i = 0; i < count; i++) {
      log(i)
      this.observers.get(i).update(data)
    }
    return this
  }
}
class ObserverList {
  constructor() {
    this.observers = []
  }
  add(fn, isOnce = false) {
    if (typeof(fn) !== 'function') throw new Error('观察者必须是 Function 类型')
    // 判断是否已存在该观察者，若存在则报错
    if (this.hasExistObserver(fn)) throw new Error(`已存在观察者 ${fn}`)
    // 若是只观察一次，则在回调中自动删除该回调
    const cb = isOnce ? (data) => {
      fn(data)
      this.delete(cb)
    } : fn
    this.observers.push(new Observer(cb, { isOnce, originCb: fn }))

    return this
  }
  delete(fn) {
    this.observers = this.observers.filter(obs => obs.fn !== fn)
  }
  get length() {
    return this.observers.length
  }
  get(num) {
    return this.observers[num]
  }
  hasExistObserver(fn) {
    return this.observers.some(obs => obs.fn === fn || (obs.isOnce && obs.originCb === fn))
  }
}
// 由于添加 once 的观察者时会改写回调函数，要判断是否已添加过观察者只能在观察者实例上把原函数带上
class Observer {
  constructor(fn = () => {}, { isOnce = false, originCb }) {
    this.fn = fn
    this.isOnce = isOnce
    this.originCb = originCb
  }
  update(data) {
    return this.fn(data)
  }
}
const subject = new Subject
const obs1 = observerFactory(1)
const obs2 = observerFactory(2)
const obs3 = observerFactory(3)
subject.observe(obs1)
  .observe(obs2)
  .observeOnce(obs3)
  // .observe(obs3)
  .remove(obs2)
  .notify('hehehehe')
  .notify('xixixi')










