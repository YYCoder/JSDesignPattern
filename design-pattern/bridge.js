/**
 * 桥接模式
 *
 * 思想：为了让两个模块之间解耦，而作为它们之间的桥梁，从而让两模块相互独立，即使一个模块更改也无需修改另一个模块
 *
 * 常见场景：
 *   1. 高阶函数封装
 *   2. 对某些有多处使用的功能的调用封装
 */
const { log } = require('../utils')
// 1. forEach等高阶函数：让迭代执行的逻辑可以抽离出来，跟迭代方法相互独立，更利于维护
function forEach(arr = [], fn = () => {}) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr)
  }
}
// forEach([1, 3, 5], (ele) => log(ele))

// 2. ajax方法的封装：让重复执行的逻辑单独提取出来
// 封装前，业务逻辑与ajax方法都在一个函数中，两者强耦合在一起
function sendInfo(id) {
  // 一些业务逻辑...
  ajax(id, 'url', (res) => {
    log('succeed')
  })
}
// 封装后，将ajax方法单独提取出来作为一个简单的方法，只接受参数并提交ajax请求
function sendInfo(id) {
  // 一些业务逻辑
  sendInfoBridge(id, (res) => log('succeed'))
}
function sendInfoBridge(id, cb = () => {}) {
  ajax(id, 'url', cb)
}