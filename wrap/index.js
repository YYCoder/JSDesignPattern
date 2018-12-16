/**
 * 实现封装的几种方法
 *
 * 1. 存取器及闭包：通过存取器属性（get、set）限制私有属性的读取与修改，通过闭包保存内部变量
 * 2. 通过命名约定私有属性
 */
const { log } = require('../utils')
const Interface = require('../interface/interface')
// 先定义接口，用于检查实例是否合法
const BookInterface = new Interface('Book', ['title', 'author', 'isbn'])

// 1. 通过 info 保存私有属性，通过存取器属性限制对私有属性的访问
class Book {
  constructor({ title, author, isbn }) {
    let info = {
      title,
      author,
      isbn
    }
    // 定义 title/author 为只读属性，isbn 不可读
    Object.defineProperties(this, {
      title: {
        get() { return info.title },
        set() { return false },
        enumerable: false,
        configurable: false
      },
      author: {
        get() { return info.author },
        set() { return false },
        enumerable: false,
        configurable: false
      },
      isbn: {
        get() { return false },
        set() { return false },
        enumerable: false,
        configurable: false
      }
    })
    // 只能通过该方法修改 title 属性
    this.changeTitle = function(title) {
      info.title = title
    }
  }
}
const book = new Book({
  title: '冰与火之歌',
  author: 'Markey',
  isbn: 12345
})
log(book.title, book.author, book.isbn)
book.changeTitle('测试')
log(book.title)

// 2. 很简单，暂时不实现了







