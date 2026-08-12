const CUSTOM_KEY = 'ohmytype_custom_contents'
const ACTIVE_KEY = 'ohmytype_active_content'
const SIDEBAR_KEY = 'ohmytype_sidebar_collapsed'
const HISTORY_KEY = 'typestart_history'
const MISTAKE_KEY = 'typestart_mistakes'
const CATEGORY_KEY = 'ohmytype_open_categories'
const MAX_CUSTOM_LENGTH = 745
const CATEGORIES = ['拼音', '诗词', '文章', '文言文', '英语']

const defaultContents = [
  {
    id: 'pinyin-basic',
    title: '拼音入门',
    category: '拼音',
    body: 'ba bo bi bu pa po pi pu ma mo mi mu fa fo fu\nda de di du ta te ti tu na ne ni nu la le li lu'
  },
  {
    id: 'poem-jingyesi',
    title: '静夜思',
    category: '诗词',
    body: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'
  },
  {
    id: 'poem-chunxiao',
    title: '春晓',
    category: '诗词',
    body: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。'
  },
  {
    id: 'poem-dengguanquelou',
    title: '登鹳雀楼',
    category: '诗词',
    body: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。'
  },
  {
    id: 'article-spring',
    title: '春日短章',
    category: '文章',
    body: '清晨的风从窗外进来，带着一点湿润的草木气息。案上的书页轻轻翻动，像有人在提醒我，今天也该慢慢写下几行字。'
  },
  {
    id: 'article-focus',
    title: '专注练习',
    category: '文章',
    body: '打字不是单纯追求速度。稳定的节奏、准确的落键、放松的肩背，都会在一次次练习里变成真正可靠的能力。'
  }
]

const games = [
  {
    title: 'Monkeytype',
    description: '高自定义打字测试网站，支持多模式、实时 WPM、准确率、主题和账户历史。',
    href: 'https://github.com/monkeytypegame/monkeytype'
  },
  {
    title: 'TypeWords',
    description: '中文开发者维护的开源单词与文章练习工具，覆盖背词、文章默写和错词复习。',
    href: 'https://github.com/zyronon/TypeWords'
  },
  {
    title: 'Word Hopper',
    description: '浏览器横版跳跃打字游戏，输入障碍物上的单词并把握空格跳跃时机。',
    href: 'https://github.com/WingEdge777/wordhopper'
  },
  {
    title: 'GuerillaType',
    description: '自托管打字训练站，含课程、练习、挑战、公开文本库和本地统计。',
    href: 'https://github.com/jonajinga/GuerillaType'
  },
  {
    title: 'CodeType',
    description: '面向开发者的 VS Code 打字游戏，使用真实代码片段训练符号和缩进。',
    href: 'https://codetype.ai/'
  },
  {
    title: 'Tux Typing',
    description: '经典 GPL 开源儿童打字游戏，包含 Fish Cascade 和 Comet Zap 等街机模式。',
    href: 'https://tuxtyping.org/'
  }
]

const contentList = document.querySelector('#contentList')
const appShell = document.querySelector('#appShell')
const sidebarToggle = document.querySelector('#sidebarToggle')
const mobileSidebarToggle = document.querySelector('#mobileSidebarToggle')
const gamesTab = document.querySelector('#gamesTab')
const practiceView = document.querySelector('#practiceView')
const gamesView = document.querySelector('#gamesView')
const currentCategory = document.querySelector('#currentCategory')
const currentTitle = document.querySelector('#currentTitle')
const textSection = document.querySelector('#textSection')
const typingText = document.querySelector('#typingText')
const typingInput = document.querySelector('#typingInput')
const wpmEl = document.querySelector('#wpm')
const accuracyEl = document.querySelector('#accuracy')
const durationEl = document.querySelector('#duration')
const progressEl = document.querySelector('#progress')
const progressBar = document.querySelector('#progressBar')
const positionInfo = document.querySelector('#positionInfo')
const expectedInfo = document.querySelector('#expectedInfo')
const virtualKeyboard = document.querySelector('#virtualKeyboard')
const resultModal = document.querySelector('#resultModal')
const resultTitle = document.querySelector('#resultTitle')
const resultSubtitle = document.querySelector('#resultSubtitle')
const resultWpm = document.querySelector('#resultWpm')
const resultAccuracy = document.querySelector('#resultAccuracy')
const resultCpm = document.querySelector('#resultCpm')
const resultDuration = document.querySelector('#resultDuration')
const resultMeta = document.querySelector('#resultMeta')
const reviewMistakesButton = document.querySelector('#reviewMistakesButton')
const againButton = document.querySelector('#againButton')
const resetButton = document.querySelector('#resetButton')
const editButton = document.querySelector('#editButton')
const editorDialog = document.querySelector('#editorDialog')
const customTitle = document.querySelector('#customTitle')
const customCategory = document.querySelector('#customCategory')
const customText = document.querySelector('#customText')
const customCounter = document.querySelector('#customCounter')
const cancelEdit = document.querySelector('#cancelEdit')
const closeEdit = document.querySelector('#closeEdit')
const gameLinks = document.querySelector('#gameLinks')

