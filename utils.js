// utils
const path = require('path')
function log(...args) {
  console.log(...args)
}
function resolve(...paths) {
  return path.resolve(__dirname, ...paths)
}

module.exports = {
  log,
  resolve
}