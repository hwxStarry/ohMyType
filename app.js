(() => {
const {
  ACTIVE_KEY,
  CATEGORIES,
  MAX_CUSTOM_LENGTH,
  SIDEBAR_KEY,
  createTypingState,
  defaultContents,
  escapeHtml,
  games,
  normalizePinyinInput,
  normalizeTitle,
  qs,
  readCustomContents,
  readOpenCategories,
  renderKeyboard,
  summarizeBody,
  writeCustomContents,
  writeOpenCategories
} = window.OhMyType

const el = {
  accuracy: qs('#accuracy'),
  againButton: qs('#againButton'),
  appShell: qs('#appShell'),
  cancelEdit: qs('#cancelEdit'),
  closeEdit: qs('#closeEdit'),
  contentList: qs('#contentList'),
  currentCategory: qs('#currentCategory'),
  currentTitle: qs('#currentTitle'),
  customCategory: qs('#customCategory'),
  customCounter: qs('#customCounter'),
  customText: qs('#customText'),
  customTitle: qs('#customTitle'),
  duration: qs('#duration'),
  editButton: qs('#editButton'),
  editorDialog: qs('#editorDialog'),
  expectedInfo: qs('#expectedInfo'),
  gameLinks: qs('#gameLinks'),
  gamesTab: qs('#gamesTab'),
  gamesView: qs('#gamesView'),
  mobileSidebarToggle: qs('#mobileSidebarToggle'),
  positionInfo: qs('#positionInfo'),
  practiceView: qs('#practiceView'),
  progress: qs('#progress'),
  progressBar: qs('#progressBar'),
  resetButton: qs('#resetButton'),
  resultAccuracy: qs('#resultAccuracy'),
  resultCpm: qs('#resultCpm'),
  resultDuration: qs('#resultDuration'),
  resultMeta: qs('#resultMeta'),
  resultModal: qs('#resultModal'),
  resultSubtitle: qs('#resultSubtitle'),
  resultTitle: qs('#resultTitle'),
  resultWpm: qs('#resultWpm'),
  reviewMistakesButton: qs('#reviewMistakesButton'),
  sidebarToggle: qs('#sidebarToggle'),
  textSection: qs('#textSection'),
  typingInput: qs('#typingInput'),
  typingText: qs('#typingText'),
  virtualKeyboard: qs('#virtualKeyboard'),
  wpm: qs('#wpm')
}

let activeId = localStorage.getItem(ACTIVE_KEY) || defaultContents[0].id
let activeView = 'practice'
let durationTimer = 0

if (localStorage.getItem(SIDEBAR_KEY) === '1') {
  el.appShell.classList.add('sidebar-collapsed')
}

function getContents() {
  return [...defaultContents, ...readCustomContents()]
}

function getActiveContent() {
  return getContents().find(item => item.id === activeId) || defaultContents[0]
}

function isPinyinContent() {
  return getActiveContent().category === '拼音'
}

function getCompareText() {
  const target = getActiveContent().body
  return isPinyinContent() ? normalizePinyinInput(target) : target
}

function getExpectedKey() {
  return Array.from(getCompareText())[typing.getTypedChars().length] || ''
}

const typing = createTypingState({
  getActiveContent,
  getCompareText,
  inputEl: el.typingInput,
  onChange: updatePracticeDisplay,
  onFinish: showResult
})

function renderContentList() {
  const contents = getContents()
  const openCategories = readOpenCategories()
  const grouped = CATEGORIES.map(category => ({
    category,
    items: contents.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)

  el.contentList.innerHTML = grouped.map(group => {
    const isOpen = openCategories.has(group.category)
    return `
      <section class="category-group">
        <button class="category-toggle" type="button" data-category="${escapeHtml(group.category)}" aria-expanded="${isOpen}">
          <span>${isOpen ? '⌄' : '›'}</span>
          <strong>${escapeHtml(group.category)}</strong>
          <small>${group.items.length}</small>
        </button>
        <div class="category-items" ${isOpen ? '' : 'hidden'}>
          ${group.items.map(item => renderContentItem(item)).join('')}
        </div>
      </section>
    `
  }).join('')

  bindContentListEvents()
  el.gamesTab.classList.toggle('active', activeView === 'games')
}

function renderContentItem(item) {
  return `
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
  `
}

function bindContentListEvents() {
  el.contentList.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category
      const nextOpen = readOpenCategories()
      if (nextOpen.has(category)) nextOpen.delete(category)
      else nextOpen.add(category)
      writeOpenCategories(nextOpen)
      renderContentList()
    })
  })

  el.contentList.querySelectorAll('.content-item').forEach(button => {
    button.addEventListener('click', () => selectContent(button.dataset.id))
  })

  el.contentList.querySelectorAll('.delete-content').forEach(button => {
    bindActionButton(button, event => removeCustomContent(event, button.dataset.deleteId))
  })

  el.contentList.querySelectorAll('.edit-content').forEach(button => {
    bindActionButton(button, event => editCustomContent(event, button.dataset.editId))
  })
}

