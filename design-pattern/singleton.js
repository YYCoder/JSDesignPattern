/**
 * 单例模式
 *
 * 思路：
 *   1. 使用闭包封装，从而实现私有成员
 *   2. 为避免污染全局，全局只能通过一个变量访问到单例对象
 */
const { log } = require('../utils')

~(function () {
  const private = 'CONSTANT'
  global.singleton = {
    getPrivate() {
      log(private)
    }
  }
})()
// singleton.getPrivate()

/**
 * 惰性实例化
 *
 * 思路：通过给全局暴露一个获取单例实例的方法来获取单例对象，通过闭包保存单例对象的引用，只实例化一次这个单例
 */
~(function () {
  let instance = null
  const getInstance = () => ({})
  global.getSingleton = () => {
    if (!instance) {
      instance = getInstance()
    }
    return instance
  }
})()
// log(getSingleton())
// log(getSingleton() === getSingleton())


/**
 * 单例分支（Branching）技术：当需要针对某些条件，返回拥有相同接口的单例对象时，可以只在生成单例时判断再返回单例对象。非常适用于屏蔽不同平台、浏览器之间的差异的场景
 *
 * 思路：
 *   1. 在闭包中保存两个单例对象，判断条件后返回正确的单例对象
 *   2. 两单例拥有完全相同的接口，从而在调用时可以无需关注内部差异
 *
 */
global.condition = true
~(function () {
  const obj1 = {
    getName() {
      log('obj1')
    }
  }
  const obj2 = {
    getName() {
      log('obj2')
    }
  }
  // 判断条件返回正确的单例对象
  global.obj = condition ? obj1 : obj2
})()
// obj.getName()

