let activeId = localStorage.getItem(ACTIVE_KEY) || defaultContents[0].id
let activeView = 'practice'
let isRunning = false
let isFinished = false
let startTime = 0
let endTime = 0
let errors = 0
let mistakeChars = new Set()
let typedValue = ''
let durationTimer = 0

const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
]
const homeKeys = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'])
const dotKeys = new Set(['f', 'j'])

if (localStorage.getItem(SIDEBAR_KEY) === '1') {
  appShell.classList.add('sidebar-collapsed')
}

function readCustomContents() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]').map(item => ({
      ...item,
      category: CATEGORIES.includes(item.category) ? item.category : '文章',
      isCustom: true
    }))
  } catch {
    return []
  }
}

function writeCustomContents(items) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(items))
}

function readOpenCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_KEY)
    if (!raw) return new Set(CATEGORIES)
    return new Set(JSON.parse(raw))
  } catch {
    return new Set(CATEGORIES)
  }
}

function writeOpenCategories(categories) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify([...categories]))
}

function getContents() {
  return [...defaultContents, ...readCustomContents()]
}

function getActiveContent() {
  return getContents().find(item => item.id === activeId) || defaultContents[0]
}

function normalizeTitle(text) {
  const firstLine = text.split(/\n/).map(line => line.trim()).find(Boolean) || '自定义文本'
  return firstLine.length > 18 ? `${firstLine.slice(0, 18)}...` : firstLine
}

function summarizeBody(text) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > 24 ? `${normalized.slice(0, 24)}...` : normalized
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function getTypedChars() {
  return Array.from(typedValue)
}

function getTargetChars() {
  return Array.from(getActiveContent().body)
}

function getExpectedKey() {
  const chars = Array.from(getCompareText())
  return chars[getTypedChars().length] || ''
}

function isPinyinContent() {
  return getActiveContent().category === '拼音'
}

function normalizePinyinInput(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ü', 'v')
    .replaceAll('Ü', 'v')
    .toLowerCase()
}

function getCompareText() {
  const target = getActiveContent().body
  return isPinyinContent() ? normalizePinyinInput(target) : target
}

function getDurationMs() {
  if (!startTime) return 0
  return (isFinished ? endTime : Date.now()) - startTime
}

function getDurationSeconds() {
  return Math.max(1, Math.round(getDurationMs() / 1000))
}

function getWpm() {
  const minutes = getDurationMs() / 60000
  if (minutes <= 0) return 0
  return Math.round((getTypedChars().length / 5) / minutes)
}

function getCpm() {
  const minutes = getDurationMs() / 60000
  if (minutes <= 0) return 0
  return Math.round(getTypedChars().length / minutes)
}

function getAccuracy() {
  const typed = getTypedChars()
  if (typed.length === 0) return 100
  const compareTo = Array.from(getCompareText())
  const correct = typed.filter((char, index) => char === compareTo[index]).length
  return Math.round((correct / typed.length) * 100)
}

function addMistake(char) {
  if (char && char !== ' ' && char !== '\n') {
    mistakeChars.add(char)
  }
}

function saveToHistory() {
  try {
    const allMistakes = JSON.parse(localStorage.getItem(MISTAKE_KEY) || '{}')
    mistakeChars.forEach(char => {
      allMistakes[char] = (allMistakes[char] || 0) + 1
    })
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(allMistakes))

    const active = getActiveContent()
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    history.push({
      date: new Date().toISOString(),
      lessonTitle: active.title,
      courseSlug: active.category,
      wpm: getWpm(),
      cpm: getCpm(),
      accuracy: getAccuracy(),
      duration: getDurationSeconds(),
      totalChars: getTargetChars().length,
      errors,
      mistakes: JSON.stringify([...mistakeChars])
    })
    if (history.length > 100) history.shift()
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // localStorage can be unavailable in private browsing modes.
  }
}

function finishTyping() {
  if (isFinished) return
  isFinished = true
  isRunning = false
  endTime = Date.now()
  typingInput.disabled = true
  saveToHistory()
  updateStats()
  showResult()
}

