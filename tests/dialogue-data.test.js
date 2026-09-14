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

const dailyDialogues = dialogues.filter(item => item.category === '对话·日常聊天')
assert.ok(dailyDialogues.length >= 5, 'daily chat should cover several relationships')
assert.ok(dailyDialogues.some(item => item.title.includes('朋友')))
assert.ok(dailyDialogues.some(item => item.title.includes('闺蜜')))
assert.ok(dailyDialogues.some(item => item.title.includes('情侣')))
assert.ok(dailyDialogues.every(item => !item.title.includes('老板')))

const clientDialogues = dialogues.filter(item => item.category === '对话·客户沟通')
assert.ok(clientDialogues.length >= 5, 'client communication should provide several customer-service scenarios')
assert.ok(clientDialogues.every(item => item.incomingRole === '客户' && item.replyRole === '客服'))

const supportDialogues = dialogues.filter(item => item.category === '对话·客服售后')
assert.ok(supportDialogues.length >= 5, 'after-sales support should provide several direct service scenarios')
assert.ok(supportDialogues.every(item => item.incomingRole === '客户' && item.replyRole === '客服'))

const interviewDialogues = dialogues.filter(item => item.category === '对话·面试问答')
assert.ok(interviewDialogues.length >= 4)
assert.ok(interviewDialogues.every(item => ['面试官', '候选人'].includes(item.incomingRole)))
assert.ok(interviewDialogues.every(item => ['面试官', '候选人'].includes(item.replyRole)))

console.log('dialogue-data tests passed')
