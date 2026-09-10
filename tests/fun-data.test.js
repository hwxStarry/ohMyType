const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const context = { window: { OhMyType: {} } }
vm.runInNewContext(fs.readFileSync('src/fun-data.js', 'utf8'), context)

const { branchingStories, funModes } = context.window.OhMyType
assert.ok(funModes.some(mode => mode.id === 'branching-story' && mode.status === 'playable'))
assert.ok(branchingStories.length > 0)

branchingStories.forEach(story => {
  assert.ok(story.nodes[story.start], `${story.id} 缺少起始节点`)
  const visited = new Set()
  const pending = [story.start]
  let endingCount = 0

  while (pending.length) {
    const nodeId = pending.pop()
    if (visited.has(nodeId)) continue
    visited.add(nodeId)
    const node = story.nodes[nodeId]
    assert.ok(node, `${story.id} 引用了不存在的节点 ${nodeId}`)
    if (node.ending) {
      endingCount++
      continue
    }
    assert.ok(node.choices.length >= 2, `${story.id}/${nodeId} 至少需要两个选项`)
    node.choices.forEach(choice => {
      assert.ok(choice.text.length >= 10, `${story.id}/${nodeId} 选项过短，不适合打字练习`)
      assert.ok(story.nodes[choice.next], `${story.id}/${nodeId} 的下一节点不存在`)
      pending.push(choice.next)
    })
  }

  assert.ok(endingCount >= 2, `${story.id} 需要多个可达结局`)
})

console.log('fun-data tests passed')
