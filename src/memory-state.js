(() => {
window.OhMyType = window.OhMyType || {}

const MEMORY_DIFFICULTIES = [
  { id: 'easy', title: '简单', revealSeconds: 5, roundCount: 5, description: '每组 5 题，每题自动显示 5 秒。' },
  { id: 'normal', title: '普通', revealSeconds: 3, roundCount: 10, description: '每组 10 题，每题自动显示 3 秒。' },
  { id: 'hard', title: '困难', revealSeconds: 1, roundCount: 15, description: '每组 15 题，每题仅显示 1 秒。' }
]

function countChars(chars) {
  return chars.reduce((counts, char) => {
    counts.set(char, (counts.get(char) || 0) + 1)
    return counts
  }, new Map())
}

function analyzeMemoryAttempt(target, typed) {
  const targetChars = Array.from(String(target || ''))
  const typedChars = Array.from(String(typed || ''))
  const correct = targetChars.reduce((total, char, index) => total + (typedChars[index] === char ? 1 : 0), 0)
  const targetCounts = countChars(targetChars)
  const typedCounts = countChars(typedChars)
  const matched = [...targetCounts].reduce((total, [char, count]) => (
    total + Math.min(count, typedCounts.get(char) || 0)
  ), 0)
  const omitted = targetChars.length - matched
  const wrong = typedChars.length - matched
  const orderErrors = Math.max(0, matched - correct)
  const accuracy = targetChars.length ? Math.round((correct / targetChars.length) * 100) : 100

  return {
    target: targetChars.join(''),
    typed: typedChars.join(''),
    correct,
    wrong,
    omitted,
    orderErrors,
    accuracy,
    perfect: targetChars.join('') === typedChars.join('')
  }
}

function createMemoryRound({ prompt, difficulty = 'normal', now = Date.now() }) {
  const difficultyConfig = MEMORY_DIFFICULTIES.find(item => item.id === difficulty) || MEMORY_DIFFICULTIES[1]
  let phase = 'reveal'
  let inputStartedAt = 0
  let result = null
  const revealEndsAt = now + difficultyConfig.revealSeconds * 1000

  function getState(currentTime = Date.now()) {
    return {
      phase,
      prompt,
      difficulty: difficultyConfig,
      remainingSeconds: phase === 'reveal'
        ? Math.max(0, Math.ceil((revealEndsAt - currentTime) / 1000))
        : 0,
      remainingMilliseconds: phase === 'reveal' ? Math.max(0, revealEndsAt - currentTime) : 0,
      result
    }
  }

  function beginInput(currentTime = Date.now()) {
    if (phase !== 'reveal') return getState(currentTime)
    phase = 'input'
    inputStartedAt = currentTime
    return getState(currentTime)
  }

  function submit(value, currentTime = Date.now()) {
    if (phase !== 'input') return result
    result = {
      ...analyzeMemoryAttempt(prompt.text, value),
      durationSeconds: Math.max(1, Math.ceil((currentTime - inputStartedAt) / 1000))
    }
    phase = 'result'
    return result
  }

  return { beginInput, getState, submit }
}

function shufflePrompts(prompts, random) {
  const result = prompts.slice()
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function summarizeAttempts(attempts) {
  const totals = attempts.reduce((summary, attempt) => {
    summary.correct += attempt.correct
    summary.wrong += attempt.wrong
    summary.omitted += attempt.omitted
    summary.orderErrors += attempt.orderErrors
    summary.durationSeconds += attempt.durationSeconds
    summary.targetLength += Array.from(attempt.target).length
    summary.typedLength += Array.from(attempt.typed).length
    if (attempt.perfect) {
      summary.perfectCount++
      summary.currentStreak++
      summary.bestStreak = Math.max(summary.bestStreak, summary.currentStreak)
    } else {
      summary.currentStreak = 0
    }
    return summary
  }, {
    correct: 0,
    wrong: 0,
    omitted: 0,
    orderErrors: 0,
    durationSeconds: 0,
    targetLength: 0,
    typedLength: 0,
    perfectCount: 0,
    currentStreak: 0,
    bestStreak: 0
  })
  totals.accuracy = totals.targetLength ? Math.round((totals.correct / totals.targetLength) * 100) : 100
  totals.cpm = totals.durationSeconds ? Math.round((totals.typedLength / totals.durationSeconds) * 60) : 0
  totals.wpm = totals.durationSeconds ? Math.round((totals.typedLength / 5 / totals.durationSeconds) * 60) : 0
  totals.averageSeconds = attempts.length
    ? Math.round((totals.durationSeconds / attempts.length) * 10) / 10
    : 0
  return totals
}

function createMemorySession({ prompts, type, difficulty = 'normal', now = Date.now(), random = Math.random }) {
  const difficultyConfig = MEMORY_DIFFICULTIES.find(item => item.id === difficulty) || MEMORY_DIFFICULTIES[1]
  const queue = shufflePrompts(prompts.filter(prompt => prompt.type === type), random)
    .slice(0, difficultyConfig.roundCount)
  let phase = queue.length ? 'reveal' : 'complete'
  let index = 0
  let inputStartedAt = 0
  let revealEndsAt = now + difficultyConfig.revealSeconds * 1000
  const attempts = []

  function getState(currentTime = Date.now()) {
    return {
      phase,
      prompt: queue[index] || null,
      difficulty: difficultyConfig,
      index,
      total: queue.length,
      attempts: attempts.slice(),
      remainingSeconds: phase === 'reveal'
        ? Math.max(0, Math.ceil((revealEndsAt - currentTime) / 1000))
        : 0,
      remainingMilliseconds: phase === 'reveal' ? Math.max(0, revealEndsAt - currentTime) : 0,
      summary: phase === 'complete' ? summarizeAttempts(attempts) : null
    }
  }

  function beginInput(currentTime = Date.now()) {
    if (phase !== 'reveal') return getState(currentTime)
    phase = 'input'
    inputStartedAt = currentTime
    return getState(currentTime)
  }

  function submit(value, currentTime = Date.now()) {
    if (phase !== 'input' || !queue[index]) return null
    const result = {
      ...analyzeMemoryAttempt(queue[index].text, value),
      prompt: queue[index],
      durationSeconds: Math.max(1, Math.ceil((currentTime - inputStartedAt) / 1000))
    }
    attempts.push(result)
    if (index >= queue.length - 1) {
      phase = 'complete'
    } else {
      index++
      phase = 'reveal'
      revealEndsAt = currentTime + difficultyConfig.revealSeconds * 1000
    }
    return result
  }

  return { beginInput, getState, submit }
}

function createSharedMemoryPrompts(basePrompts, contents) {
  const prompts = basePrompts.slice()
  const seen = new Set(prompts.map(item => `${item.type}\u0000${item.text}`))
  const categoryTypes = new Map([
    ['单词', '单词'],
    ['英语', '单词'],
    ['编程·JavaScript', 'JavaScript'],
    ['编程·Python', 'Python'],
    ['编程·HTML', 'HTML'],
    ['编程·CSS', 'CSS']
  ])

  contents.forEach(content => {
    const type = categoryTypes.get(content.category)
    if (!type) return
    String(content.body || '').split(/\s+/).filter(Boolean).forEach((text, index) => {
      const key = `${type}\u0000${text}`
      if (seen.has(key)) return
      seen.add(key)
      prompts.push({ id: `memory-shared-${content.id}-${index + 1}`, type, text })
    })
  })
  return prompts
}

function pickMemoryPrompt(prompts, type, currentId, random = Math.random) {
  const matching = prompts.filter(prompt => prompt.type === type)
  if (!matching.length) return null
  const candidates = matching.length > 1
    ? matching.filter(prompt => prompt.id !== currentId)
    : matching
  return candidates[Math.floor(random() * candidates.length)] || candidates[0]
}

Object.assign(window.OhMyType, {
  MEMORY_DIFFICULTIES,
  analyzeMemoryAttempt,
  createMemoryRound,
  createMemorySession,
  createSharedMemoryPrompts,
  pickMemoryPrompt
})
})()
