(() => {
window.OhMyType = window.OhMyType || {}

function readCustomContents() {
  try {
    return JSON.parse(localStorage.getItem(window.OhMyType.CUSTOM_KEY) || '[]').map(item => ({
      ...item,
      category: normalizeCategory(item.category),
      isCustom: true
    }))
  } catch {
    return []
  }
}

function normalizeCategory(category) {
  if (category === '对话') return '对话·工作管理'
  return window.OhMyType.CATEGORIES.includes(category) ? category : '文章'
}

function writeCustomContents(items) {
  localStorage.setItem(window.OhMyType.CUSTOM_KEY, JSON.stringify(items))
}

function readOpenCategories() {
  try {
    const raw = localStorage.getItem(window.OhMyType.CATEGORY_KEY)
    if (!raw) return new Set(['对话'])
    return new Set(JSON.parse(raw))
  } catch {
    return new Set(['对话'])
  }
}

function writeOpenCategories(categories) {
  localStorage.setItem(window.OhMyType.CATEGORY_KEY, JSON.stringify([...categories]))
}

function readPracticeHistory() {
  try {
    return JSON.parse(localStorage.getItem(window.OhMyType.HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function readMistakes() {
  try {
    const stored = JSON.parse(localStorage.getItem(window.OhMyType.MISTAKE_KEY) || '{}')
    return Object.fromEntries(Object.entries(stored).map(([char, value]) => {
      if (typeof value === 'number') {
        return [char, { errors: value, correctReviews: 0, lastMistakeAt: '', lastReviewedAt: '' }]
      }
      return [char, {
        errors: Math.max(0, Number(value?.errors) || 0),
        correctReviews: Math.max(0, Number(value?.correctReviews) || 0),
        lastMistakeAt: value?.lastMistakeAt || '',
        lastReviewedAt: value?.lastReviewedAt || ''
      }]
    }))
  } catch {
    return {}
  }
}

function savePracticeRecord({ active, stats, targetChars, errors, correctChars, mistakeCounts }) {
  try {
    const now = new Date().toISOString()
    const allMistakes = readMistakes()
    mistakeCounts.forEach((count, char) => {
      const record = allMistakes[char] || { errors: 0, correctReviews: 0, lastMistakeAt: '', lastReviewedAt: '' }
      record.errors += count
      record.correctReviews = 0
      record.lastMistakeAt = now
      allMistakes[char] = record
    })

    if (Array.isArray(active.reviewCharacters)) {
      active.reviewCharacters.forEach(char => {
        const record = allMistakes[char]
        if (!record || mistakeCounts.has(char) || !correctChars.has(char)) return
        record.correctReviews += 1
        record.lastReviewedAt = now
      })
    }
    localStorage.setItem(window.OhMyType.MISTAKE_KEY, JSON.stringify(allMistakes))

    const history = readPracticeHistory()
    history.push({
      date: new Date().toISOString(),
      lessonTitle: active.title,
      courseSlug: active.category,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      duration: stats.durationSeconds,
      totalChars: stats.typedLength,
      targetChars,
      errors,
      attempts: stats.attempts,
      mistakes: JSON.stringify([...mistakeCounts.keys()])
    })
    if (history.length > 100) history.shift()
    localStorage.setItem(window.OhMyType.HISTORY_KEY, JSON.stringify(history))
  } catch {
    // localStorage can be unavailable in private browsing modes.
  }
}

Object.assign(window.OhMyType, {
  readCustomContents,
  readMistakes,
  readOpenCategories,
  readPracticeHistory,
  savePracticeRecord,
  writeCustomContents,
  writeOpenCategories
})

})()