function handleTypedValue(value) {
  if (isFinished) return
  const targetLength = getTargetChars().length
  const previous = typedValue
  const nextValue = Array.from(value).slice(0, targetLength).join('')

  if (!isRunning && nextValue.length > 0) {
    isRunning = true
    startTime = Date.now()
  }

  typedValue = nextValue
  typingInput.value = typedValue
  const typed = getTypedChars()
  const compareTo = Array.from(getCompareText())

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

  renderTypingText()
  updateStats()

  if (typed.length >= targetLength) {
    finishTyping()
  }
}

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

function renderContentList() {
  const contents = getContents()
  const openCategories = readOpenCategories()
  const grouped = CATEGORIES.map(category => ({
    category,
    items: contents.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)

  contentList.innerHTML = grouped.map(group => {
    const isOpen = openCategories.has(group.category)
    return `
      <section class="category-group">
        <button class="category-toggle" type="button" data-category="${escapeHtml(group.category)}" aria-expanded="${isOpen}">
          <span>${isOpen ? '⌄' : '›'}</span>
          <strong>${escapeHtml(group.category)}</strong>
          <small>${group.items.length}</small>
        </button>
        <div class="category-items" ${isOpen ? '' : 'hidden'}>
          ${group.items.map(item => `
            <button class="content-item ${item.id === activeId && activeView === 'practice' ? 'active' : ''}" type="button" data-id="${item.id}">
              <span class="content-main">
                <strong>${escapeHtml(item.title)}</strong>
                ${item.isCustom ? `
                  <span class="content-actions">
                    <span class="edit-content" role="button" tabindex="0" data-edit-id="${item.id}" aria-label="编辑 ${escapeHtml(item.title)}" title="编辑">✎</span>
                    <span class="delete-content" role="button" tabindex="0" data-delete-id="${item.id}" aria-label="删除 ${escapeHtml(item.title)}" title="删除">×</span>
                  </span>
                ` : ''}
              </span>
              <small>${item.body.length} 字符</small>
              <em>${escapeHtml(summarizeBody(item.body))}</em>
            </button>
          `).join('')}
        </div>
      </section>
    `
  }).join('')

  contentList.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category
      const nextOpen = readOpenCategories()
      if (nextOpen.has(category)) nextOpen.delete(category)
      else nextOpen.add(category)
      writeOpenCategories(nextOpen)
      renderContentList()
    })
  })

  contentList.querySelectorAll('.content-item').forEach(button => {
    button.addEventListener('click', () => {
      activeView = 'practice'
      activeId = button.dataset.id
      localStorage.setItem(ACTIVE_KEY, activeId)
      resetTyping()
      render()
      typingInput.focus()
    })
  })

  contentList.querySelectorAll('.delete-content').forEach(button => {
    function removeItem(event) {
      event.preventDefault()
      event.stopPropagation()
      const id = button.dataset.deleteId
      const nextItems = readCustomContents().filter(item => item.id !== id)
      writeCustomContents(nextItems)
      if (activeId === id) {
        activeId = defaultContents[0].id
        localStorage.setItem(ACTIVE_KEY, activeId)
        resetTyping()
      }
      activeView = 'practice'
      render()
      focusTypingInput()
    }

    button.addEventListener('click', removeItem)
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') removeItem(event)
    })
  })

  contentList.querySelectorAll('.edit-content').forEach(button => {
    function editItem(event) {
      event.preventDefault()
      event.stopPropagation()
      const item = getContents().find(content => content.id === button.dataset.editId)
      if (!item) return
      activeId = item.id
      activeView = 'practice'
      localStorage.setItem(ACTIVE_KEY, activeId)
      resetTyping()
      render()
      openEditor(item)
    }

    button.addEventListener('click', editItem)
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') editItem(event)
    })
  })

  gamesTab.classList.toggle('active', activeView === 'games')
}

function updateCustomCounter() {
  const length = Array.from(customText.value).length
  customCounter.textContent = `${length} / ${MAX_CUSTOM_LENGTH}`
  customCounter.classList.toggle('over-limit', length > MAX_CUSTOM_LENGTH)
}

function renderTypingText() {
  const chars = Array.from(getCompareText())
  const typedChars = getTypedChars()

  typingText.innerHTML = chars.map((char, index) => {
    if (char === '\n') {
      let className = 'char newline'
      if (index < typedChars.length) className += typedChars[index] === char ? ' correct' : ' wrong'
      if (index === typedChars.length) className += ' current'
      return `<span class="${className}"></span>`
    }
    let className = 'char'
    if (index < typedChars.length) {
      className += typedChars[index] === char ? ' correct' : ' wrong'
    } else if (index === typedChars.length) {
      className += ' current'
    }
    return `<span class="${className}">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`
  }).join('')
}

