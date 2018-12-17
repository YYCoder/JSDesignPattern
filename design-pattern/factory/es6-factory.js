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
 *   1. 核心依旧是将创建实例推迟到子类中进行（子类即 UserFactory），不过缺陷是当新增子类时，还是要修改两处代码（抽象类、子类的getUser方法）
 */
class User {
  constructor(sex, name) {
    if (new.target === User) {
      throw new Error('抽象类 User 不能实例化')
    }
    this.sex = sex
    this.name = name
  }
  getName() {
    throw new Error('抽象类 User 方法不能调用')
  }
}
class UserFactory extends User {
  constructor(sex, name) {
    super(sex, name)
  }
  static getUser(sex, name) {
    switch (sex) {
      case 'man': return new UserFactory('man', name);
        break;
      case 'woman': return new UserFactory('woman', name);
        break;
    }
  }
  getName() {
    log(this.name)
  }
}
// const Markey = UserFactory.getUser('man', 'Markey')
// Markey.getName()
// log(Markey)

/**
 * 抽象工厂
 *
 * 思路：
 *   1. 通过抽象类来让子类继承，从而产生指定特征的子类，在抽象工厂中根据条件返回指定子类
 *
 * 弊端：
 *   1. 相比ES5语法更啰嗦，每增加一个新类都需要手动实现继承，而不是直接在抽象工厂方法中就能完成（其实也差不多，因为增加ES5语法增加新类也需要在抽象工厂中新编写一遍）
 *   2. 新增子类一定会修改工厂方法的判断逻辑，ES5语法由于子类是在工厂方法的属性上，所以可以无需修改
 */
class AbstractUser {
  constructor(sex) {
    if (new.target === 'AbstractUser') throw new Error('抽象类不能实例化')
    this.sex = sex
  }
  getName() {
    throw new Error('抽象类方法不能调用')
  }
}
// 子类继承抽象类
class ManUser extends AbstractUser {
  constructor(name) {
    super('man')
    this.name = name
  }
  getName() {
    log(this.name)
  }
}
class WomanUser extends AbstractUser {
  constructor(name) {
    super('woman')
    this.name = name
  }
  getName() {
    log(this.name)
  }
}
// 抽象工厂函数
function abstractUserFactory(sex) {
  return {
    'man': ManUser,
    'woman': WomanUser
  }[sex]
}
// const manUser = abstractUserFactory('man')
// const Markey = new manUser('Markey')
// log(Markey)
// Markey.getName()


















