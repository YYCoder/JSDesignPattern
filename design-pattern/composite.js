/**
 * 组合模式：擅长对于大批对象进行操作，专为组织这类对象并把操作从一个层次想下一层次传递而设计
 *
 * 思想：
 *   1. 将对象组合成树形结构以表示“部分-整体”的层次结构，使部分和整体的使用具有一致性，提高了代码模块化程度，便于代码重构
 *   2. 两种角色：
 *     1. 子对象：组成组合对象的最基本对象
 *     2. 组合对象：由子对象组合起来的复杂对象
 *
 * 使用场景：存在一批组织成某种层次体系的对象，希望这批对象或其中一部分对象执行同一个操作
 *   1. 动态生成内容的表单验证、提交、缓存等操作（其实对动态生成的内容若存在批量操作，都可以用组合模式）
 */
const { log } = require('../utils')
// 1. DOM操作：HTML 文档的 DOM 结构就是天生的树形结构，非常适用适用组合模式。例如 JQuery 中的 addClass 方法就是一种基于组合模式的方法
/**
 * 思路：无论是节点组合还是节点，都可以调用该方法，在方法内部进行判断
 */
function addClass(eles, className) {
  if (eles instanceof NodeList) {
    for (let i = 0, length = eles.length; i < length; i++) {
      eles[i].nodeType === 1 && (eles[i].className += (' ' + className + ' '))
    }
  }
  else if (eles instanceof Node) {
    eles.nodeType === 1 && (eles.className += (' ' + className + ' '))
  }
  else {
    throw 'eles is not a html node'
  }
}
// addClass(document.getElementById('div3'), 'test')
// addClass(document.querySelectorAll('.div'), 'test')

// 2. 表单数据的验证
// 组合对象：用于对一组子对象的抽象，可与自身相互嵌套
class FormField {
  constructor() {
    this.items = {}
  }
  add(key, item) {
    this.items[key] = item
  }
  validate() {
    const { items } = this
    for (let k in items) {
      const res = items[k].validate()
      if (res) return res
    }
  }
}
// 子对象
class FormItem {
  /**
   * @param  {String} name      [在数据源中的键名]
   * @param  {Object} dataSource      [数据源对象]
   * @param  {Validator} validator [校验对象]
   */
  constructor(name, dataSource, validator) {
    this.name = name
    this.validator = validator
    this.dataSource = dataSource
  }
  validate() {
    return this.validator.start(this.dataSource[this.name])
  }
}
// 策略模式：校验对象，封装所有校验策略（也可以使用自定义校验策略，前提是返回值与已有策略返回值类型一样），用于子对象的校验
class Validator {
  constructor(rules = []) {
    // 校验策略：每个策略函数最后一个参数约定为要校验的值
    this.strategies = {
      required: (msg, value) => !value ? msg : false,
      minLength: (msg, length, value) => value.length < length ? msg : false,
      mobile: (msg, value) => !/(^1[3|5|8][0-9]{9}$)/.test(value) ? msg : false
    }
    this.rules = []
    // 初始化所有校验规则
    rules.forEach(({ name, msg, fn }) => this.add(name, msg, fn))
  }
  add(name, msg, fn) {
    // 自定义校验函数：应该同 strategy 函数一样校验不通过时返回字符串，实参为 value
    if (typeof fn === 'function') {
      return this.rules.push(fn)
    }
    const nameAndRule = name.split(':')
    const strategyName = nameAndRule[0]
    // 若存在指定参数，如minLength:6，则获取该参数
    const rule = nameAndRule[1]
    const strategy = this.strategies[strategyName]
    if (!strategy) throw `不存在校验规则 ${name}`
    const validateFn = rule ? strategy.bind(this, msg, rule) : strategy.bind(this, msg)
    this.rules.push(validateFn)
  }
  start(value) {
    const rules = this.rules
    for (let i = 0; i < rules.length; i++) {
      const res = rules[i](value)
      if (res) return res
    }
  }
}

const data = {
  d1: {
    d2: {
      // name: 152
      name: 15811153743
    },
    name: 'd1'
  },
  // d3: '',
  d3: '123456',
  d4: 'markey'
}
const form = new FormField()
const d1 = new FormField()
const d2 = new FormField()
const d1Name = new FormItem('name', data.d1, new Validator([
  { name: 'required', msg: 'd1 name 不能为空' }
]))
const d2Name = new FormItem('name', data.d1.d2, new Validator([
  { name: 'mobile', msg: 'd2 name 不是正确的手机号' }
]))
const d3 = new FormItem('d3', data, new Validator([
  { name: 'minLength:6', msg: 'd3 长度不足 6' }
]))
const d4 = new FormItem('d4', data, new Validator([
  {
    fn(value) {
      // return `自定义校验函数 ${value}`
      return false
    }
  }
]))
form.add('d1', d1)
form.add('d3', d3)
form.add('d4', d4)
d1.add('d2', d2)
d1.add('name', d1Name)
d2.add('name', d2Name)
log(form.validate())
// 注：真实情况其实可以不按照数据源层级添加 FormField，只添加要校验的 FormItem 即可，但为了与数据源结构保持一致，最好按照正确的结构添加









