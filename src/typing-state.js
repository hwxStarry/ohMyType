(() => {
window.OhMyType = window.OhMyType || {}

function createTypingState({ getActiveContent, getCompareText, inputEl, onChange, onFinish }) {
  let isRunning = false
  let isFinished = false
  let startTime = 0
  let endTime = 0
  let errors = 0
  let attempts = 0
  let correctAttempts = 0
  let mistakeChars = new Set()
  let mistakeCounts = new Map()
  let typedValue = ''

  function getTypedChars() {
    return Array.from(typedValue)
  }

  function getTargetChars() {
    return getCompareChars()
  }

  function getCompareChars() {
    return Array.from(getCompareText())
  }

  function getDurationMs() {
    if (!startTime) return 0
    return (isFinished ? endTime : Date.now()) - startTime
  }

  function getDurationSeconds() {
    return Math.max(1, Math.round(getDurationMs() / 1000))
  }

  function getStats() {
    const typed = getTypedChars()
    const minutes = getDurationMs() / 60000
    const compareTo = getCompareChars()
    const accuracy = attempts === 0 ? 100 : Math.round((correctAttempts / attempts) * 100)

    return {
      accuracy,
      attempts,
      correctAttempts,
      cpm: minutes > 0 ? Math.round(typed.length / minutes) : 0,
      duration: startTime ? getDurationSeconds() : 0,
      durationSeconds: getDurationSeconds(),
      errors,
      finished: isFinished,
      progress: Math.min(100, Math.round((typed.length / compareTo.length) * 100)),
      typedLength: typed.length,
      wpm: minutes > 0 ? Math.round((typed.length / 5) / minutes) : 0
    }
  }

  function addMistake(char) {
    if (char && char !== ' ' && char !== '\n') {
      mistakeChars.add(char)
      mistakeCounts.set(char, (mistakeCounts.get(char) || 0) + 1)
    }
  }

  function finish() {
    if (isFinished) return
    isFinished = true
    isRunning = false
    endTime = Date.now()
    inputEl.disabled = true
    const compareTo = getCompareChars()
    const correctChars = new Set(getTypedChars().filter((char, index) => char === compareTo[index]))
    window.OhMyType.savePracticeRecord({
      active: getActiveContent(),
      stats: getStats(),
      targetChars: getTargetChars().length,
      errors,
      correctChars,
      mistakeCounts
    })
    onChange()
    onFinish({ mistakeChars: new Set(mistakeChars), stats: getStats() })
  }

  function handleValue(value) {
    if (isFinished) return
    const targetLength = getTargetChars().length
    const previous = typedValue
    const nextValue = Array.from(value).slice(0, targetLength).join('')

    if (!isRunning && nextValue.length > 0) {
      isRunning = true
      startTime = Date.now()
    }

    typedValue = nextValue
    inputEl.value = typedValue
    const typed = getTypedChars()
    const compareTo = getCompareChars()

    if (nextValue.length > previous.length) {
      for (let i = previous.length; i < typed.length; i++) {
        attempts++
        if (typed[i] !== compareTo[i]) {
          errors++
          addMistake(compareTo[i] ?? '')
        } else {
          correctAttempts++
        }
      }
    }

    onChange()
    if (typed.length >= targetLength) finish()
  }

  function recordRejectedAttempt(expectedChar) {
    if (isFinished) return
    if (!isRunning) {
      isRunning = true
      startTime = Date.now()
    }
    attempts++
    errors++
    addMistake(expectedChar)
    onChange()
  }

  function reset() {
    typedValue = ''
    inputEl.value = ''
    inputEl.disabled = false
    isRunning = false
    isFinished = false
    startTime = 0
    endTime = 0
    errors = 0
    attempts = 0
    correctAttempts = 0
    mistakeChars = new Set()
    mistakeCounts = new Map()
    onChange()
  }

  return {
    get mistakeChars() {
      return mistakeChars
    },
    get typedValue() {
      return typedValue
    },
    get isFinished() {
      return isFinished
    },
    getStats,
    getTypedChars,
    handleValue,
    recordRejectedAttempt,
    finishNow: finish,
    reset
  }
}

Object.assign(window.OhMyType, { createTypingState })

})()
