(() => {
  window.OhMyType = window.OhMyType || {}

  function createDetectiveState(caseItem) {
    let phase = 'intro'
    let statementIndex = 0
    let clues = []
    let wrongAttempts = 0

    function start() {
      if (phase === 'intro') phase = 'statement'
    }

    function completeStatement() {
      if (phase !== 'statement') return
      clues.push(caseItem.statements[statementIndex].clue)
      statementIndex++
      if (statementIndex === caseItem.statements.length) phase = 'accusation'
    }

    function submitAnswer(value) {
      if (phase !== 'accusation') return false
      const answer = String(value).trim()
      if (!answer) return false
      if (caseItem.acceptedAnswers.includes(answer)) {
        phase = 'result'
        return true
      }
      wrongAttempts++
      return false
    }

    function reset() {
      phase = 'intro'
      statementIndex = 0
      clues = []
      wrongAttempts = 0
    }

    function getState() {
      return { phase, statementIndex, clues: [...clues], wrongAttempts }
    }

    return { start, completeStatement, submitAnswer, reset, getState }
  }

  Object.assign(window.OhMyType, { createDetectiveState })
})()
