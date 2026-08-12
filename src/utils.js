(() => {
window.OhMyType = window.OhMyType || {}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function normalizeTitle(text) {
  const firstLine = text.split(/\n/).map(line => line.trim()).find(Boolean) || '自定义文本'
  return firstLine.length > 18 ? `${firstLine.slice(0, 18)}...` : firstLine
}

function summarizeBody(text) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > 24 ? `${normalized.slice(0, 24)}...` : normalized
}

function normalizePinyinInput(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ü', 'v')
    .replaceAll('Ü', 'v')
    .toLowerCase()
}

function qs(selector, root = document) {
  return root.querySelector(selector)
}

Object.assign(window.OhMyType, {
  escapeHtml,
  normalizePinyinInput,
  normalizeTitle,
  qs,
  summarizeBody
})

})()
