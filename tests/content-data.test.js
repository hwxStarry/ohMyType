const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/memory-data.js', 'utf8'), context)
vm.runInNewContext(fs.readFileSync('src/data.js', 'utf8'), context)

const contents = context.window.OhMyType.defaultContents
const ids = contents.map(item => item.id)
const countByCategory = category => contents.filter(item => item.category === category).length

assert.equal(new Set(ids).size, ids.length, 'built-in content ids should be unique')
assert.ok(countByCategory('拼音') >= 12, 'should provide a substantial pinyin course set')
assert.ok(countByCategory('诗词') >= 319, 'should share the complete Tang 300 poetry library')
assert.ok(countByCategory('单词') >= 14, 'should provide varied vocabulary sets')
assert.ok(countByCategory('编程·JavaScript') >= 14, 'should provide substantial JavaScript drills')
assert.ok(countByCategory('编程·Python') >= 12, 'should provide substantial Python drills')
assert.ok(countByCategory('编程·HTML') >= 9, 'should provide HTML tag and attribute drills')
assert.ok(countByCategory('编程·CSS') >= 9, 'should provide substantial CSS drills')

for (const item of contents.filter(item => item.category === '单词' || item.category.startsWith('编程·'))) {
  const words = item.body.match(/\S+/g) || []
  assert.equal(item.translations.length, words.length, `${item.id} should explain every term`)
}

assert.ok(contents.some(item => item.id.startsWith('programming-js-')))
assert.ok(contents.some(item => item.id.startsWith('programming-python-')))

for (const item of contents.filter(item => item.category.startsWith('编程·'))) {
  assert.ok((item.body.match(/\S+/g) || []).length <= 16, `${item.id} should stay focused and scannable`)
}

const programmingTerms = contents
  .filter(item => item.category.startsWith('编程·'))
  .flatMap(item => item.body.split(/\s+/))
assert.ok(programmingTerms.includes('forEach'))
assert.ok(programmingTerms.includes('div'))
assert.ok(programmingTerms.includes('label'))
assert.ok(programmingTerms.includes('placeholder'))
assert.ok(programmingTerms.includes('grid-template-columns'))

console.log('content-data tests passed')
