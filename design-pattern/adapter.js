/**
 * 适配器模式
 *
 * 思想：用类或对象、函数进行封装，让用户能够使用原有语法调用新的API，屏蔽变化
 *
 * 使用场景：
 *   1. 当更换使用框架，API发生变化，可开发一层适配器函数来做兼容，让开发者能通过原框架语法继续使用
 *
 * 例子：
 *   1. 各种类型的转接头，如 DP-to-TypeC 转接头就是个适配器
 */
const { log } = require('../utils')
// 1. 原有API参数为数组，而新API参数是多个，通过适配器来兼容
const arg = [1, 3, 5]
function oldApi(arr) {
  log('old')
  arr.forEach(log)
}
function newApi(...args) {
  log('new')
  args.forEach(log)
}
function adapter(arr) {
  newApi.apply(this, arr)
}
// 使用适配器即可，参数类型跟原有API一致
adapter(arg)