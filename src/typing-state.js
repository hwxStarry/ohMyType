(() => {
window.OhMyType = window.OhMyType || {}

function createTypingState({ getActiveContent, getCompareText, inputEl, onChange, onFinish }) {
  let isRunning = false
  let isFinished = false
  let startTime = 0
  let endTime = 0
  let errors = 0
  let mistakeChars = new Set()
  let typedValue = ''

  function getTypedChars() {
    return Array.from(typedValue)
  }

  function getTargetChars() {
    return Array.from(getActiveContent().body)
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
    const correct = typed.filter((char, index) => char === compareTo[index]).length
    const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100)

    return {
      accuracy,
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
    }
  }

  function finish() {
    if (isFinished) return
    isFinished = true
    isRunning = false
    endTime = Date.now()
    inputEl.disabled = true
    window.OhMyType.savePracticeRecord({
      active: getActiveContent(),
      stats: getStats(),
      totalChars: getTargetChars().length,
      errors,
      mistakeChars
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
        if (typed[i] !== compareTo[i]) {
          errors++
          addMistake(compareTo[i] ?? '')
        }
      }
    } else if (nextValue.length < previous.length) {
      errors = typed.filter((char, index) => char !== compareTo[index]).length
    }

    onChange()
    if (typed.length >= targetLength) finish()
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
    mistakeChars = new Set()
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
    reset
  }
}

Object.assign(window.OhMyType, { createTypingState })

})()
