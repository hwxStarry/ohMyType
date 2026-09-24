const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
for (const file of ['src/memory-data.js', 'src/data.js', 'src/memory-state.js']) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context)
}

const {
  createSharedMemoryPrompts,
  defaultContents,
  idiomLibrary,
  memoryPrompts,
  poetryLibrary
} = context.window.OhMyType

assert.equal(poetryLibrary.length, 319)
assert.equal(defaultContents.filter(item => item.category === '诗词').length, poetryLibrary.length)
assert.ok(idiomLibrary.length >= 48000)

const shared = createSharedMemoryPrompts(memoryPrompts, defaultContents)
for (const [type, term] of [
  ['单词', 'keyboard'],
  ['JavaScript', 'forEach'],
  ['Python', 'dict'],
  ['HTML', 'div'],
  ['CSS', 'display']
]) {
  assert.ok(shared.some(item => item.type === type && item.text === term), `${type} should reuse ${term}`)
}

console.log('shared-library tests passed')
