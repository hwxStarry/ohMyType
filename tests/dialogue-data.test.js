const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/data.js', 'utf8'), context)

const dialogues = context.window.OhMyType.defaultContents.filter(item => item.category.startsWith('对话·'))
const originalIds = [
  'dialogue-progress',
  'dialogue-feedback',
  'dialogue-meeting',
  'dialogue-client-delay',
  'dialogue-client-requirement',
  'dialogue-interview',
  'dialogue-daily',
  'dialogue-service-refund'
]

assert.ok(dialogues.length >= 13, 'should provide at least 13 dialogue scenarios')
assert.equal(new Set(dialogues.map(item => item.id)).size, dialogues.length, 'dialogue ids should be unique')

for (const id of originalIds) {
  const dialogue = dialogues.find(item => item.id === id)
  assert.ok(dialogue, `missing existing dialogue: ${id}`)
  assert.ok(dialogue.messages.length >= 8, `${id} should be extended to at least 8 turns`)
}

for (const dialogue of dialogues) {
  assert.ok(dialogue.messages.length >= 8, `${dialogue.id} should contain at least 8 turns`)
  assert.equal(dialogue.body, dialogue.messages.map(message => message.reply).join('\n'))
  for (const message of dialogue.messages) {
    assert.ok(message.incoming.length >= 6, `${dialogue.id} has an overly short incoming message`)
    assert.ok(message.reply.length >= 18, `${dialogue.id} has an overly short boss reply`)
  }
}

console.log('dialogue-data tests passed')
