const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const html = fs.readFileSync('index.html', 'utf8')

assert.match(html, /id="homeTab"/)
assert.match(html, /id="brandHome"/)
assert.match(html, /id="homeView" class="home-view"/)
assert.match(html, /id="practiceView" class="practice-layout" hidden/)
assert.match(html, /styles\/home\.css/)

const context = { window: { OhMyType: {} } }
const homeStateSource = fs.existsSync('src/home-state.js') ? fs.readFileSync('src/home-state.js', 'utf8') : ''
vm.runInNewContext(homeStateSource, context)

assert.equal(typeof context.window.OhMyType.createHomeModel, 'function')
const model = context.window.OhMyType.createHomeModel({
  contents: [
    { id: 'pinyin', category: '拼音', title: '拼音入门' },
    { id: 'poem', category: '诗词', title: '静夜思' },
    { id: 'js', category: '编程·JavaScript', title: '数组方法' },
    { id: 'chat', category: '对话·日常聊天', title: '周末见面' }
  ],
  recentIds: ['chat', 'missing'],
  memoryPrompts: [{ id: 'm1' }, { id: 'm2' }],
  history: [{ wpm: 42 }, { wpm: 58 }]
})
assert.equal(model.totalContents, 4)
assert.equal(model.poemCount, 1)
assert.equal(model.programmingCount, 1)
assert.equal(model.dialogueCount, 1)
assert.equal(model.memoryCount, 2)
assert.equal(model.continueItem.id, 'chat')
assert.equal(model.bestWpm, 58)

assert.equal(typeof context.window.OhMyType.renderHomeMarkup, 'function')
const markup = context.window.OhMyType.renderHomeMarkup(model)
assert.match(markup, /data-home-action="continue"/)
assert.match(markup, /继续：周末见面/)
assert.match(markup, /data-home-track="programming"/)
assert.match(markup, /data-home-fun="memory"/)
assert.match(markup, />4<\/strong><span>项练习/)
assert.match(markup, />2<\/strong><span>道记忆题/)

assert.deepEqual(
  Array.from(context.window.OhMyType.getHomeTrackContents([
    { id: 'pinyin', category: '拼音' },
    { id: 'js', category: '编程·JavaScript' },
    { id: 'python', category: '编程·Python' },
    { id: 'chat', category: '对话·日常聊天' }
  ], 'programming'), item => item.id),
  ['js', 'python']
)

console.log('home tests passed')
