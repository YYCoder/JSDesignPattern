/**
 * 代理模式
 *
 * 思想：
 *   1. 代理是一个对象，用来控制对另一个对象的访问
 *   2. 它与另一个对象实现了同样的接口，并会把方法调用传递给另一个对象
 *
 * 使用场景：
 *   1. 虚拟代理：当类实例化开销很大时，可以通过代理在类真正调用方法时才去实例化，从而实现懒实例化
 *   2. 安全代理：控制对象的访问权限
 *   3. 远程代理：控制不同空间下其他对象的访问
 */
const { log } = require('../utils')
// 1. 最简单的代理
class BookProxy {
  constructor({ name, phases }) {
    this.book = new Book({ name, phases })
  }
  findPhases(number) {
    log('我是代理方法')
    return this.book.findPhases(number)
  }
}
class Book {
  constructor({ name, phases }) {
    this.name = name
    this.phases = phases
  }
  findPhases(number) {
    return this.phases.filter(phase => phase === number)
  }
}
const data = {
  name: 'Markey-Book',
  phases: [1, 2, 3, 4]
}
/*const bookProxy = new BookProxy(data)
log(bookProxy.findPhases(3))*/


// 2. 虚拟代理：实现懒实例化对象
class VirtualProxy {
  constructor({ name, phases }) {
    this.book = null
    this.data = { name, phases }
  }
  findPhases(number) {
    log('我是虚拟代理方法，此时才会实例化对象')
    if (!this.book) this.book = new Book(this.data)
    return this.book.findPhases(number)
  }
}
/*const vp = new VirtualProxy(data)
log(vp.book)
log(vp.findPhases(2))
log(vp.book)*/


/**
 * 3. ES6 Proxy的使用场景
 */
// 1. 缓存调用结果：通过 Proxy 的 apply 属性拦截方法的调用，使用对象做结果缓存
// 注：其实使用ES5函数也能实现，可以在函数本身添加缓存属性保存结果
function fibo(n) {
  if (n <= 2) return 1
  else {
    return fibo(n - 1) + fibo(n - 2)
  }
}
const getFiboProxy = (fn, cache = {}) => {
  return new Proxy(fn, {
    apply(target, context, args) {
      const argKey = args.join('-')
      if (cache[argKey]) return cache[argKey]
      return (cache[argKey] = fn(...args))
    }
  })
}
const proxyFibo = getFiboProxy(fibo)
// log(proxyFibo(40))
// log(proxyFibo(40))

// 2. 实现私有属性
function privateProps(
  obj = {},
  checkPrivate = (prop) => typeof(prop) === 'string' && prop.indexOf('_') === 0
) {
  return new Proxy(obj, {
    get(obj, prop) {
      if (!checkPrivate(prop)) {
        let value = Reflect.get(obj, prop)
        // 注意：若值是函数类型的话，this 会被绑定为 Proxy，因此需要重新绑定 this。该问题在 chrome 中存在，node v8.10中不存在
        if (typeof value === 'function') {
          value = value.bind(obj)
        }
        return value
      }
    },
    set(obj, prop, value) {
      if (checkPrivate(prop)) throw new Error(`Private props can't be changed`)
      return Reflect.set(obj, prop, value)
    },
    has(obj, prop) {
      return checkPrivate(prop) ? false : Reflect.has(obj, prop)
    },
    ownKeys(obj) {
      return Reflect.ownKeys(obj).filter(prop => !checkPrivate(prop))
    },
    getOwnPropertyDescriptor(obj, prop) {
      return checkPrivate(prop) ? undefined : Reflect.getOwnPropertyDescriptor(obj, prop)
    }

  })
}
const obj = {
  _private: 'private',
  name: 'Markey',
  fun() {
    log('fun !')
    log(this instanceof Proxy)
  }
}
/*const privateObj = privateProps(obj)
log(privateObj._private, obj._private)
privateObj.fun()*/













