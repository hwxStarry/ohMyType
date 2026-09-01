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
    return JSON.parse(localStorage.getItem(window.OhMyType.MISTAKE_KEY) || '{}')
  } catch {
    return {}
  }
}

function savePracticeRecord({ active, stats, totalChars, errors, mistakeChars }) {
  try {
    const allMistakes = JSON.parse(localStorage.getItem(window.OhMyType.MISTAKE_KEY) || '{}')
    mistakeChars.forEach(char => {
      allMistakes[char] = (allMistakes[char] || 0) + 1
    })
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
      totalChars,
      errors,
      mistakes: JSON.stringify([...mistakeChars])
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