function updateStats() {
  const target = Array.from(getCompareText())
  const typed = getTypedChars().slice(0, target.length)
  const accuracy = getAccuracy()
  const progress = Math.min(100, Math.round((typed.length / target.length) * 100))
  const wpm = getWpm()
  const duration = startTime ? getDurationSeconds() : 0
  const position = Math.min(typed.length + 1, target.length)

  wpmEl.textContent = String(Number.isFinite(wpm) ? wpm : 0)
  accuracyEl.textContent = `${accuracy}%`
  durationEl.textContent = String(duration)
  progressEl.textContent = `${progress}%`
  progressBar.style.width = `${progress}%`
  positionInfo.textContent = `第 ${position} / ${target.length} 字`
  expectedInfo.textContent = getExpectedKey() ? `下一键 ${getExpectedKey() === ' ' ? 'Space' : getExpectedKey() === '\n' ? 'Enter' : getExpectedKey()}` : '已完成'
  renderKeyboard()
  scrollCurrentIntoView()
}

function resetTyping() {
  typedValue = ''
  typingInput.value = ''
  typingInput.disabled = false
  isRunning = false
  isFinished = false
  startTime = 0
  endTime = 0
  errors = 0
  mistakeChars = new Set()
  resultModal.hidden = true
  renderTypingText()
  updateStats()
}

function showResult() {
  const active = getActiveContent()
  resultTitle.textContent = '练习完成'
  resultSubtitle.textContent = active.title
  resultWpm.textContent = String(getWpm())
  resultAccuracy.textContent = `${getAccuracy()}%`
  resultCpm.textContent = String(getCpm())
  resultDuration.textContent = `${getDurationSeconds()}s`
  resultMeta.textContent = `总字符 ${getTargetChars().length} · 错误 ${errors}`
  reviewMistakesButton.hidden = errors <= 0
  resultModal.hidden = false
}

function scrollCurrentIntoView() {
  const current = typingText.querySelector('.char.current')
  if (!current) return
  const sectionRect = textSection.getBoundingClientRect()
  const charRect = current.getBoundingClientRect()
  if (charRect.bottom > sectionRect.bottom - 24) {
    textSection.scrollBy({ top: charRect.bottom - sectionRect.bottom + 60, behavior: 'smooth' })
  } else if (charRect.top < sectionRect.top + 24) {
    textSection.scrollBy({ top: charRect.top - sectionRect.top - 60, behavior: 'smooth' })
  }
}

function renderKeyboard() {
  const expected = getExpectedKey()
  virtualKeyboard.innerHTML = keyboardRows.map(row => `
    <div class="key-row">
      ${row.map(key => {
        const classes = ['key']
        if (homeKeys.has(key.toLowerCase())) classes.push('home')
        if (dotKeys.has(key.toLowerCase())) classes.push('dot')
        if (keyMatchesExpected(key, expected)) classes.push('expected')
        if (key === 'Space') classes.push('space')
        if (['Backspace', 'Caps', 'Enter', 'Shift'].includes(key)) classes.push('extra-wide')
        else if (['Tab'].includes(key)) classes.push('wide')
        return `<span class="${classes.join(' ')}">${key === 'Space' ? '⌨' : escapeHtml(getKeyLabel(key))}</span>`
      }).join('')}
    </div>
  `).join('')
}

function focusTypingInput() {
  if (activeView !== 'practice' || editorDialog.open || isFinished) return
  typingInput.focus({ preventScroll: true })
}

function openEditor(item = getActiveContent()) {
  customTitle.value = item.isCustom ? item.title : ''
  customCategory.value = CATEGORIES.includes(item.category) ? item.category : '文章'
  customText.value = Array.from(item.body).slice(0, MAX_CUSTOM_LENGTH).join('')
  updateCustomCounter()
  editorDialog.showModal()
  customText.focus()
}

function renderPractice() {
  const active = getActiveContent()
  practiceView.hidden = false
  gamesView.hidden = true
  currentCategory.textContent = active.category
  currentTitle.textContent = active.title
  renderTypingText()
  updateStats()
  requestAnimationFrame(focusTypingInput)
}

