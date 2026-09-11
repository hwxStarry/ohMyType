(() => {
  window.OhMyType = window.OhMyType || {}

  function getPrefixLength(target, typed) {
    const targetChars = Array.from(target)
    const typedChars = Array.from(typed)
    let index = 0
    while (index < typedChars.length && typedChars[index] === targetChars[index]) index++
    return index
  }

  function getFunTypingState(candidates, typedValue) {
    const texts = candidates.map(String)
    const typedChars = Array.from(typedValue)
    const prefixLengths = texts.map(text => getPrefixLength(text, typedValue))
    const bestLength = Math.max(0, ...prefixLengths)
    const bestIndexes = texts.map((_, index) => index).filter(index => prefixLengths[index] === bestLength)
    const completedIndex = texts.findIndex(text => text === typedValue)
    const candidateStates = texts.map((text, candidateIndex) => {
      const targetChars = Array.from(text)
      return {
        text,
        prefixLength: prefixLengths[candidateIndex],
        isBest: bestIndexes.includes(candidateIndex),
        chars: targetChars.map((char, index) => ({
          char,
          status: index < typedChars.length
            ? (typedChars[index] === char ? 'correct' : 'wrong')
            : (index === typedChars.length ? 'current' : 'pending')
        }))
      }
    })
    const nextChars = [...new Set(bestIndexes
      .map(index => Array.from(texts[index])[typedChars.length])
      .filter(Boolean))]
    return { typedValue, completedIndex, bestIndexes, nextChars, candidates: candidateStates }
  }

  function getDefaultFunKeyboardOpen(viewportWidth) {
    return viewportWidth > 980
  }

  function getFunKeyboardKeys(nextChars) {
    return nextChars.filter(char => !/\p{Script=Han}/u.test(char))
  }

  Object.assign(window.OhMyType, { getDefaultFunKeyboardOpen, getFunKeyboardKeys, getFunTypingState })
})()