function bindActionButton(button, handler) {
  button.addEventListener('click', handler)
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') handler(event)
  })
}

function selectContent(id) {
  activeView = 'practice'
  activeId = id
  localStorage.setItem(ACTIVE_KEY, activeId)
  typing.reset()
  render()
  focusTypingInput()
}

function removeCustomContent(event, id) {
  event.preventDefault()
  event.stopPropagation()
  writeCustomContents(readCustomContents().filter(item => item.id !== id))
  if (activeId === id) {
    activeId = defaultContents[0].id
    localStorage.setItem(ACTIVE_KEY, activeId)
    typing.reset()
  }
  activeView = 'practice'
  render()
  focusTypingInput()
}

function editCustomContent(event, id) {
  event.preventDefault()
  event.stopPropagation()
  const item = getContents().find(content => content.id === id)
  if (!item) return
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  typing.reset()
  render()
  openEditor(item)
}

function renderTypingText() {
  const chars = Array.from(getCompareText())
  const typedChars = typing.getTypedChars()

  el.typingText.innerHTML = chars.map((char, index) => {
    if (char === '\n') {
      let className = 'char newline'
      if (index < typedChars.length) className += typedChars[index] === char ? ' correct' : ' wrong'
      if (index === typedChars.length) className += ' current'
      return `<span class="${className}"></span>`
    }

    let className = 'char'
    if (index < typedChars.length) className += typedChars[index] === char ? ' correct' : ' wrong'
    else if (index === typedChars.length) className += ' current'
    return `<span class="${className}">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`
  }).join('')
}

function updatePracticeDisplay() {
  const target = Array.from(getCompareText())
  const stats = typing.getStats()
  const position = Math.min(stats.typedLength + 1, target.length)
  const expected = getExpectedKey()

  renderTypingText()
  el.wpm.textContent = String(Number.isFinite(stats.wpm) ? stats.wpm : 0)
  el.accuracy.textContent = `${stats.accuracy}%`
  el.duration.textContent = String(stats.duration)
  el.progress.textContent = `${stats.progress}%`
  el.progressBar.style.width = `${stats.progress}%`
  el.positionInfo.textContent = `第 ${position} / ${target.length} 字`
  el.expectedInfo.textContent = expected ? `下一键 ${formatExpectedKey(expected)}` : '已完成'
  renderKeyboard(el.virtualKeyboard, expected)
  scrollCurrentIntoView()
}

function formatExpectedKey(key) {
  if (key === ' ') return 'Space'
  if (key === '\n') return 'Enter'
  return key
}

function scrollCurrentIntoView() {
  const current = el.typingText.querySelector('.char.current')
  if (!current) return
  const sectionRect = el.textSection.getBoundingClientRect()
  const charRect = current.getBoundingClientRect()
  if (charRect.bottom > sectionRect.bottom - 24) {
    el.textSection.scrollBy({ top: charRect.bottom - sectionRect.bottom + 60, behavior: 'smooth' })
  } else if (charRect.top < sectionRect.top + 24) {
    el.textSection.scrollBy({ top: charRect.top - sectionRect.top - 60, behavior: 'smooth' })
  }
}

function renderPractice() {
  const active = getActiveContent()
  el.practiceView.hidden = false
  el.gamesView.hidden = true
  el.currentCategory.textContent = active.category
  el.currentTitle.textContent = active.title
  updatePracticeDisplay()
  requestAnimationFrame(focusTypingInput)
}

