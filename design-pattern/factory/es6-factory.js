/**
 * ES6版工厂模式
 */
const { log } = require('../../utils')
/**
 * 简单工厂
 *
 * 思路：通过静态方法来创建要生成的对象实例
 */
class HumanFactory {
  constructor(type, name) {
    this.type = type
    this.name = name
  }
  static getHuman(type = 'man', name) {
    switch (type) {
      case 'man': return new HumanFactory('man', name);
        break;
      case 'woman': return new HumanFactory('woman', name);
        break;
    }
  }
}
// const Markey = HumanFactory.getHuman('man', 'Markey')
// log(Markey)

/**
 * 工厂方法
 *
 * 思路：
 */
