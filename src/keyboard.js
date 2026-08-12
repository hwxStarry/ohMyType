(() => {
window.OhMyType = window.OhMyType || {}

function getKeyLabel(key) {
  const labels = {
    Backspace: '⌫',
    Tab: '⇥',
    Caps: '⇪',
    Enter: '⏎',
    Shift: '⇧',
    Space: ''
  }
  return labels[key] ?? key
}

function keyMatchesExpected(key, expected) {
  if (!expected) return false
  const normalizedExpected = expected === '\n' ? 'Enter' : expected === ' ' ? 'Space' : expected
  const shifted = {
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '_': '-',
    '+': '=',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '"': '\'',
    '<': ',',
    '>': '.',
    '?': '/',
    '~': '`'
  }
  return key.toLowerCase() === normalizedExpected.toLowerCase() || shifted[expected] === key
}

function renderKeyboard(container, expected) {
  container.innerHTML = window.OhMyType.keyboardRows.map(row => `
    <div class="key-row">
      ${row.map(key => {
        const classes = ['key']
        if (window.OhMyType.homeKeys.has(key.toLowerCase())) classes.push('home')
        if (window.OhMyType.dotKeys.has(key.toLowerCase())) classes.push('dot')
        if (keyMatchesExpected(key, expected)) classes.push('expected')
        if (key === 'Space') classes.push('space')
        if (['Backspace', 'Caps', 'Enter', 'Shift'].includes(key)) classes.push('extra-wide')
        else if (key === 'Tab') classes.push('wide')
        return `<span class="${classes.join(' ')}">${key === 'Space' ? '⌨' : window.OhMyType.escapeHtml(getKeyLabel(key))}</span>`
      }).join('')}
    </div>
  `).join('')
}

Object.assign(window.OhMyType, { renderKeyboard })

})()