function renderGames() {
  el.practiceView.hidden = true
  el.gamesView.hidden = false
  el.currentCategory.textContent = '游戏'
  el.currentTitle.textContent = '打字游戏'
  el.gameLinks.innerHTML = games.map(game => `
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
  if (activeView === 'games') renderGames()
  else renderPractice()
}

function focusTypingInput() {
  if (activeView !== 'practice' || el.editorDialog.open || typing.isFinished) return
  el.typingInput.focus({ preventScroll: true })
}

function updateCustomCounter() {
  const length = Array.from(el.customText.value).length
  el.customCounter.textContent = `${length} / ${MAX_CUSTOM_LENGTH}`
  el.customCounter.classList.toggle('over-limit', length > MAX_CUSTOM_LENGTH)
}

function openEditor(item = getActiveContent()) {
  el.customTitle.value = item.isCustom ? item.title : ''
  el.customCategory.value = CATEGORIES.includes(item.category) ? item.category : '文章'
  el.customText.value = Array.from(item.body).slice(0, MAX_CUSTOM_LENGTH).join('')
  updateCustomCounter()
  el.editorDialog.showModal()
  el.customText.focus()
}

function saveEditorContent() {
  const body = Array.from(el.customText.value.trim()).slice(0, MAX_CUSTOM_LENGTH).join('')
  if (!body) return

  const title = (el.customTitle.value.trim() || normalizeTitle(body)).slice(0, 24)
  const category = CATEGORIES.includes(el.customCategory.value) ? el.customCategory.value : '文章'
  const customItems = readCustomContents()
  const existingIndex = customItems.findIndex(item => item.id === activeId)
  const item = {
    id: existingIndex >= 0 ? activeId : `custom-${Date.now()}`,
    title,
    category,
    isCustom: true,
    body
  }

  if (existingIndex >= 0) customItems[existingIndex] = item
  else customItems.unshift(item)

  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  el.editorDialog.close()
  typing.reset()
  render()
  focusTypingInput()
}

function showResult() {
  const active = getActiveContent()
  const stats = typing.getStats()
  el.resultTitle.textContent = '练习完成'
  el.resultSubtitle.textContent = active.title
  el.resultWpm.textContent = String(stats.wpm)
  el.resultAccuracy.textContent = `${stats.accuracy}%`
  el.resultCpm.textContent = String(stats.cpm)
  el.resultDuration.textContent = `${stats.durationSeconds}s`
  el.resultMeta.textContent = `总字符 ${Array.from(active.body).length} · 错误 ${stats.errors}`
  el.reviewMistakesButton.hidden = stats.errors <= 0
  el.resultModal.hidden = false
}

function createMistakeReview() {
  el.resultModal.hidden = true
  const reviewText = [...typing.mistakeChars].join('')
  if (!reviewText) return
  const customItems = readCustomContents()
  const item = {
    id: `review-${Date.now()}`,
    title: '错字复习',
    category: '文章',
    isCustom: true,
    body: reviewText
  }
  customItems.unshift(item)
  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  typing.reset()
  render()
}

function bindEvents() {
  el.typingInput.addEventListener('input', () => {
    if (el.typingInput.dataset.composing === '1') return
    typing.handleValue(isPinyinContent() ? normalizePinyinInput(el.typingInput.value) : el.typingInput.value)
  })

  el.typingInput.addEventListener('keydown', event => {
    if (!isPinyinContent() || event.isComposing) return
    if (event.key === 'Backspace') {
      event.preventDefault()
      typing.handleValue(typing.getTypedChars().slice(0, -1).join(''))
      return
    }
    if (event.key === 'Enter' && getExpectedKey() === '\n') {
      event.preventDefault()
      typing.handleValue(`${typing.typedValue}\n`)
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      typing.handleValue(typing.typedValue + normalizePinyinInput(event.key))
    }
  })

  el.typingInput.addEventListener('compositionstart', () => {
    el.typingInput.dataset.composing = '1'
  })

  el.typingInput.addEventListener('compositionend', () => {
    el.typingInput.dataset.composing = ''
    if (isPinyinContent()) {
      el.typingInput.value = typing.typedValue
      return
    }
    typing.handleValue(el.typingInput.value)
  })

  el.typingInput.addEventListener('blur', () => setTimeout(focusTypingInput, 0))
  el.textSection.addEventListener('click', focusTypingInput)
  el.textSection.addEventListener('focus', focusTypingInput)

  el.resetButton.addEventListener('click', () => {
    activeView = 'practice'
    typing.reset()
    render()
    focusTypingInput()
  })
  el.editButton.addEventListener('click', () => openEditor())
  el.customText.addEventListener('input', () => {
    const chars = Array.from(el.customText.value)
    if (chars.length > MAX_CUSTOM_LENGTH) {
      el.customText.value = chars.slice(0, MAX_CUSTOM_LENGTH).join('')
    }
    updateCustomCounter()
  })
  el.cancelEdit.addEventListener('click', () => el.editorDialog.close())
  el.closeEdit.addEventListener('click', () => el.editorDialog.close())
  el.editorDialog.addEventListener('submit', event => {
    event.preventDefault()
    saveEditorContent()
  })

  el.gamesTab.addEventListener('click', () => {
    activeView = 'games'
    render()
  })
  el.sidebarToggle.addEventListener('click', () => {
    const collapsed = el.appShell.classList.toggle('sidebar-collapsed')
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
    focusTypingInput()
  })
  el.mobileSidebarToggle.addEventListener('click', () => {
    el.appShell.classList.toggle('sidebar-open')
  })
  document.addEventListener('click', event => {
    if (!el.appShell.classList.contains('sidebar-open')) return
    if (event.target.closest('.sidebar') || event.target.closest('#mobileSidebarToggle')) return
    el.appShell.classList.remove('sidebar-open')
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && el.appShell.classList.contains('sidebar-open')) {
      el.appShell.classList.remove('sidebar-open')
    }
  })

  el.againButton.addEventListener('click', () => {
    typing.reset()
    render()
    focusTypingInput()
  })
  el.reviewMistakesButton.addEventListener('click', createMistakeReview)
}

bindEvents()
render()
durationTimer = window.setInterval(() => {
  if (activeView === 'practice' && !typing.isFinished) updatePracticeDisplay()
}, 1000)

})()
