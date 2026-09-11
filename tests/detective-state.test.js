const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/detective-state.js', 'utf8'), context)
const { createDetectiveState } = context.window.OhMyType
const caseItem = {
  statements: [
    { text: '证词一内容', clue: '线索一' },
    { text: '证词二内容', clue: '线索二' },
    { text: '证词三内容', clue: '线索三' }
  ],
  acceptedAnswers: ['林夏', '地面的雨水']
}

const detective = createDetectiveState(caseItem)
assert.equal(detective.getState().phase, 'intro')
detective.completeStatement()
assert.equal(detective.submitAnswer('林夏'), false)
assert.equal(detective.getState().clues.length, 0)
detective.start()
assert.equal(detective.getState().phase, 'statement')
assert.equal(detective.getState().statementIndex, 0)

detective.completeStatement()
assert.deepEqual(Array.from(detective.getState().clues), ['线索一'])
assert.equal(detective.getState().statementIndex, 1)
detective.start()
assert.equal(detective.getState().statementIndex, 1)
assert.equal(detective.submitAnswer('错误答案'), false)
assert.equal(detective.getState().wrongAttempts, 0)
detective.completeStatement()
detective.completeStatement()
assert.equal(detective.getState().phase, 'accusation')
assert.deepEqual(Array.from(detective.getState().clues), ['线索一', '线索二', '线索三'])
detective.completeStatement()
assert.equal(detective.getState().clues.length, 3)

assert.equal(detective.submitAnswer('  \n '), false)
assert.equal(detective.getState().wrongAttempts, 0)
assert.equal(detective.submitAnswer('错误答案'), false)
assert.equal(detective.getState().phase, 'accusation')
assert.equal(detective.getState().wrongAttempts, 1)
assert.equal(detective.submitAnswer(' 林夏 '), true)
assert.equal(detective.getState().phase, 'result')
assert.equal(detective.submitAnswer('错误答案'), false)
detective.completeStatement()
assert.equal(detective.getState().wrongAttempts, 1)
assert.equal(detective.getState().clues.length, 3)

detective.getState().clues.push('外部篡改')
assert.equal(detective.getState().clues.length, 3)
detective.reset()
assert.equal(detective.getState().phase, 'intro')
assert.equal(detective.getState().clues.length, 0)
assert.equal(detective.getState().statementIndex, 0)
assert.equal(detective.getState().wrongAttempts, 0)
detective.start()
detective.completeStatement()
detective.completeStatement()
detective.completeStatement()
assert.equal(detective.submitAnswer('地面的雨水'), true)
assert.equal(detective.getState().phase, 'result')
console.log('detective-state tests passed')
