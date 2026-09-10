const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

let savedRecord
const context = {
  window: {
    OhMyType: {
      savePracticeRecord(record) {
        savedRecord = record
      }
    }
  }
}
vm.runInNewContext(fs.readFileSync('src/typing-state.js', 'utf8'), context)

const input = { value: '', disabled: false }
const state = context.window.OhMyType.createTypingState({
  getActiveContent: () => ({ id: 'test', title: 'Test', category: '文章' }),
  getCompareText: () => 'abc',
  inputEl: input,
  onChange() {},
  onFinish() {}
})

state.handleValue('x')
state.handleValue('')
state.handleValue('a')
state.handleValue('ab')
state.handleValue('abc')

assert.equal(state.getStats().errors, 1, '退格不应清除已发生的错误')
assert.equal(state.getStats().attempts, 4)
assert.equal(state.getStats().correctAttempts, 3)
assert.equal(state.getStats().accuracy, 75)
assert.equal(savedRecord.targetChars, 3)
assert.equal(savedRecord.stats.typedLength, 3)
assert.equal(savedRecord.mistakeCounts.get('a'), 1)

state.reset()
state.recordRejectedAttempt('a')
assert.equal(state.getStats().errors, 1, '严格模式拦截的错键也应记录')
assert.equal(state.getStats().accuracy, 0)

console.log('typing-state tests passed')
