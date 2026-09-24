const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/memory-data.js', 'utf8'), context)

const { memoryPrompts } = context.window.OhMyType
const types = ['成语', '诗词', '单词', '短句']

assert.ok(memoryPrompts.length >= 52000)
assert.equal(new Set(memoryPrompts.map(item => item.id)).size, memoryPrompts.length)
assert.equal(new Set(memoryPrompts.map(item => `${item.type}:${item.text}`)).size, memoryPrompts.length)
for (const type of types) {
  const minimum = type === '成语' ? 48000 : (type === '诗词' ? 3000 : 40)
  assert.ok(memoryPrompts.filter(item => item.type === type).length >= minimum, `${type} should have a substantial prompt library`)
}

console.log('memory-data tests passed')
