(() => {
window.OhMyType = window.OhMyType || {}

function readCustomContents() {
  try {
    return JSON.parse(localStorage.getItem(window.OhMyType.CUSTOM_KEY) || '[]').map(item => ({
      ...item,
      category: window.OhMyType.CATEGORIES.includes(item.category) ? item.category : '文章',
      isCustom: true
    }))
  } catch {
    return []
  }
}

function writeCustomContents(items) {
  localStorage.setItem(window.OhMyType.CUSTOM_KEY, JSON.stringify(items))
}

function readOpenCategories() {
  try {
    const raw = localStorage.getItem(window.OhMyType.CATEGORY_KEY)
    if (!raw) return new Set(window.OhMyType.CATEGORIES)
    return new Set(JSON.parse(raw))
  } catch {
    return new Set(window.OhMyType.CATEGORIES)
  }
}

function writeOpenCategories(categories) {
  localStorage.setItem(window.OhMyType.CATEGORY_KEY, JSON.stringify([...categories]))
}

function savePracticeRecord({ active, stats, totalChars, errors, mistakeChars }) {
  try {
    const allMistakes = JSON.parse(localStorage.getItem(window.OhMyType.MISTAKE_KEY) || '{}')
    mistakeChars.forEach(char => {
      allMistakes[char] = (allMistakes[char] || 0) + 1
    })
    localStorage.setItem(window.OhMyType.MISTAKE_KEY, JSON.stringify(allMistakes))

    const history = JSON.parse(localStorage.getItem(window.OhMyType.HISTORY_KEY) || '[]')
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
  readOpenCategories,
  savePracticeRecord,
  writeCustomContents,
  writeOpenCategories
})

})()
