const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/content-library.js', 'utf8'), context)

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null },
    setItem(key, value) { values.set(key, String(value)) }
  }
}

const contents = [
  { id: 'poem', title: '静夜思', category: '诗词', body: '床前明月光' },
  { id: 'js', title: '数组遍历', category: '编程·JavaScript', body: 'forEach map', translations: ['逐项执行', '映射数组'] },
  { id: 'daily', title: '朋友聊天', category: '对话·日常聊天', body: '周末一起吃饭' }
]

const searchContents = context.window.OhMyType.searchContents
assert.deepEqual(Array.from(searchContents(contents, '')), contents)
assert.deepEqual(Array.from(searchContents(contents, 'javascript'), item => item.id), ['js'])
assert.deepEqual(Array.from(searchContents(contents, '逐项'), item => item.id), ['js'])
assert.deepEqual(Array.from(searchContents(contents, '明月'), item => item.id), ['poem'])
assert.deepEqual(Array.from(searchContents(contents, '不存在')), [])

const storage = createStorage()
const library = context.window.OhMyType.createContentLibrary({
  storage,
  favoritesKey: 'favorites',
  recentsKey: 'recents',
  recentLimit: 3
})

assert.deepEqual(Array.from(library.readFavoriteIds()), [])
assert.equal(library.toggleFavorite('poem'), true)
assert.equal(library.toggleFavorite('js'), true)
assert.deepEqual(Array.from(library.readFavoriteIds()), ['poem', 'js'])
assert.equal(library.toggleFavorite('poem'), false)
assert.deepEqual(Array.from(library.readFavoriteIds()), ['js'])

library.recordRecent('poem')
library.recordRecent('js')
library.recordRecent('daily')
library.recordRecent('poem')
assert.deepEqual(Array.from(library.readRecentIds()), ['poem', 'daily', 'js'])

assert.equal(library.pickRandom([], '', () => 0), null)
assert.equal(library.pickRandom([contents[0]], 'poem', () => 0).id, 'poem')
assert.equal(library.pickRandom(contents, 'poem', () => 0).id, 'js')
assert.equal(library.pickRandom(contents, 'poem', () => 0.99).id, 'daily')

const brokenLibrary = context.window.OhMyType.createContentLibrary({
  storage: createStorage({ favorites: '{broken' }),
  favoritesKey: 'favorites',
  recentsKey: 'recents'
})
assert.deepEqual(Array.from(brokenLibrary.readFavoriteIds()), [])

console.log('content-library tests passed')
