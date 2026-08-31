(() => {
const {
  ACTIVE_KEY,
  CATEGORIES,
  MAX_CUSTOM_LENGTH,
  MODE_KEY,
  PRACTICE_MODES,
  SIDEBAR_KEY,
  completionSounds,
  createCompletionAudio,
  createTypingState,
  defaultContents,
  escapeHtml,
  games,
  getPinyin,
  getWordTranslations,
  normalizePinyinInput,
  normalizeTitle,
  qs,
  readCustomContents,
  readMistakes,
  readOpenCategories,
  readPracticeHistory,
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
  cancelSound: qs('#cancelSound'),
  closeEdit: qs('#closeEdit'),
  closeSound: qs('#closeSound'),
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
  gamesCount: qs('#gamesCount'),
  gamesTab: qs('#gamesTab'),
  gamesView: qs('#gamesView'),
  historyCount: qs('#historyCount'),
  historyList: qs('#historyList'),
  historySummary: qs('#historySummary'),
  historyTab: qs('#historyTab'),
  historyView: qs('#historyView'),
  mistakeCount: qs('#mistakeCount'),
  mobileSidebarToggle: qs('#mobileSidebarToggle'),
  positionInfo: qs('#positionInfo'),
  practiceView: qs('#practiceView'),
  practiceMode: qs('#practiceMode'),
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
  soundButton: qs('#soundButton'),
  soundDialog: qs('#soundDialog'),
  soundPreset: qs('#soundPreset'),
  soundUrl: qs('#soundUrl'),
  textSection: qs('#textSection'),
  testSound: qs('#testSound'),
  typingInput: qs('#typingInput'),
  typingText: qs('#typingText'),
  virtualKeyboard: qs('#virtualKeyboard'),
  weakReviewTab: qs('#weakReviewTab'),
  wpm: qs('#wpm')
}

let activeId = localStorage.getItem(ACTIVE_KEY) || defaultContents[0].id
let activeView = 'practice'
let durationTimer = 0
let practiceMode = localStorage.getItem(MODE_KEY) || 'free'
const completionAudio = createCompletionAudio()

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

function isChineseAnnotatedContent() {
  return ['诗词', '文章', '文言文'].includes(getActiveContent().category)
}

function isWordContent() {
  return getActiveContent().category === '单词'
}

function getCompareText() {
  const target = getActiveContent().body
  const normalized = isPinyinContent() ? normalizePinyinInput(target) : target
  const countLimit = getCountLimit()
  return countLimit ? Array.from(normalized).slice(0, countLimit).join('') : normalized
}

function getTimeLimit() {
  if (practiceMode === 'time-30') return 30
  if (practiceMode === 'time-60') return 60
  return 0
}

function getCountLimit() {
  if (practiceMode === 'count-20') return 20
  if (practiceMode === 'count-50') return 50
  return 0
}

function getExpectedKey() {
  return Array.from(getCompareText())[typing.getTypedChars().length] || ''
}

function isSeparator(char) {
  return char === ' ' || char === '\n'
}

function isCompletedCorrectUnit(index, typedChars) {
  const targetChars = Array.from(getCompareText())
  if (index < 0 || index >= targetChars.length) return false
  if (typedChars[index] !== targetChars[index]) return false

  if (isPinyinContent() || isWordContent()) return true
  if (isSeparator(targetChars[index])) return false
  if (isChineseAnnotatedContent()) return true

  const nextChar = targetChars[index + 1]
  if (nextChar && !isSeparator(nextChar)) return false

  let start = index
  while (start > 0 && !isSeparator(targetChars[start - 1])) start--
  for (let i = start; i <= index; i++) {
    if (typedChars[i] !== targetChars[i]) return false
  }
  return true
}

function handleTypingValue(value) {
  const previousLength = typing.getTypedChars().length
  if (practiceMode === 'strict' && Array.from(value).length > previousLength) {
    const targetChars = Array.from(getCompareText())
    const nextChars = Array.from(value)
    const hasWrongNewChar = nextChars.slice(previousLength).some((char, offset) => {
      const index = previousLength + offset
      return char !== targetChars[index]
    })
    if (hasWrongNewChar) {
      el.typingInput.value = typing.typedValue
      return
    }
  }

  typing.handleValue(value)
  const typedChars = typing.getTypedChars()
  if (typedChars.length <= previousLength) return

  const hasCompletedUnit = typedChars
    .slice(previousLength)
    .some((char, offset) => isCompletedCorrectUnit(previousLength + offset, typedChars))
  if (hasCompletedUnit) completionAudio.play()
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
  el.gamesCount.textContent = String(games.length)
  el.historyCount.textContent = String(readPracticeHistory().length)
  el.mistakeCount.textContent = String(Object.keys(readMistakes()).length)
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
  el.historyTab.classList.toggle('active', activeView === 'history')
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
  if (isWordContent()) {
    renderWordBlocks()
    return
  }

  if (isChineseAnnotatedContent()) {
    renderChineseBlocks()
    return
  }

  renderPlainText()
}

function renderPlainText() {
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

function getCharClass(char, index, typedChars) {
  let className = 'char'
  if (index < typedChars.length) className += typedChars[index] === char ? ' correct' : ' wrong'
  else if (index === typedChars.length) className += ' current'
  return className
}

function getStatusClass(char, index, typedChars) {
  if (index < typedChars.length) return typedChars[index] === char ? 'correct' : 'wrong'
  if (index === typedChars.length) return 'current'
  return ''
}

function renderChineseBlocks() {
  const chars = Array.from(getCompareText())
  const typedChars = typing.getTypedChars()

  el.typingText.innerHTML = chars.map((char, index) => {
    if (char === '\n') return `<span class="${getCharClass(char, index, typedChars)} newline"></span>`
    if (char === ' ') return `<span class="${getCharClass(char, index, typedChars)} chinese-space">&nbsp;</span>`

    const isChinese = /[\u4e00-\u9fff]/.test(char)
    return `
      <span class="annotated-char ${getCharClass(char, index, typedChars)}">
        <span class="annotation-top">${isChinese ? escapeHtml(getPinyin(char)) : ''}</span>
        <span class="annotation-main">${escapeHtml(char)}</span>
      </span>
    `
  }).join('')
}

function renderWordBlocks() {
  const item = getActiveContent()
  const typedChars = typing.getTypedChars()
  const translations = getWordTranslations(item)
  const words = item.body.match(/\S+/g) || []
  let startIndex = 0

  el.typingText.innerHTML = words.map((word, wordIndex) => {
    const letters = Array.from(word)
    const wordStatus = letters.some((letter, letterIndex) => getStatusClass(letter, startIndex + letterIndex, typedChars) === 'current')
      ? ' current'
      : ''
    const letterHtml = letters.map((letter, letterIndex) => {
      const globalIndex = startIndex + letterIndex
      return `<span class="${getCharClass(letter, globalIndex, typedChars)}">${escapeHtml(letter)}</span>`
    }).join('')
    const spacerIndex = startIndex + letters.length
    const spacerHtml = wordIndex < words.length - 1
      ? `<span class="${getCharClass(' ', spacerIndex, typedChars)} word-space">&nbsp;</span>`
      : ''
    startIndex += letters.length + (wordIndex < words.length - 1 ? 1 : 0)

    return `
      <span class="word-block${wordStatus}">
        <span class="word-main">${letterHtml}</span>
        <span class="annotation-bottom">${escapeHtml(translations[wordIndex] || '')}</span>
      </span>${spacerHtml}
    `
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
  el.historyView.hidden = true
  el.currentCategory.textContent = active.category
  el.currentTitle.textContent = active.title
  updatePracticeDisplay()
  requestAnimationFrame(focusTypingInput)
}

function renderGames() {
  el.practiceView.hidden = true
  el.gamesView.hidden = false
  el.historyView.hidden = true
  el.currentCategory.textContent = '游戏'
  el.currentTitle.textContent = '打字游戏'
  el.gameLinks.innerHTML = games.map(game => `
    <article class="game-card">
      <div>
        <h3>${escapeHtml(game.title)}</h3>
        <p>${escapeHtml(game.description)}</p>
      </div>
      <div class="game-actions">
        <a href="${game.href}" target="_blank" rel="noopener noreferrer">开始体验</a>
        ${game.sourceHref ? `<a href="${game.sourceHref}" target="_blank" rel="noopener noreferrer">源码</a>` : ''}
      </div>
    </article>
  `).join('')
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('zh-CN', { hour12: false })
}

function renderHistory() {
  const history = readPracticeHistory().slice().reverse()
  const bestWpm = history.reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0)
  const totalChars = history.reduce((total, item) => total + (Number(item.totalChars) || 0), 0)
  const totalDuration = history.reduce((total, item) => total + (Number(item.duration) || 0), 0)
  const avgAccuracy = history.length
    ? Math.round(history.reduce((total, item) => total + (Number(item.accuracy) || 0), 0) / history.length)
    : 100

  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = false
  el.currentCategory.textContent = '记录'
  el.currentTitle.textContent = '练习历史'
  el.historySummary.innerHTML = `
    <div class="history-stat"><span>次数</span><strong>${history.length}</strong></div>
    <div class="history-stat"><span>最高 WPM</span><strong>${bestWpm}</strong></div>
    <div class="history-stat"><span>平均准确率</span><strong>${avgAccuracy}%</strong></div>
    <div class="history-stat"><span>总字符</span><strong>${totalChars}</strong></div>
    <div class="history-stat"><span>总用时</span><strong>${totalDuration}s</strong></div>
  `

  if (!history.length) {
    el.historyList.innerHTML = '<p class="empty-state">还没有练习记录。</p>'
    return
  }

  el.historyList.innerHTML = history.slice(0, 50).map(item => `
    <article class="history-item">
      <div>
        <strong>${escapeHtml(item.lessonTitle || '未命名')}</strong>
        <span>${escapeHtml(item.courseSlug || '')} · ${formatDate(item.date)}</span>
      </div>
      <span>WPM ${Number(item.wpm) || 0}</span>
      <span>准确率 ${Number(item.accuracy) || 0}%</span>
      <span>错误 ${Number(item.errors) || 0}</span>
    </article>
  `).join('')
}

function render() {
  renderContentList()
  if (activeView === 'games') renderGames()
  else if (activeView === 'history') renderHistory()
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

function renderSoundOptions() {
  el.soundPreset.innerHTML = [
    ...completionSounds.map(sound => `<option value="${escapeHtml(sound.id)}">${escapeHtml(sound.title)}</option>`),
    '<option value="custom">自定义在线音频</option>'
  ].join('')
}

function renderPracticeModeOptions() {
  el.practiceMode.innerHTML = PRACTICE_MODES.map(mode => `
    <option value="${escapeHtml(mode.id)}">${escapeHtml(mode.title)}</option>
  `).join('')
  if (!PRACTICE_MODES.some(mode => mode.id === practiceMode)) practiceMode = 'free'
  el.practiceMode.value = practiceMode
}

function openSoundDialog() {
  const settings = completionAudio.getSettings()
  renderSoundOptions()
  el.soundPreset.value = settings.preset
  el.soundUrl.value = settings.customUrl
  el.soundDialog.showModal()
}

function saveSoundSettings() {
  completionAudio.setSettings({
    preset: el.soundPreset.value,
    customUrl: el.soundUrl.value
  })
  el.soundDialog.close()
  focusTypingInput()
}

function previewSoundSettings() {
  completionAudio.preview({
    preset: el.soundPreset.value,
    customUrl: el.soundUrl.value
  })
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
  el.resultMeta.textContent = `总字符 ${Array.from(getCompareText()).length} · 错误 ${stats.errors}`
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

function startWeakReview() {
  const mistakeChars = Object.entries(readMistakes())
    .sort((a, b) => b[1] - a[1])
    .map(([char]) => char)
    .filter(Boolean)
    .slice(0, 40)
  if (!mistakeChars.length) return

  const body = mistakeChars.join('')
  const customItems = readCustomContents()
  const item = {
    id: `weak-${Date.now()}`,
    title: '弱项复习',
    category: /^[a-zA-Z\s]+$/.test(body) ? '拼音' : '文章',
    isCustom: true,
    body
  }
  customItems.unshift(item)
  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  typing.reset()
  render()
  focusTypingInput()
}

function bindEvents() {
  renderPracticeModeOptions()

  el.typingInput.addEventListener('input', () => {
    if (el.typingInput.dataset.composing === '1') return
    handleTypingValue(isPinyinContent() ? normalizePinyinInput(el.typingInput.value) : el.typingInput.value)
  })

  el.typingInput.addEventListener('keydown', event => {
    if (!isPinyinContent() || event.isComposing) return
    if (event.key === 'Backspace') {
      event.preventDefault()
      handleTypingValue(typing.getTypedChars().slice(0, -1).join(''))
      return
    }
    if (event.key === 'Enter' && getExpectedKey() === '\n') {
      event.preventDefault()
      handleTypingValue(`${typing.typedValue}\n`)
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      handleTypingValue(typing.typedValue + normalizePinyinInput(event.key))
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
    handleTypingValue(el.typingInput.value)
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
  el.soundButton.addEventListener('click', () => openSoundDialog())
  el.customText.addEventListener('input', () => {
    const chars = Array.from(el.customText.value)
    if (chars.length > MAX_CUSTOM_LENGTH) {
      el.customText.value = chars.slice(0, MAX_CUSTOM_LENGTH).join('')
    }
    updateCustomCounter()
  })
  el.cancelEdit.addEventListener('click', () => el.editorDialog.close())
  el.closeEdit.addEventListener('click', () => el.editorDialog.close())
  el.cancelSound.addEventListener('click', () => el.soundDialog.close())
  el.closeSound.addEventListener('click', () => el.soundDialog.close())
  el.testSound.addEventListener('click', previewSoundSettings)
  el.editorDialog.addEventListener('submit', event => {
    event.preventDefault()
    saveEditorContent()
  })
  el.soundDialog.addEventListener('submit', event => {
    event.preventDefault()
    saveSoundSettings()
  })

  el.gamesTab.addEventListener('click', () => {
    activeView = 'games'
    render()
  })
  el.historyTab.addEventListener('click', () => {
    activeView = 'history'
    render()
  })
  el.weakReviewTab.addEventListener('click', startWeakReview)
  el.practiceMode.addEventListener('change', () => {
    practiceMode = el.practiceMode.value
    localStorage.setItem(MODE_KEY, practiceMode)
    activeView = 'practice'
    typing.reset()
    render()
    focusTypingInput()
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
  if (activeView !== 'practice' || typing.isFinished) return
  const stats = typing.getStats()
  const timeLimit = getTimeLimit()
  if (timeLimit && stats.typedLength > 0 && stats.durationSeconds >= timeLimit) {
    typing.finishNow()
    return
  }
  updatePracticeDisplay()
}, 1000)

})()
