const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = {
  window: {
    OhMyType: {
      keyboardRows: [['a', 'b', '1', 'Shift']],
      homeKeys: new Set(),
      dotKeys: new Set(),
      escapeHtml: value => String(value)
    }
  }
}
vm.runInNewContext(fs.readFileSync('src/keyboard.js', 'utf8'), context)
const container = { innerHTML: '' }

context.window.OhMyType.renderKeyboard(container, ['a', 'b'])
assert.match(container.innerHTML, /key expected[^>]*>a</)
assert.match(container.innerHTML, /key expected[^>]*>b</)

context.window.OhMyType.renderKeyboard(container, '!')
assert.match(container.innerHTML, /key expected[^>]*>1</)
console.log('keyboard tests passed')