function renderGames() {
  practiceView.hidden = true
  gamesView.hidden = false
  currentCategory.textContent = '游戏'
  currentTitle.textContent = '打字游戏'
  gameLinks.innerHTML = games.map(game => `
    <a class="game-card" href="${game.href}">
      <div>
        <h3>${escapeHtml(game.title)}</h3>
        <p>${escapeHtml(game.description)}</p>
      </div>
      <span>打开项目</span>
    </a>
  `).join('')
}

function render() {
  renderContentList()
  if (activeView === 'games') {
    renderGames()
  } else {
    renderPractice()
  }
}

typingInput.addEventListener('input', () => {
  if (typingInput.dataset.composing === '1') return
  if (isPinyinContent()) {
    handleTypedValue(normalizePinyinInput(typingInput.value))
  } else {
    handleTypedValue(typingInput.value)
  }
})

typingInput.addEventListener('keydown', event => {
  if (!isPinyinContent() || event.isComposing) return

  if (event.key === 'Backspace') {
    event.preventDefault()
    handleTypedValue(getTypedChars().slice(0, -1).join(''))
    return
  }

  if (event.key === 'Enter' && getExpectedKey() === '\n') {
    event.preventDefault()
    handleTypedValue(`${typingInput.value}\n`)
    return
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    handleTypedValue(typingInput.value + normalizePinyinInput(event.key))
  }
})

typingInput.addEventListener('compositionstart', () => {
  typingInput.dataset.composing = '1'
})

typingInput.addEventListener('compositionend', () => {
  typingInput.dataset.composing = ''
  if (isPinyinContent()) {
    typingInput.value = typedValue
    return
  }
  handleTypedValue(typingInput.value)
})

typingInput.addEventListener('blur', () => {
  setTimeout(focusTypingInput, 0)
})

textSection.addEventListener('click', focusTypingInput)
textSection.addEventListener('focus', focusTypingInput)

resetButton.addEventListener('click', () => {
  activeView = 'practice'
  resetTyping()
  render()
  typingInput.focus()
})

editButton.addEventListener('click', () => {
  openEditor()
})

customText.addEventListener('input', () => {
  const chars = Array.from(customText.value)
  if (chars.length > MAX_CUSTOM_LENGTH) {
    customText.value = chars.slice(0, MAX_CUSTOM_LENGTH).join('')
  }
  updateCustomCounter()
})

cancelEdit.addEventListener('click', () => {
  editorDialog.close()
})

closeEdit.addEventListener('click', () => {
  editorDialog.close()
})

editorDialog.addEventListener('submit', event => {
  event.preventDefault()
  const body = Array.from(customText.value.trim()).slice(0, MAX_CUSTOM_LENGTH).join('')
  if (!body) return

  const title = (customTitle.value.trim() || normalizeTitle(body)).slice(0, 24)
  const category = CATEGORIES.includes(customCategory.value) ? customCategory.value : '文章'
  const customItems = readCustomContents()
  const existingIndex = customItems.findIndex(item => item.id === activeId)
  const item = {
    id: existingIndex >= 0 ? activeId : `custom-${Date.now()}`,
    title,
    category,
    isCustom: true,
    body
  }

  if (existingIndex >= 0) {
    customItems[existingIndex] = item
  } else {
    customItems.unshift(item)
  }

  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  editorDialog.close()
  resetTyping()
  render()
  typingInput.focus()
})

gamesTab.addEventListener('click', () => {
  activeView = 'games'
  render()
})

sidebarToggle.addEventListener('click', () => {
  const collapsed = appShell.classList.toggle('sidebar-collapsed')
  localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
  focusTypingInput()
})

mobileSidebarToggle.addEventListener('click', () => {
  appShell.classList.toggle('sidebar-open')
})

document.addEventListener('click', event => {
  if (!appShell.classList.contains('sidebar-open')) return
  if (event.target.closest('.sidebar') || event.target.closest('#mobileSidebarToggle')) return
  appShell.classList.remove('sidebar-open')
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && appShell.classList.contains('sidebar-open')) {
    appShell.classList.remove('sidebar-open')
  }
})

durationTimer = window.setInterval(() => {
  if (startTime && activeView === 'practice' && !isFinished) updateStats()
}, 1000)

againButton.addEventListener('click', () => {
  resetTyping()
  render()
  focusTypingInput()
})

reviewMistakesButton.addEventListener('click', () => {
  resultModal.hidden = true
  const reviewText = [...mistakeChars].join('')
  if (!reviewText) return
  const customItems = readCustomContents()
  const item = {
    id: `review-${Date.now()}`,
    title: '错字复习',
    category: '自定义',
    body: reviewText
  }
  customItems.unshift(item)
  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  resetTyping()
  render()
})

render()
