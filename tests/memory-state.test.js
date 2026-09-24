const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/memory-state.js', 'utf8'), context)

const {
  MEMORY_DIFFICULTIES,
  analyzeMemoryAttempt,
  createMemorySession,
  createSharedMemoryPrompts,
  pickMemoryPrompt
} = context.window.OhMyType

assert.deepEqual(Array.from(MEMORY_DIFFICULTIES, item => item.id), ['easy', 'normal', 'hard'])
assert.deepEqual(Array.from(MEMORY_DIFFICULTIES, item => item.revealSeconds), [5, 3, 1])
assert.deepEqual(Array.from(MEMORY_DIFFICULTIES, item => item.inputSeconds), [15, 10, 6])
assert.deepEqual(Array.from(MEMORY_DIFFICULTIES, item => item.roundCount), [5, 10, 15])

const perfect = analyzeMemoryAttempt('床前明月光', '床前明月光')
assert.equal(perfect.correct, 5)
assert.equal(perfect.wrong, 0)
assert.equal(perfect.omitted, 0)
assert.equal(perfect.orderErrors, 0)
assert.equal(perfect.accuracy, 100)
assert.equal(perfect.perfect, true)

const mixed = analyzeMemoryAttempt('床前明月光', '床前月光错')
assert.equal(mixed.correct, 2)
assert.equal(mixed.wrong, 1)
assert.equal(mixed.omitted, 1)
assert.equal(mixed.orderErrors, 2)
assert.equal(mixed.perfect, false)

const reordered = analyzeMemoryAttempt('床前明月光', '床前月明光')
assert.equal(reordered.orderErrors, 2)
assert.equal(reordered.wrong, 0)
assert.equal(reordered.omitted, 0)

const sessionPrompts = Array.from({ length: 12 }, (_, index) => ({
  id: `poem-${index + 1}`,
  type: '诗词',
  text: `第${index + 1}句诗词`
}))
const session = createMemorySession({
  prompts: sessionPrompts,
  type: '诗词',
  difficulty: 'normal',
  now: 1000,
  random: () => 0
})
assert.equal(session.getState(1000).phase, 'reveal')
assert.equal(session.getState(1000).total, 10)
assert.equal(session.getState(3999).remainingSeconds, 1)
assert.equal(session.getState(3999).remainingMilliseconds, 1)
assert.equal(session.getState(4000).remainingSeconds, 0)
session.beginInput(4000)
assert.equal(session.getState(4000).phase, 'input')
assert.equal(session.getState(4000).remainingSeconds, 10)
assert.equal(session.getState(13999).remainingSeconds, 1)
const firstPrompt = session.getState(4000).prompt.text
session.submit(firstPrompt, 6500)
assert.equal(session.getState(6500).phase, 'reveal')
assert.equal(session.getState(6500).index, 1)
assert.equal(session.getState(6500).attempts[0].durationSeconds, 3)
assert.equal(session.getState(6500).attempts[0].timedOut, false)
assert.notEqual(session.getState(6500).prompt.id, 'poem-1')

for (let index = 1; index < 10; index++) {
  session.beginInput(10000 + index * 1000)
  session.submit(session.getState().prompt.text, 10500 + index * 1000)
}
const completedState = session.getState()
assert.equal(completedState.phase, 'complete')
assert.equal(completedState.attempts.length, 10)
assert.equal(completedState.summary.perfectCount, 10)
assert.equal(completedState.summary.bestStreak, 10)
assert.equal(completedState.summary.accuracy, 100)
assert.ok(completedState.summary.cpm > 0)
assert.ok(completedState.summary.wpm > 0)
assert.equal(completedState.summary.averageSeconds, 1.2)

const timeoutSession = createMemorySession({
  prompts: sessionPrompts,
  type: '诗词',
  difficulty: 'hard',
  now: 1000,
  random: () => 0
})
timeoutSession.beginInput(2000)
assert.equal(timeoutSession.getState(7999).remainingSeconds, 1)
assert.equal(timeoutSession.getState(8000).remainingSeconds, 0)
timeoutSession.submit('第', 8000)
assert.equal(timeoutSession.getState(8000).attempts[0].timedOut, true)
assert.equal(timeoutSession.getState(8000).attempts[0].durationSeconds, 6)
assert.equal(timeoutSession.getState(8000).phase, 'reveal')

const prompts = [
  { id: 'a', type: '成语', text: '一心一意' },
  { id: 'b', type: '成语', text: '画龙点睛' },
  { id: 'c', type: '诗词', text: '床前明月光' }
]
assert.equal(pickMemoryPrompt(prompts, '成语', 'a', () => 0).id, 'b')
assert.equal(pickMemoryPrompt(prompts, '诗词', '', () => 0).id, 'c')
assert.equal(pickMemoryPrompt([], '成语', '', () => 0), null)

const sharedPrompts = createSharedMemoryPrompts(
  [{ id: 'base-1', type: '单词', text: 'keyboard' }],
  [
    { id: 'words', category: '单词', body: 'keyboard browser' },
    { id: 'js', category: '编程·JavaScript', body: 'forEach map' },
    { id: 'python', category: '编程·Python', body: 'list dict' },
    { id: 'html', category: '编程·HTML', body: 'div span' },
    { id: 'css', category: '编程·CSS', body: 'display grid' }
  ]
)
assert.equal(sharedPrompts.filter(item => item.type === '单词' && item.text === 'keyboard').length, 1)
assert.ok(sharedPrompts.some(item => item.type === '单词' && item.text === 'browser'))
assert.ok(sharedPrompts.some(item => item.type === 'JavaScript' && item.text === 'forEach'))
assert.ok(sharedPrompts.some(item => item.type === 'Python' && item.text === 'dict'))
assert.ok(sharedPrompts.some(item => item.type === 'HTML' && item.text === 'div'))
assert.ok(sharedPrompts.some(item => item.type === 'CSS' && item.text === 'grid'))

console.log('memory-state tests passed')
