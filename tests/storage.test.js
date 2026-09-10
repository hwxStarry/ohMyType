const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const values = new Map([
  ['typestart_mistakes', JSON.stringify({ a: 2 })]
])
const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null },
  setItem(key, value) { values.set(key, String(value)) }
}
const context = {
  localStorage,
  window: {
    OhMyType: {
      CATEGORIES: ['文章'],
      CUSTOM_KEY: 'custom',
      CATEGORY_KEY: 'categories',
      HISTORY_KEY: 'typestart_history',
      MISTAKE_KEY: 'typestart_mistakes'
    }
  }
}
vm.runInNewContext(fs.readFileSync('src/storage.js', 'utf8'), context)

const storage = context.window.OhMyType
assert.equal(storage.readMistakes().a.errors, 2, '旧版数字格式应自动兼容')

storage.savePracticeRecord({
  active: { title: '弱项复习', category: '文章', reviewCharacters: ['a', 'b'] },
  stats: { wpm: 10, cpm: 50, accuracy: 80, durationSeconds: 12, typedLength: 5, attempts: 6 },
  targetChars: 10,
  errors: 2,
  correctChars: new Set(['a']),
  mistakeCounts: new Map([['b', 2]])
})

const mistakes = storage.readMistakes()
assert.equal(mistakes.a.correctReviews, 1, '复习时没再打错的字应增加熟练度')
assert.equal(mistakes.b.errors, 2)
assert.equal(mistakes.b.correctReviews, 0, '再次打错应重置连续正确次数')

const history = storage.readPracticeHistory()
assert.equal(history[0].totalChars, 5, '历史应记录实际输入数')
assert.equal(history[0].targetChars, 10)

console.log('storage tests passed')
