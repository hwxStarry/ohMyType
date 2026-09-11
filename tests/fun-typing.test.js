const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/fun-typing.js', 'utf8'), context)
const { getFunTypingState } = context.window.OhMyType

let state = getFunTypingState(['打开那封信', '放回那封信'], '')
assert.deepEqual(Array.from(state.bestIndexes), [0, 1])
assert.equal(state.candidates[0].chars[0].status, 'current')
assert.equal(state.candidates[1].chars[0].status, 'current')

state = getFunTypingState(['打开那封信', '放回那封信'], '打开')
assert.equal(state.candidates[0].chars[0].status, 'correct')
assert.equal(state.candidates[0].chars[1].status, 'correct')
assert.deepEqual(Array.from(state.bestIndexes), [0])
assert.deepEqual(Array.from(state.nextChars), ['那'])

const wrong = getFunTypingState(['打开那封信', '放回那封信'], '打错')
assert.equal(wrong.candidates[0].chars[1].status, 'wrong')
assert.equal(wrong.completedIndex, -1)

const corrected = getFunTypingState(['打开那封信'], '打')
assert.equal(corrected.candidates[0].chars[0].status, 'correct')
assert.equal(corrected.candidates[0].chars[1].status, 'current')

const completed = getFunTypingState(['打开那封信', '放回那封信'], '打开那封信')
assert.equal(completed.completedIndex, 0)

const unicode = getFunTypingState(['去看𠮷'], '去看')
assert.equal(unicode.candidates[0].chars[2].char, '𠮷')
console.log('fun-typing tests passed')
