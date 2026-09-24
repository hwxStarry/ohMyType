(() => {
const {
  ACTIVE_KEY,
  CATEGORIES,
  FAVORITES_KEY,
  MAX_CUSTOM_LENGTH,
  MEMORY_DIFFICULTIES,
  MEMORY_PINYIN_KEY,
  MEMORY_RECORD_KEY,
  MODE_KEY,
  PRACTICE_MODES,
  RECENTS_KEY,
  SIDEBAR_KEY,
  branchingStories,
  completionSounds,
  createCompletionAudio,
  createMemoryAudio,
  createContentLibrary,
  createDetectiveState,
  createMemorySession,
  createSharedMemoryPrompts,
  createTypingState,
  defaultContents,
  detectiveCases,
  escapeHtml,
  getDefaultFunKeyboardOpen,
  getFunKeyboardKeys,
  getFunTypingState,
  funModes,
  games,
  getPinyin,
  getWordTranslations,
  normalizePinyinInput,
  normalizeTitle,
  memoryPrompts,
  qs,
  readCustomContents,
  readMistakes,
  readOpenCategories,
  readPracticeHistory,
  renderKeyboard,
  searchContents,
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
  contentSearch: qs('#contentSearch'),
  currentCategory: qs('#currentCategory'),
  currentTitle: qs('#currentTitle'),
  customCategory: qs('#customCategory'),
  customCounter: qs('#customCounter'),
  customText: qs('#customText'),
  customTitle: qs('#customTitle'),
  detectiveTab: qs('#detectiveTab'),
  duration: qs('#duration'),
  editButton: qs('#editButton'),
  editorDialog: qs('#editorDialog'),
  expectedInfo: qs('#expectedInfo'),
  funContent: qs('#funContent'),
  funModesTab: qs('#funModesTab'),
  funView: qs('#funView'),
  favoriteCount: qs('#favoriteCount'),
  favoriteTab: qs('#favoriteTab'),
  gameLinks: qs('#gameLinks'),
  gamesCount: qs('#gamesCount'),
  gamesTab: qs('#gamesTab'),
  gamesView: qs('#gamesView'),
  historyCount: qs('#historyCount'),
  historyList: qs('#historyList'),
  historySummary: qs('#historySummary'),
  historyTab: qs('#historyTab'),
  historyView: qs('#historyView'),
  libraryDescription: qs('#libraryDescription'),
  libraryList: qs('#libraryList'),
  libraryRandomButton: qs('#libraryRandomButton'),
  libraryTitle: qs('#libraryTitle'),
  libraryView: qs('#libraryView'),
  mistakeCount: qs('#mistakeCount'),
  memoryTab: qs('#memoryTab'),
  mobileSidebarToggle: qs('#mobileSidebarToggle'),
  nextButton: qs('#nextButton'),
  positionInfo: qs('#positionInfo'),
  practiceView: qs('#practiceView'),
  practiceMode: qs('#practiceMode'),
  progress: qs('#progress'),
  progressBar: qs('#progressBar'),
  resetButton: qs('#resetButton'),
  randomContentButton: qs('#randomContentButton'),
  recentCount: qs('#recentCount'),
  recentTab: qs('#recentTab'),
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
  storyTab: qs('#storyTab'),
  textSection: qs('#textSection'),
  testSound: qs('#testSound'),
  typingInput: qs('#typingInput'),
  typingText: qs('#typingText'),
  virtualKeyboard: qs('#virtualKeyboard'),
  weakReviewTab: qs('#weakReviewTab'),
  wpm: qs('#wpm')
}

const DIALOGUE_ROOT_CATEGORY = '对话'
const DIALOGUE_CATEGORY_PREFIX = '对话·'
const PROGRAMMING_ROOT_CATEGORY = '编程'
const PROGRAMMING_CATEGORY_PREFIX = '编程·'
const REVIEW_MASTERY_TARGET = 3
const WEAK_REVIEW_ID = 'generated-weak-review'
const MISTAKE_REVIEW_ID = 'generated-mistake-review'
let activeId = getInitialActiveId()
let activeView = 'practice'
let durationTimer = 0
let practiceMode = localStorage.getItem(MODE_KEY) || 'free'
let activeStory = branchingStories[0]
let storyNodeId = activeStory.start
let storyPath = []
let activeDetectiveCase = detectiveCases[0]
let detectiveState = createDetectiveState(activeDetectiveCase)
let expandedSectionsBeforeCollapse = null
let funKeyboardOpen = getDefaultFunKeyboardOpen(window.innerWidth)
let funKeyboardNextChars = []
let funTypedValue = ''
let funCandidates = []
let contentSearchQuery = ''
let activeLibrary = 'favorites'
let favoriteIds = new Set()
let memoryDifficulty = 'normal'
let memoryType = '成语'
let memorySession = null
let memoryTypedValue = ''
let memoryRevealTimeout = 0
let memoryShowPinyin = localStorage.getItem(MEMORY_PINYIN_KEY) === '1'
let memoryComparison = null
let memoryLastTickKey = ''
const completionAudio = createCompletionAudio()
const memoryAudio = createMemoryAudio()
const contentLibrary = createContentLibrary({
  storage: localStorage,
  favoritesKey: FAVORITES_KEY,
  recentsKey: RECENTS_KEY
})

applyDefaultUiMigration()

if (localStorage.getItem(SIDEBAR_KEY) === '1') {
  el.appShell.classList.add('sidebar-collapsed')
  expandedSectionsBeforeCollapse = new Set()
  document.querySelectorAll('.side-section[data-side-section]').forEach(section => {
    section.open = true
  })
}
applyResponsiveSidebarDefaults()

function applyDefaultUiMigration() {
  const versionKey = 'ohmytype_ui_defaults_v2'
  if (localStorage.getItem(versionKey) === '1') return
  localStorage.setItem(SIDEBAR_KEY, '0')
  writeOpenCategories(new Set([DIALOGUE_ROOT_CATEGORY]))
  localStorage.setItem(versionKey, '1')
}

function applyResponsiveSidebarDefaults() {
  if (!window.matchMedia('(max-width: 980px)').matches || el.appShell.classList.contains('sidebar-collapsed')) return
  document.querySelectorAll('.side-section[data-side-section]').forEach(section => {
    section.open = false
  })
}

function closeMobileSidebar() {
  if (window.matchMedia('(max-width: 980px)').matches) {
    el.appShell.classList.remove('sidebar-open')
  }
}

function getInitialActiveId() {
  const savedId = localStorage.getItem(ACTIVE_KEY)
  if (savedId && [...defaultContents, ...readCustomContents()].some(item => item.id === savedId)) return savedId
  const dialogueItems = defaultContents.filter(item => item.category.startsWith(DIALOGUE_CATEGORY_PREFIX))
  if (!dialogueItems.length) return defaultContents[0].id
  return dialogueItems[Math.floor(Math.random() * dialogueItems.length)].id
}

function getContents() {
  return [...defaultContents, ...readCustomContents()]
}

function getWeakMistakeEntries() {
  return Object.entries(readMistakes())
    .filter(([, record]) => record.errors > 0 && record.correctReviews < REVIEW_MASTERY_TARGET)
    .sort((a, b) => {
      const scoreDifference = (b[1].errors - b[1].correctReviews) - (a[1].errors - a[1].correctReviews)
      if (scoreDifference) return scoreDifference
      return String(b[1].lastMistakeAt).localeCompare(String(a[1].lastMistakeAt))
    })
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

function isProgrammingContent() {
  return getActiveContent().category.startsWith(PROGRAMMING_CATEGORY_PREFIX)
}

function isDialogueContent() {
  return getActiveContent().category.startsWith(DIALOGUE_CATEGORY_PREFIX) && Array.isArray(getActiveContent().messages)
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
      nextChars.slice(previousLength).forEach((char, offset) => {
        const index = previousLength + offset
        if (char !== targetChars[index]) typing.recordRejectedAttempt(targetChars[index] || '')
      })
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
  favoriteIds = new Set(contentLibrary.readFavoriteIds())
  const contents = searchContents(getContents(), contentSearchQuery)
  const openCategories = readOpenCategories()
  el.gamesCount.textContent = String(games.length)
  el.historyCount.textContent = String(readPracticeHistory().length)
  el.favoriteCount.textContent = String(favoriteIds.size)
  el.recentCount.textContent = String(contentLibrary.readRecentIds().length)
  const weakMistakes = getWeakMistakeEntries()
  el.mistakeCount.textContent = String(weakMistakes.length)
  el.weakReviewTab.disabled = weakMistakes.length === 0
  el.weakReviewTab.title = weakMistakes.length
    ? `还有 ${weakMistakes.length} 个弱项，每个连续复习 ${REVIEW_MASTERY_TARGET} 次后掌握`
    : '暂无需要复习的弱项'
  const regularGroups = CATEGORIES.filter(category => (
    !category.startsWith(DIALOGUE_CATEGORY_PREFIX) && !category.startsWith(PROGRAMMING_CATEGORY_PREFIX)
  )).map(category => ({
    category,
    items: contents.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)
  const dialogueGroups = CATEGORIES.filter(category => category.startsWith(DIALOGUE_CATEGORY_PREFIX)).map(category => ({
    category,
    items: contents.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)
  const programmingGroups = CATEGORIES.filter(category => category.startsWith(PROGRAMMING_CATEGORY_PREFIX)).map(category => ({
    category,
    items: contents.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)

  const groupsHtml = [
    ...regularGroups.map(group => renderCategoryGroup(group, openCategories)),
    renderProgrammingCategoryGroup(programmingGroups, openCategories),
    renderDialogueCategoryGroup(dialogueGroups, openCategories)
  ].filter(Boolean).join('')
  el.contentList.innerHTML = groupsHtml || '<p class="content-search-empty">没有找到匹配的练习</p>'

  bindContentListEvents()
  el.favoriteTab.classList.toggle('active', activeView === 'library' && activeLibrary === 'favorites')
  el.recentTab.classList.toggle('active', activeView === 'library' && activeLibrary === 'recents')
  el.gamesTab.classList.toggle('active', activeView === 'games')
  el.historyTab.classList.toggle('active', activeView === 'history')
  el.storyTab.classList.toggle('active', activeView === 'story')
  el.detectiveTab.classList.toggle('active', activeView === 'detective')
  el.memoryTab.classList.toggle('active', activeView === 'memory')
  el.funModesTab.classList.toggle('active', activeView === 'fun')
}

function renderProgrammingCategoryGroup(groups, openCategories) {
  if (!groups.length) return ''
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  const isOpen = Boolean(contentSearchQuery) || openCategories.has(PROGRAMMING_ROOT_CATEGORY)
  return `
    <section class="category-group programming-category-group">
      <button class="category-toggle" type="button" data-category="${PROGRAMMING_ROOT_CATEGORY}" aria-expanded="${isOpen}">
        <span>${isOpen ? '⌄' : '›'}</span>
        <strong>${PROGRAMMING_ROOT_CATEGORY}</strong>
        <small>${total}</small>
      </button>
      <div class="category-items dialogue-subgroups" ${isOpen ? '' : 'hidden'}>
        ${groups.map(group => renderProgrammingSubgroup(group, openCategories)).join('')}
      </div>
    </section>
  `
}

function renderProgrammingSubgroup(group, openCategories) {
  const isOpen = Boolean(contentSearchQuery) || openCategories.has(group.category)
  const title = group.category.replace(PROGRAMMING_CATEGORY_PREFIX, '')
  return `
    <section class="category-subgroup">
      <button class="category-toggle subcategory-toggle" type="button" data-category="${escapeHtml(group.category)}" aria-expanded="${isOpen}">
        <span>${isOpen ? '⌄' : '›'}</span>
        <strong>${escapeHtml(title)}</strong>
        <small>${group.items.length}</small>
      </button>
      <div class="category-items subcategory-items" ${isOpen ? '' : 'hidden'}>
        ${group.items.map(item => renderContentItem(item)).join('')}
      </div>
    </section>
  `
}

function renderCategoryGroup(group, openCategories) {
  const isOpen = Boolean(contentSearchQuery) || openCategories.has(group.category)
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
}

function renderDialogueCategoryGroup(groups, openCategories) {
  if (!groups.length) return ''
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  const isOpen = Boolean(contentSearchQuery) || openCategories.has(DIALOGUE_ROOT_CATEGORY)
  return `
    <section class="category-group dialogue-category-group">
      <button class="category-toggle" type="button" data-category="${DIALOGUE_ROOT_CATEGORY}" aria-expanded="${isOpen}">
        <span>${isOpen ? '⌄' : '›'}</span>
        <strong>${DIALOGUE_ROOT_CATEGORY}</strong>
        <small>${total}</small>
      </button>
      <div class="category-items dialogue-subgroups" ${isOpen ? '' : 'hidden'}>
        ${groups.map(group => renderDialogueSubgroup(group, openCategories)).join('')}
      </div>
    </section>
  `
}

function renderDialogueSubgroup(group, openCategories) {
  const isOpen = Boolean(contentSearchQuery) || openCategories.has(group.category)
  const title = group.category.replace(DIALOGUE_CATEGORY_PREFIX, '')
  return `
    <section class="category-subgroup">
      <button class="category-toggle subcategory-toggle" type="button" data-category="${escapeHtml(group.category)}" aria-expanded="${isOpen}">
        <span>${isOpen ? '⌄' : '›'}</span>
        <strong>${escapeHtml(title)}</strong>
        <small>${group.items.length}</small>
      </button>
      <div class="category-items subcategory-items" ${isOpen ? '' : 'hidden'}>
        ${group.items.map(item => renderContentItem(item)).join('')}
      </div>
    </section>
  `
}

function renderContentItem(item) {
  return `
    <button class="content-item ${item.id === activeId && activeView === 'practice' ? 'active' : ''}" type="button" data-id="${item.id}">
      <span class="content-main">
        <strong>${escapeHtml(item.title)}</strong>
        <span class="content-actions">
          <span class="favorite-content ${favoriteIds.has(item.id) ? 'active' : ''}" role="button" tabindex="0" data-favorite-id="${item.id}" aria-label="${favoriteIds.has(item.id) ? '取消收藏' : '收藏'} ${escapeHtml(item.title)}" title="${favoriteIds.has(item.id) ? '取消收藏' : '收藏'}">${favoriteIds.has(item.id) ? '★' : '☆'}</span>
          ${item.isCustom && !item.isGenerated ? `
            <span class="edit-content" role="button" tabindex="0" data-edit-id="${item.id}" aria-label="编辑 ${escapeHtml(item.title)}" title="编辑">✎</span>
            <span class="delete-content" role="button" tabindex="0" data-delete-id="${item.id}" aria-label="删除 ${escapeHtml(item.title)}" title="删除">×</span>
          ` : ''}
        </span>
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
      if (nextOpen.has(category)) {
        nextOpen.delete(category)
        if (category === DIALOGUE_ROOT_CATEGORY) {
          CATEGORIES.filter(item => item.startsWith(DIALOGUE_CATEGORY_PREFIX)).forEach(item => nextOpen.delete(item))
        }
        if (category === PROGRAMMING_ROOT_CATEGORY) {
          CATEGORIES.filter(item => item.startsWith(PROGRAMMING_CATEGORY_PREFIX)).forEach(item => nextOpen.delete(item))
        }
      } else {
        const rootCategory = category.startsWith(DIALOGUE_CATEGORY_PREFIX)
          ? DIALOGUE_ROOT_CATEGORY
          : (category.startsWith(PROGRAMMING_CATEGORY_PREFIX) ? PROGRAMMING_ROOT_CATEGORY : category)
        nextOpen.clear()
        nextOpen.add(rootCategory)
        if (category !== rootCategory) nextOpen.add(category)
      }
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

  el.contentList.querySelectorAll('.favorite-content').forEach(button => {
    bindActionButton(button, event => toggleFavorite(event, button.dataset.favoriteId))
  })
}

function bindActionButton(button, handler) {
  button.addEventListener('click', handler)
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') handler(event)
  })
}

function selectContent(id) {
  el.resultModal.hidden = true
  activeView = 'practice'
  activeId = id
  localStorage.setItem(ACTIVE_KEY, activeId)
  contentLibrary.recordRecent(activeId)
  typing.reset()
  resetTextScroll()
  render()
  closeMobileSidebar()
  focusTypingInput(true)
}

function toggleFavorite(event, id) {
  event.preventDefault()
  event.stopPropagation()
  contentLibrary.toggleFavorite(id)
  render()
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
  resetTextScroll()
  render()
  focusTypingInput(true)
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
  resetTextScroll()
  render()
  openEditor(item)
}

function renderTypingText() {
  el.typingText.classList.toggle('dialogue-text', isDialogueContent())
  el.typingText.classList.toggle('programming-text', isProgrammingContent())

  if (isDialogueContent()) {
    renderDialogueBlocks()
    return
  }

  if (isWordContent()) {
    renderWordBlocks()
    return
  }

  if (isProgrammingContent()) {
    renderProgrammingBlocks()
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

function renderProgrammingBlocks() {
  const item = getActiveContent()
  const words = getCompareText().match(/\S+/g) || []
  const typedChars = typing.getTypedChars()
  const translations = item.translations || []
  let startIndex = 0

  el.typingText.innerHTML = words.map((word, wordIndex) => {
    const letters = Array.from(word)
    const isCurrent = letters.some((letter, letterIndex) => (
      getStatusClass(letter, startIndex + letterIndex, typedChars) === 'current'
    ))
    const main = letters.map((letter, letterIndex) => (
      `<span class="${getCharClass(letter, startIndex + letterIndex, typedChars)}">${escapeHtml(letter)}</span>`
    )).join('')
    const spacerIndex = startIndex + letters.length
    const spacer = wordIndex < words.length - 1
      ? `<span class="${getCharClass(' ', spacerIndex, typedChars)} code-space">&nbsp;</span>`
      : ''
    startIndex += letters.length + (wordIndex < words.length - 1 ? 1 : 0)

    return `
      <span class="code-token${isCurrent ? ' current' : ''}">
        <span class="code-token-main">${main}</span>
        <span class="annotation-bottom">${escapeHtml(translations[wordIndex] || '')}</span>
      </span>${spacer}
    `
  }).join('')
}

function getDialogueSegments(item) {
  let startIndex = 0
  return item.messages.map((message, index) => {
    const segment = {
      incoming: message.incoming,
      reply: message.reply,
      startIndex,
      newlineIndex: index < item.messages.length - 1 ? startIndex + Array.from(message.reply).length : -1
    }
    startIndex += Array.from(message.reply).length + (index < item.messages.length - 1 ? 1 : 0)
    return segment
  })
}

function renderDialogueBlocks() {
  const item = getActiveContent()
  const typedChars = typing.getTypedChars()
  const targetChars = Array.from(getCompareText())

  el.typingText.innerHTML = getDialogueSegments(item).map((segment, segmentIndex) => {
    const replyChars = Array.from(segment.reply)
    const replyHtml = replyChars.map((char, charIndex) => {
      const globalIndex = segment.startIndex + charIndex
      return `<span class="${getCharClass(char, globalIndex, typedChars)}">${escapeHtml(char)}</span>`
    }).join('')
    const newlineHtml = segment.newlineIndex > -1 && segment.newlineIndex < targetChars.length
      ? `<span class="dialogue-enter ${getCharClass('\n', segment.newlineIndex, typedChars)}">Enter</span>`
      : ''
    const isCurrent = typedChars.length >= segment.startIndex && (
      segment.newlineIndex === -1 ? typedChars.length <= segment.startIndex + replyChars.length : typedChars.length <= segment.newlineIndex
    )

    return `
      <section class="dialogue-turn${isCurrent ? ' current' : ''}">
        ${segmentIndex === 1 ? '<div class="dialogue-time">今天 14:30</div>' : ''}
        <div class="dialogue-row incoming">
          <span class="dialogue-avatar">${escapeHtml(item.incomingRole?.slice(0, 1) || '对')}</span>
          <div class="dialogue-bubble">
            <small class="dialogue-speaker">${escapeHtml(item.incomingRole || '对方')}</small>
            <p>${escapeHtml(segment.incoming)}</p>
          </div>
        </div>
        <div class="dialogue-row reply">
          <div class="dialogue-bubble">
            <small class="dialogue-speaker">${escapeHtml(item.replyRole || '我')}</small>
            <p>${replyHtml}${newlineHtml}</p>
          </div>
          <span class="dialogue-avatar">${escapeHtml(item.replyRole?.slice(0, 1) || '我')}</span>
        </div>
      </section>
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
  if (stats.typedLength > 0) scrollCurrentIntoView()
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
  const lowerEdge = sectionRect.top + sectionRect.height * 0.78
  const upperEdge = sectionRect.top + sectionRect.height * 0.18
  if (charRect.bottom > lowerEdge) {
    el.textSection.scrollBy({ top: charRect.bottom - lowerEdge + 24, behavior: 'smooth' })
  } else if (charRect.top < upperEdge && el.textSection.scrollTop > 0) {
    el.textSection.scrollBy({ top: charRect.top - upperEdge - 24, behavior: 'smooth' })
  }
}

function resetTextScroll() {
  el.textSection.scrollTop = 0
}

function getContentsByIds(ids) {
  const contentsById = new Map(getContents().map(item => [item.id, item]))
  return ids.map(id => contentsById.get(id)).filter(Boolean)
}

function getActiveLibraryContents() {
  const ids = activeLibrary === 'favorites'
    ? contentLibrary.readFavoriteIds()
    : contentLibrary.readRecentIds()
  return getContentsByIds(ids)
}

function renderLibraryItem(item) {
  const isFavorite = favoriteIds.has(item.id)
  return `
    <article class="library-item" data-library-id="${item.id}">
      <button class="library-open" type="button" data-library-open="${item.id}">
        <span class="library-category">${escapeHtml(item.category)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(summarizeBody(item.body))}</p>
      </button>
      <button class="library-favorite ${isFavorite ? 'active' : ''}" type="button" data-library-favorite="${item.id}" aria-label="${isFavorite ? '取消收藏' : '收藏'} ${escapeHtml(item.title)}" title="${isFavorite ? '取消收藏' : '收藏'}">${isFavorite ? '★' : '☆'}</button>
    </article>
  `
}

function renderLibrary() {
  const isFavorites = activeLibrary === 'favorites'
  const contents = getActiveLibraryContents()
  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = true
  el.libraryView.hidden = false
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '我的练习'
  el.currentTitle.textContent = isFavorites ? '我的收藏' : '最近练习'
  el.libraryTitle.textContent = isFavorites ? '我的收藏' : '最近练习'
  el.libraryDescription.textContent = isFavorites
    ? '收藏想反复练习的内容，随时从这里开始。'
    : '按最近打开顺序保留 12 个练习。'
  el.libraryRandomButton.disabled = contents.length === 0
  el.libraryList.innerHTML = contents.length
    ? contents.map(renderLibraryItem).join('')
    : `<p class="empty-state">${isFavorites ? '还没有收藏内容，可以点击练习旁的星标添加。' : '还没有最近练习，先从左侧选择一项吧。'}</p>`
}

function openLibrary(type) {
  activeLibrary = type
  activeView = 'library'
  render()
  closeMobileSidebar()
}

function startRandomPractice(contents) {
  const next = contentLibrary.pickRandom(contents.filter(item => !item.isGenerated), activeId)
  if (next) selectContent(next.id)
}

function startRandomFromCurrentCategory() {
  const active = getActiveContent()
  const contents = getContents().filter(item => item.category === active.category)
  startRandomPractice(contents)
}

function renderPractice() {
  const active = getActiveContent()
  el.practiceView.hidden = false
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = true
  el.libraryView.hidden = true
  setPracticeControlsVisible(true)
  el.currentCategory.textContent = active.category
  el.currentTitle.textContent = active.title
  updatePracticeDisplay()
  requestAnimationFrame(() => focusTypingInput(true))
}

function renderGames() {
  const gameGroups = ['竞速类', '射击防守类', '格斗类', '儿童轻量类', '游戏合集', '练习工具']
  el.practiceView.hidden = true
  el.gamesView.hidden = false
  el.historyView.hidden = true
  el.funView.hidden = true
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '游戏'
  el.currentTitle.textContent = '打字游戏'
  el.gameLinks.innerHTML = gameGroups.map(group => {
    const items = games.filter(game => (game.group || '练习工具') === group)
    if (!items.length) return ''
    return `
      <section class="game-group">
        <div class="game-group-head">
          <h3>${escapeHtml(group)}</h3>
          <span>${items.length}</span>
        </div>
        <div class="game-grid">
          ${items.map(renderGameCard).join('')}
        </div>
      </section>
    `
  }).join('')
}

function renderGameCard(game) {
  return `
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
  `
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
  el.funView.hidden = true
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
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
      <span>字符 ${Number(item.totalChars) || 0}${item.targetChars && item.targetChars !== item.totalChars ? `/${Number(item.targetChars)}` : ''}</span>
      <span>错误 ${Number(item.errors) || 0}</span>
    </article>
  `).join('')
}

function setPracticeControlsVisible(visible) {
  el.practiceMode.hidden = !visible
  el.editButton.hidden = !visible
  el.soundButton.hidden = !visible
  el.resetButton.hidden = !visible && !['story', 'detective'].includes(activeView)
}

function renderFunHub() {
  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = false
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '趣味'
  el.currentTitle.textContent = '全部玩法'
  el.funContent.innerHTML = `
    <div class="fun-head">
      <p class="eyebrow">输入也可以有剧情</p>
      <h2>趣味练习</h2>
      <p>不只是抄完一段文字，每种玩法都会让输入产生不同的结果。</p>
    </div>
    <div class="fun-grid">
      ${funModes.map(mode => `
        <article class="fun-mode-card ${mode.status === 'soon' ? 'soon' : ''}">
          <span class="fun-mode-icon">${escapeHtml(mode.icon)}</span>
          <div>
            <span class="fun-status">${mode.status === 'playable' ? '现在可玩' : '即将上线'}</span>
            <h3>${escapeHtml(mode.title)}</h3>
            <p>${escapeHtml(mode.description)}</p>
          </div>
          ${mode.status === 'playable'
            ? `<button class="solid-button" type="button" data-start-fun="${escapeHtml(mode.id)}">开始挑战</button>`
            : '<span class="fun-coming">正在准备</span>'}
        </article>
      `).join('')}
    </div>
  `
}

function readMemoryRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(MEMORY_RECORD_KEY) || '{}')
    return records && typeof records === 'object' && !Array.isArray(records) ? records : {}
  } catch {
    return {}
  }
}

function getMemoryRecord() {
  const record = readMemoryRecords()[memoryDifficulty]
  return {
    bestScore: Number(record?.bestScore) || 0,
    bestStreak: Number(record?.bestStreak) || 0,
    bestCpm: Number(record?.bestCpm) || 0,
    lastCpm: Number(record?.lastCpm) || 0,
    lastAccuracy: Number(record?.lastAccuracy) || 0,
    plays: Number(record?.plays) || 0
  }
}

function saveMemoryResult(summary) {
  const records = readMemoryRecords()
  const previous = getMemoryRecord()
  memoryComparison = previous.plays ? {
    cpmDelta: summary.cpm - previous.lastCpm,
    accuracyDelta: summary.accuracy - previous.lastAccuracy,
    previousCpm: previous.lastCpm,
    previousAccuracy: previous.lastAccuracy
  } : null
  records[memoryDifficulty] = {
    bestScore: Math.max(previous.bestScore, summary.accuracy),
    bestStreak: Math.max(previous.bestStreak, summary.bestStreak),
    bestCpm: Math.max(previous.bestCpm, summary.cpm),
    lastCpm: summary.cpm,
    lastAccuracy: summary.accuracy,
    plays: previous.plays + 1
  }
  localStorage.setItem(MEMORY_RECORD_KEY, JSON.stringify(records))
}

function openMemory() {
  window.clearTimeout(memoryRevealTimeout)
  memorySession = null
  memoryTypedValue = ''
  memoryComparison = null
  memoryLastTickKey = ''
  activeView = 'memory'
  render()
  closeMobileSidebar()
}

function startMemoryRound() {
  memoryAudio.unlock()
  memoryTypedValue = ''
  memoryComparison = null
  memoryLastTickKey = ''
  memorySession = createMemorySession({
    prompts: createSharedMemoryPrompts(memoryPrompts, getContents()),
    type: memoryType,
    difficulty: memoryDifficulty
  })
  activeView = 'memory'
  render()
}

function beginMemoryInput() {
  if (!memorySession || memorySession.getState().phase !== 'reveal') return
  window.clearTimeout(memoryRevealTimeout)
  memorySession.beginInput()
  memoryTypedValue = ''
  memoryLastTickKey = ''
  memoryAudio.playTransition()
  render()
  requestAnimationFrame(() => qs('#memoryInput', el.funContent)?.focus({ preventScroll: true }))
}

function submitMemoryAttempt(timedOut = false) {
  if (!memorySession || memorySession.getState().phase !== 'input') return
  window.clearTimeout(memoryRevealTimeout)
  if (timedOut) memoryAudio.playTimeout()
  const result = memorySession.submit(memoryTypedValue)
  if (!result) return
  memoryTypedValue = ''
  const state = memorySession.getState()
  if (state.phase === 'complete') {
    saveMemoryResult(state.summary)
    if (state.summary.accuracy === 100) completionAudio.play()
  } else {
    memoryAudio.playTransition()
  }
  render()
}

function renderMemoryTypedValue() {
  if (!memoryTypedValue) return '<span class="memory-placeholder">开始输入你记住的内容…</span>'
  return Array.from(memoryTypedValue, char => `<span>${escapeHtml(char)}</span>`).join('')
}

function renderMemoryTarget(text) {
  if (!memoryShowPinyin || !/[\p{Script=Han}]/u.test(text)) return escapeHtml(text)
  return Array.from(text, char => `
    <span class="memory-target-char">
      <small>${/\p{Script=Han}/u.test(char) ? escapeHtml(getPinyin(char)) : ''}</small>
      <strong>${escapeHtml(char)}</strong>
    </span>
  `).join('')
}

function formatMemoryDelta(value, suffix) {
  if (!value) return '与上次持平'
  return `较上次 ${value > 0 ? '+' : ''}${value}${suffix}`
}

function renderMemoryClock(state, phase) {
  const inputPhase = phase === 'input'
  return `
    <div class="memory-countdown memory-clock memory-clock--${phase}" style="--clock-duration: ${Math.max(1, state.remainingMilliseconds)}ms">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="memory-clock-track" cx="24" cy="24" r="20" pathLength="100"></circle>
        <circle class="memory-clock-progress" cx="24" cy="24" r="20" pathLength="100"></circle>
        <line class="memory-clock-hand" x1="24" y1="24" x2="24" y2="11"></line>
        <circle class="memory-clock-pin" cx="24" cy="24" r="2"></circle>
      </svg>
      <div><strong id="memoryCountdown">${state.remainingSeconds}</strong><span>${inputPhase ? '秒内完成' : '秒后隐藏'}</span></div>
    </div>
  `
}

function syncMemoryCountdownSound(state) {
  if (!['reveal', 'input'].includes(state.phase) || state.remainingSeconds <= 0) return
  const shouldTick = state.phase === 'reveal' || state.remainingSeconds <= 5
  const key = `${state.phase}:${state.index}:${state.remainingSeconds}`
  if (!shouldTick || memoryLastTickKey === key) return
  memoryLastTickKey = key
  memoryAudio.playTick(state.remainingSeconds <= 3)
}

function scheduleMemoryReveal(state) {
  window.clearTimeout(memoryRevealTimeout)
  const session = memorySession
  const index = state.index
  memoryRevealTimeout = window.setTimeout(() => {
    const current = memorySession?.getState()
    if (activeView !== 'memory' || memorySession !== session || current?.phase !== 'reveal' || current.index !== index) return
    beginMemoryInput()
  }, state.remainingMilliseconds)
}

function scheduleMemoryInput(state) {
  window.clearTimeout(memoryRevealTimeout)
  const session = memorySession
  const index = state.index
  memoryRevealTimeout = window.setTimeout(() => {
    const current = memorySession?.getState()
    if (activeView !== 'memory' || memorySession !== session || current?.phase !== 'input' || current.index !== index) return
    submitMemoryAttempt(true)
  }, state.remainingMilliseconds)
}

function renderMemorySetup() {
  const record = getMemoryRecord()
  return `
    <div class="memory-shell">
      <div class="memory-intro">
        <p class="eyebrow">看清楚，然后相信记忆</p>
        <h2>记忆闪打</h2>
        <p>每组连续完成多题：文字按难度短暂显示，隐藏后凭记忆输入，按 Enter 立即进入下一题。</p>
      </div>
      <section class="memory-options">
        <h3>选择内容</h3>
        <div class="memory-choice-row">
          ${['成语', '诗词', '单词', 'JavaScript', 'Python', 'HTML', 'CSS', '短句'].map(type => `
            <button class="memory-choice ${memoryType === type ? 'active' : ''}" type="button" data-memory-type="${type}">${type}</button>
          `).join('')}
        </div>
        <label class="memory-pinyin-option">
          <input id="memoryPinyinToggle" type="checkbox" ${memoryShowPinyin ? 'checked' : ''} />
          <span><strong>显示拼音</strong><small>成语、诗词和中文短句在记忆阶段显示无声调拼音。</small></span>
        </label>
        <label class="memory-pinyin-option">
          <input id="memorySoundToggle" type="checkbox" ${memoryAudio.getEnabled() ? 'checked' : ''} />
          <span><strong>游戏音效</strong><small>倒计时、时间到和题目切换时播放提示音。</small></span>
        </label>
        <h3>选择难度</h3>
        <div class="memory-difficulty-grid">
          ${MEMORY_DIFFICULTIES.map(item => `
            <button class="memory-difficulty ${memoryDifficulty === item.id ? 'active' : ''}" type="button" data-memory-difficulty="${item.id}">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${item.roundCount} 题 · 记 ${item.revealSeconds}s · 答 ${item.inputSeconds}s</span>
              <small>${escapeHtml(item.description)}</small>
            </button>
          `).join('')}
        </div>
      </section>
      <div class="memory-records">
        <span>本难度最高分 <strong>${record.bestScore}</strong></span>
        <span>最佳连对 <strong>${record.bestStreak}</strong></span>
      </div>
      <div class="story-actions">
        <button class="soft-button" type="button" data-open-fun-hub>返回全部玩法</button>
        <button class="solid-button" type="button" data-start-memory-round>开始本组</button>
      </div>
    </div>
  `
}

function renderMemory() {
  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = false
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '记忆闪打'
  el.currentTitle.textContent = memorySession ? `${memoryType} · ${MEMORY_DIFFICULTIES.find(item => item.id === memoryDifficulty)?.title || ''}` : '记忆闪打'

  if (!memorySession) {
    el.funContent.innerHTML = renderMemorySetup()
    return
  }

  const state = memorySession.getState()
  if (state.phase === 'reveal') {
    el.funContent.innerHTML = `
      <div class="memory-shell memory-stage">
        <p class="eyebrow">${escapeHtml(state.prompt.type)} · ${escapeHtml(state.difficulty.title)} · 第 ${state.index + 1} / ${state.total} 题</p>
        ${renderMemoryClock(state, 'reveal')}
        <div class="memory-target ${memoryShowPinyin ? 'with-pinyin' : ''}" aria-label="需要记忆的内容">${renderMemoryTarget(state.prompt.text)}</div>
        <p class="memory-tip">倒计时结束后会自动隐藏并进入输入，不需要点击。</p>
      </div>
    `
    syncMemoryCountdownSound(state)
    scheduleMemoryReveal(state)
    return
  }

  if (state.phase === 'input') {
    el.funContent.innerHTML = `
      <div class="memory-shell memory-stage">
        <p class="eyebrow">原文已隐藏 · 第 ${state.index + 1} / ${state.total} 题</p>
        ${renderMemoryClock(state, 'input')}
        <div class="memory-hidden-mark" aria-hidden="true">••••••</div>
        <div id="memoryTypedPreview" class="memory-typed-preview" aria-live="polite">${renderMemoryTypedValue()}</div>
        <label class="memory-input-label" for="memoryInput">输入你记住的内容</label>
        <textarea id="memoryInput" class="memory-input" rows="1" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="在这里输入…">${escapeHtml(memoryTypedValue)}</textarea>
        <p class="memory-tip">输入完成后按 Enter；倒计时结束会自动提交并进入下一题。输入法选词时的回车不会误提交。</p>
        <button class="solid-button" type="button" data-submit-memory>提交并进入下一题</button>
      </div>
    `
    syncMemoryCountdownSound(state)
    scheduleMemoryInput(state)
    requestAnimationFrame(() => qs('#memoryInput', el.funContent)?.focus({ preventScroll: true }))
    return
  }

  const result = state.summary
  const record = getMemoryRecord()
  el.funContent.innerHTML = `
    <div class="memory-shell memory-result">
      <p class="eyebrow">本组 ${state.total} 题完成 · ${escapeHtml(state.difficulty.title)}</p>
      <div class="ending-mark">${result.perfectCount === state.total ? '★' : '↺'}</div>
      <h2>${result.perfectCount === state.total ? '整组全对' : `答对 ${result.perfectCount} / ${state.total} 题`}</h2>
      <div class="memory-score-grid">
        <div><span>得分</span><strong>${result.accuracy}</strong></div>
        <div><span>速度</span><strong>${result.cpm} CPM</strong></div>
        <div><span>英文速度</span><strong>${result.wpm} WPM</strong></div>
        <div><span>平均每题</span><strong>${result.averageSeconds}s</strong></div>
        <div><span>正确</span><strong>${result.correct}</strong></div>
        <div><span>错字</span><strong>${result.wrong}</strong></div>
        <div><span>漏字</span><strong>${result.omitted}</strong></div>
        <div><span>顺序错误</span><strong>${result.orderErrors}</strong></div>
      </div>
      <div class="memory-performance-compare">
        <div><span>本组总用时</span><strong>${result.durationSeconds}s</strong></div>
        <div><span>历史最佳速度</span><strong>${record.bestCpm} CPM</strong></div>
        <div><span>速度对比</span><strong>${memoryComparison ? formatMemoryDelta(memoryComparison.cpmDelta, ' CPM') : '首次记录'}</strong></div>
        <div><span>准确率对比</span><strong>${memoryComparison ? formatMemoryDelta(memoryComparison.accuracyDelta, '%') : '首次记录'}</strong></div>
      </div>
      <div class="memory-attempt-list">
        ${state.attempts.map((attempt, index) => `
          <article class="memory-attempt ${attempt.perfect ? 'perfect' : ''} ${attempt.timedOut ? 'timed-out' : ''}">
            <span>${index + 1}</span>
            <div><small>原文</small><strong>${escapeHtml(attempt.target)}</strong></div>
            <div><small>输入</small><strong>${escapeHtml(attempt.typed || '（未输入）')}</strong></div>
            <em>${attempt.timedOut ? `超时 · 错 ${attempt.wrong} · 漏 ${attempt.omitted}` : attempt.perfect ? '正确' : `错 ${attempt.wrong} · 漏 ${attempt.omitted} · 序 ${attempt.orderErrors}`}</em>
          </article>
        `).join('')}
      </div>
      <div class="memory-records">
        <span>本组最佳连对 <strong>${result.bestStreak}</strong></span>
        <span>最高分 <strong>${record.bestScore}</strong></span>
        <span>最佳连对 <strong>${record.bestStreak}</strong></span>
      </div>
      <div class="story-actions">
        <button class="soft-button" type="button" data-configure-memory>调整难度</button>
        <button class="solid-button" type="button" data-start-memory-round>再来一组</button>
      </div>
    </div>
  `
}

function renderStory() {
  const node = activeStory.nodes[storyNodeId]
  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = false
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '剧情分支'
  el.currentTitle.textContent = activeStory.title

  if (node.ending) {
    el.funContent.innerHTML = `
      <div class="story-shell ending-shell">
        <p class="eyebrow">故事完成 · ${storyPath.length} 次选择</p>
        <div class="ending-mark">★</div>
        <h2>${escapeHtml(node.ending.title)}</h2>
        <p>${escapeHtml(node.ending.body)}</p>
        <div class="story-actions">
          <button class="soft-button" type="button" data-open-fun-hub>返回全部玩法</button>
          <button class="solid-button" type="button" data-restart-story>再玩一次</button>
        </div>
      </div>
    `
    return
  }

  const typingState = getFunTypingState(funCandidates, funTypedValue)

  el.funContent.innerHTML = `
    <div class="story-shell">
      <div class="story-progress">
        <span>剧情进度</span>
        <strong>${storyPath.length + 1} / 2</strong>
      </div>
      <p class="story-scene">${escapeHtml(node.scene)}</p>
      <section class="story-message">
        <span class="dialogue-avatar">员</span>
        <div>
          <small>${escapeHtml(node.speaker)}</small>
          <p>${escapeHtml(node.message)}</p>
        </div>
      </section>
      <div class="story-prompt">
        <h2>选择一句，完整输入</h2>
        <div class="story-choices">
          ${node.choices.map((choice, index) => `
            <div class="story-choice ${typingState.candidates[index].isBest ? 'matching' : ''} ${funTypedValue && !typingState.candidates[index].isBest ? 'dimmed' : ''}" data-choice="${escapeHtml(choice.text)}">
              <span>${index + 1}</span>
              <p>${renderFunCharacters(typingState.candidates[index])}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ${renderFunInputControls('输入选择的回复', '直接输入你选择的回复')}
    </div>
  `
  renderFunKeyboard(typingState.nextChars)
  requestAnimationFrame(() => qs('#funTypingInput', el.funContent)?.focus({ preventScroll: true }))
}

function resetFunInput(candidates) {
  funTypedValue = ''
  funCandidates = candidates
  funKeyboardNextChars = []
}

function renderFunInputControls(label, hint) {
  return `
    <p id="funTypingHint" class="fun-typing-hint" aria-live="polite">${escapeHtml(hint)}</p>
    <textarea id="funTypingInput" class="hidden-input" aria-label="${escapeHtml(label)}" autocomplete="off" autocapitalize="off" spellcheck="false">${escapeHtml(funTypedValue)}</textarea>
    <section class="fun-keyboard-card">
      <button class="fun-keyboard-toggle" type="button" data-toggle-fun-keyboard aria-expanded="${funKeyboardOpen}">
        <span>键盘指法</span><span>${funKeyboardOpen ? '收起键盘' : '展开键盘'}</span>
      </button>
      <div id="funKeyboard" class="virtual-keyboard"></div>
    </section>
  `
}

function renderFunCharacters(candidate) {
  return candidate.chars.map(item =>
    `<span class="fun-char ${item.status}">${escapeHtml(item.char)}</span>`
  ).join('')
}

function handleFunInput(value) {
  const input = qs('#funTypingInput', el.funContent)
  if (input?.dataset.composing === '1') return getFunTypingState(funCandidates, funTypedValue)
  // Free answers must never use accepted answers as typing or keyboard candidates.
  const typingState = activeView === 'detective' && detectiveState.getState().phase === 'accusation'
    ? { typedValue: value, nextChars: [], candidates: [], completedIndex: -1 }
    : getFunTypingState(funCandidates, value)
  funTypedValue = typingState.typedValue
  if (input && input.value !== funTypedValue) input.value = funTypedValue
  renderFunKeyboard(typingState.nextChars)
  return typingState
}

function renderFunKeyboard(nextChars) {
  const keyboard = qs('#funKeyboard', el.funContent)
  const toggle = qs('[data-toggle-fun-keyboard]', el.funContent)
  if (!keyboard || !toggle) return

  funKeyboardNextChars = getFunKeyboardKeys(nextChars)
  toggle.setAttribute('aria-expanded', String(funKeyboardOpen))
  toggle.querySelector('span:last-child').textContent = funKeyboardOpen ? '收起键盘' : '展开键盘'
  keyboard.hidden = !funKeyboardOpen
  renderKeyboard(keyboard, funKeyboardNextChars)
}

function toggleFunKeyboard() {
  funKeyboardOpen = !funKeyboardOpen
  renderFunKeyboard(funKeyboardNextChars)
}

function startStory() {
  activeStory = branchingStories[0]
  storyNodeId = activeStory.start
  storyPath = []
  resetFunInput(activeStory.nodes[storyNodeId].choices.map(choice => choice.text))
  activeView = 'story'
  render()
}

function updateFunInput(input) {
  if (!['story', 'detective'].includes(activeView) || input.dataset.composing === '1') return
  if (input !== qs('#funTypingInput', el.funContent)) return
  const typingState = handleFunInput(input.value)
  if (activeView === 'story') handleStoryInput(typingState)
  else if (detectiveState.getState().phase === 'statement') {
    qs('.statement-text', el.funContent).innerHTML = renderFunCharacters(typingState.candidates[0])
    qs('#funTypingHint', el.funContent).textContent = typingState.candidates[0].chars.some(char => char.status === 'wrong')
      ? '这段输入与证词不匹配，可以退格修正'
      : '直接输入证词，完整匹配后解锁线索'
    if (typingState.completedIndex === 0) completeDetectiveStatement()
  } else if (detectiveState.getState().phase === 'accusation') {
    qs('.accusation-answer', el.funContent).innerHTML = renderDetectiveAnswer()
  }
}

function handleStoryInput(typingState) {
  const node = activeStory.nodes[storyNodeId]
  if (!node || node.ending) return
  el.funContent.querySelectorAll('.story-choice').forEach((choiceEl, index) => {
    const candidate = typingState.candidates[index]
    choiceEl.classList.toggle('matching', candidate.isBest)
    choiceEl.classList.toggle('dimmed', Boolean(funTypedValue) && !candidate.isBest)
    choiceEl.querySelector('p').innerHTML = renderFunCharacters(candidate)
  })
  const hasPrefixMatch = typingState.candidates.some(candidate => candidate.text.startsWith(funTypedValue))
  const hint = qs('#funTypingHint', el.funContent)
  hint.textContent = hasPrefixMatch || !funTypedValue
    ? '继续输入，完整匹配后会自动进入下一段剧情'
    : '这段输入与两个选项都不匹配，可以退格修正'
  if (typingState.completedIndex < 0) return
  const selected = node.choices[typingState.completedIndex]
  storyPath.push({ nodeId: storyNodeId, choice: selected.text })
  storyNodeId = selected.next
  const nextNode = activeStory.nodes[storyNodeId]
  resetFunInput(nextNode.ending ? [] : nextNode.choices.map(choice => choice.text))
  completionAudio.play()
  render()
}

function startDetective() {
  detectiveState.reset()
  resetFunInput([])
  activeView = 'detective'
  render()
}

function beginDetective() {
  if (activeView !== 'detective' || detectiveState.getState().phase !== 'intro') return
  detectiveState.start()
  resetFunInput([activeDetectiveCase.statements[0].text])
  render()
}

function completeDetectiveStatement() {
  if (detectiveState.getState().phase !== 'statement') return
  detectiveState.completeStatement()
  const state = detectiveState.getState()
  resetFunInput(state.phase === 'statement' ? [activeDetectiveCase.statements[state.statementIndex].text] : [])
  completionAudio.play()
  render()
}

function renderDetectiveAnswer() {
  return renderFunCharacters({ chars: Array.from(funTypedValue, char => ({ char, status: 'pending' })) })
}

function submitDetectiveAnswer() {
  const input = qs('#funTypingInput', el.funContent)
  if (activeView !== 'detective' || detectiveState.getState().phase !== 'accusation' || input?.dataset.composing === '1') return
  if (detectiveState.submitAnswer(funTypedValue)) completionAudio.play()
  resetFunInput([])
  render()
}

function renderDetective() {
  const state = detectiveState.getState()
  el.practiceView.hidden = true
  el.gamesView.hidden = true
  el.historyView.hidden = true
  el.funView.hidden = false
  el.libraryView.hidden = true
  setPracticeControlsVisible(false)
  el.currentCategory.textContent = '侦探解谜'
  el.currentTitle.textContent = activeDetectiveCase.title

  if (state.phase === 'intro') {
    el.funContent.innerHTML = `
      <div class="detective-shell case-intro">
        <p class="eyebrow">案件档案 · ${activeDetectiveCase.statements.length} 份证词</p>
        <h2>${escapeHtml(activeDetectiveCase.title)}</h2>
        <p>${escapeHtml(activeDetectiveCase.description)}</p>
        <p>完整输入每份证词，收集线索，再输入你的指认。</p>
        <button class="solid-button" type="button" data-begin-detective>开始调查</button>
      </div>
    `
    return
  }
  if (state.phase === 'result') {
    el.funContent.innerHTML = `
      <div class="detective-shell case-result">
        <p class="eyebrow">调查完成</p>
        <h2>${escapeHtml(activeDetectiveCase.result.title)}</h2>
        <p>${escapeHtml(activeDetectiveCase.result.reasoning)}</p>
        <p>${escapeHtml(activeDetectiveCase.result.closing)}</p>
        <div class="story-actions">
          <button class="soft-button" type="button" data-open-fun-hub>返回全部玩法</button>
          <button class="solid-button" type="button" data-restart-detective>再查一次</button>
        </div>
      </div>
    `
    return
  }

  const statement = activeDetectiveCase.statements[state.statementIndex]
  const typingState = getFunTypingState(funCandidates, funTypedValue)
  el.funContent.innerHTML = `
    <div class="detective-shell">
      <div class="story-progress">
        <span>${state.phase === 'statement' ? '调查证词' : '最终指认'}</span>
        <strong>已解锁 ${state.clues.length} / ${activeDetectiveCase.statements.length} 条线索</strong>
      </div>
      ${state.phase === 'statement' ? `
        <section class="statement-card">
          <p class="eyebrow">证词 ${state.statementIndex + 1} · ${escapeHtml(statement.role)}</p>
          <h2>${escapeHtml(statement.speaker)}</h2>
          <p class="statement-text">${renderFunCharacters(typingState.candidates[0])}</p>
        </section>
      ` : ''}
      ${state.clues.length ? `
        <section class="clue-list" aria-label="已解锁线索">
          ${state.clues.map((clue, index) => `
            <article class="clue-card"><strong>线索 ${index + 1}</strong><p>${escapeHtml(clue)}</p></article>
          `).join('')}
        </section>
      ` : ''}
      ${state.phase === 'accusation' ? `
        <section class="accusation-panel">
          <h2>你的指认</h2>
          <p>${escapeHtml(activeDetectiveCase.question)}</p>
          <p class="accusation-answer" aria-label="已输入的指认">${renderDetectiveAnswer()}</p>
          <button class="solid-button" type="button" data-submit-detective>确认指认</button>
        </section>
      ` : ''}
      ${renderFunInputControls(state.phase === 'statement' ? '输入当前证词' : '输入你的指认',
        state.phase === 'statement' ? '直接输入证词，完整匹配后解锁线索'
          : state.wrongAttempts ? activeDetectiveCase.wrongHint : '输入你的判断，按 Enter 或点击「确认指认」提交')}
    </div>
  `
  renderFunKeyboard(state.phase === 'statement' ? typingState.nextChars : [])
  requestAnimationFrame(() => qs('#funTypingInput', el.funContent)?.focus({ preventScroll: true }))
}

function render() {
  renderContentList()
  if (activeView === 'games') renderGames()
  else if (activeView === 'history') renderHistory()
  else if (activeView === 'library') renderLibrary()
  else if (activeView === 'fun') renderFunHub()
  else if (activeView === 'memory') renderMemory()
  else if (activeView === 'story') renderStory()
  else if (activeView === 'detective') renderDetective()
  else renderPractice()
}

function focusTypingInput(force = false) {
  if (activeView !== 'practice' || el.editorDialog.open || typing.isFinished) return
  if (!force) {
    const activeElement = document.activeElement
    const shouldKeepCurrentFocus = activeElement && activeElement !== document.body && activeElement !== el.typingInput && (
      activeElement.closest('button, a, input, select, textarea, dialog') ||
      activeElement.closest('.sidebar, .topbar')
    )
    if (shouldKeepCurrentFocus) return
  }
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
    <option value="${escapeHtml(mode.id)}" title="${escapeHtml(mode.description)}">${escapeHtml(mode.title)}</option>
  `).join('')
  if (!PRACTICE_MODES.some(mode => mode.id === practiceMode)) practiceMode = 'free'
  el.practiceMode.value = practiceMode
  const activeMode = PRACTICE_MODES.find(mode => mode.id === practiceMode)
  el.practiceMode.title = activeMode ? activeMode.description : ''
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
  focusTypingInput(true)
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
  resetTextScroll()
  render()
  focusTypingInput(true)
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
  const targetLength = Array.from(getCompareText()).length
  el.resultMeta.textContent = `已输入 ${stats.typedLength} / ${targetLength} 字符 · 错误按键 ${stats.errors}`
  el.reviewMistakesButton.hidden = typing.mistakeChars.size === 0
  el.resultModal.hidden = false
}

function restartCurrentPractice() {
  el.resultModal.hidden = true
  typing.reset()
  resetTextScroll()
  render()
  focusTypingInput(true)
}

function startNextPractice() {
  const active = getActiveContent()
  const candidates = getContents().filter(item => item.category === active.category && !item.isGenerated)
  const currentIndex = candidates.findIndex(item => item.id === active.id)
  const next = candidates[(currentIndex + 1) % candidates.length]

  el.resultModal.hidden = true
  if (next) {
    activeId = next.id
    localStorage.setItem(ACTIVE_KEY, activeId)
    contentLibrary.recordRecent(activeId)
  }
  activeView = 'practice'
  typing.reset()
  resetTextScroll()
  render()
  focusTypingInput(true)
}

function createMistakeReview() {
  el.resultModal.hidden = true
  const mistakeChars = [...typing.mistakeChars]
  if (!mistakeChars.length) return
  startGeneratedReview({
    id: MISTAKE_REVIEW_ID,
    title: '本次错项复习',
    chars: mistakeChars,
    preferredContent: getActiveContent()
  })
}

function startWeakReview() {
  const mistakeChars = getWeakMistakeEntries()
    .map(([char]) => char)
    .slice(0, 40)
  if (!mistakeChars.length) return

  closeMobileSidebar()
  startGeneratedReview({ id: WEAK_REVIEW_ID, title: '弱项复习', chars: mistakeChars })
}

function buildReviewBody(chars, preferredContent) {
  const sourceContents = [
    ...(preferredContent ? [preferredContent] : []),
    ...getContents()
  ].filter((item, index, items) => (
    !item.isGenerated && items.findIndex(candidate => candidate.id === item.id) === index
  ))
  const onlyLatin = chars.every(char => /^[a-z]$/i.test(char))
  const snippets = []

  chars.forEach(char => {
    const candidates = sourceContents.flatMap(item => {
      if (onlyLatin) return item.body.match(/[a-z]+/gi) || []
      return item.body.match(/[^\u3002！？!?\n]+[\u3002！？!?]?/g) || []
    }).filter(text => text.includes(char))
      .sort((a, b) => a.length - b.length)
    const snippet = candidates.find(text => !snippets.includes(text))
    if (snippet) snippets.push(snippet.trim())
  })

  const contextualBody = snippets.join(onlyLatin ? ' ' : '\n')
  if (contextualBody) return Array.from(contextualBody).slice(0, MAX_CUSTOM_LENGTH).join('')
  return chars.join(onlyLatin ? ' ' : '')
}

function startGeneratedReview({ id, title, chars, preferredContent }) {
  const uniqueChars = [...new Set(chars)].filter(Boolean)
  if (!uniqueChars.length) return
  const reviewCategory = preferredContent && CATEGORIES.includes(preferredContent.category)
    ? preferredContent.category
    : (uniqueChars.every(char => /^[a-z]$/i.test(char)) ? '拼音' : '文章')

  const customItems = readCustomContents()
  const item = {
    id,
    title,
    category: reviewCategory,
    isCustom: true,
    isGenerated: true,
    reviewCharacters: uniqueChars,
    body: buildReviewBody(uniqueChars, preferredContent)
  }
  const existingIndex = customItems.findIndex(content => content.id === id)
  if (existingIndex >= 0) customItems.splice(existingIndex, 1)
  customItems.unshift(item)
  writeCustomContents(customItems)
  activeId = item.id
  activeView = 'practice'
  localStorage.setItem(ACTIVE_KEY, activeId)
  typing.reset()
  resetTextScroll()
  render()
  focusTypingInput(true)
}

function bindEvents() {
  renderPracticeModeOptions()

  document.querySelectorAll('.side-section > summary').forEach(summary => {
    summary.addEventListener('click', () => {
      if (el.appShell.classList.contains('sidebar-collapsed')) return
      const currentSection = summary.parentElement
      if (currentSection.open) return
      document.querySelectorAll('.side-section[open]').forEach(section => {
        if (section !== currentSection) section.open = false
      })
    })
  })

  el.contentSearch.addEventListener('input', () => {
    contentSearchQuery = el.contentSearch.value.trim()
    renderContentList()
  })
  el.randomContentButton.addEventListener('click', startRandomFromCurrentCategory)
  el.favoriteTab.addEventListener('click', () => openLibrary('favorites'))
  el.recentTab.addEventListener('click', () => openLibrary('recents'))
  el.libraryRandomButton.addEventListener('click', () => startRandomPractice(getActiveLibraryContents()))
  el.libraryList.addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-library-favorite]')
    if (favoriteButton) {
      toggleFavorite(event, favoriteButton.dataset.libraryFavorite)
      return
    }
    const item = event.target.closest('[data-library-open], [data-library-id]')
    if (item) selectContent(item.dataset.libraryOpen || item.dataset.libraryId)
  })

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
  el.textSection.addEventListener('click', () => focusTypingInput(true))
  el.textSection.addEventListener('focus', () => focusTypingInput(true))

  el.resetButton.addEventListener('click', () => {
    if (activeView === 'story') {
      startStory()
      return
    }
    if (activeView === 'detective') {
      startDetective()
      return
    }
    activeView = 'practice'
    typing.reset()
    resetTextScroll()
    render()
    focusTypingInput(true)
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
    closeMobileSidebar()
  })
  el.funModesTab.addEventListener('click', () => {
    activeView = 'fun'
    render()
    closeMobileSidebar()
  })
  el.storyTab.addEventListener('click', () => {
    startStory()
    closeMobileSidebar()
  })
  el.detectiveTab.addEventListener('click', () => {
    startDetective()
    closeMobileSidebar()
  })
  el.memoryTab.addEventListener('click', openMemory)
  el.funContent.addEventListener('input', event => {
    if (event.target.matches('#funTypingInput') && event.target.dataset.composing !== '1') updateFunInput(event.target)
    if (event.target.matches('#memoryInput')) {
      memoryTypedValue = event.target.value.replace(/\s+/g, '')
      if (event.target.value !== memoryTypedValue) event.target.value = memoryTypedValue
      const preview = qs('#memoryTypedPreview', el.funContent)
      if (preview) preview.innerHTML = renderMemoryTypedValue()
    }
  })
  el.funContent.addEventListener('change', event => {
    if (event.target.matches('#memoryPinyinToggle')) {
      memoryShowPinyin = event.target.checked
      localStorage.setItem(MEMORY_PINYIN_KEY, memoryShowPinyin ? '1' : '0')
    }
    if (event.target.matches('#memorySoundToggle')) memoryAudio.setEnabled(event.target.checked)
  })
  el.funContent.addEventListener('compositionstart', event => {
    if (event.target.matches('#funTypingInput')) event.target.dataset.composing = '1'
  })
  el.funContent.addEventListener('compositionend', event => {
    if (!event.target.matches('#funTypingInput')) return
    event.target.dataset.composing = ''
    updateFunInput(event.target)
  })
  el.funContent.addEventListener('keydown', event => {
    if (event.target.matches('#memoryInput') && event.key === 'Enter') {
      if (event.isComposing || event.keyCode === 229) return
      event.preventDefault()
      submitMemoryAttempt()
      return
    }
    if (!event.target.matches('#funTypingInput') || event.key !== 'Enter') return
    if (event.isComposing || event.keyCode === 229 || event.target.dataset.composing === '1') return
    if (activeView === 'detective' && detectiveState.getState().phase === 'accusation') {
      event.preventDefault()
      submitDetectiveAnswer()
    }
  })
  el.funContent.addEventListener('click', event => {
    if (event.target.closest('[data-toggle-fun-keyboard]')) toggleFunKeyboard()
    if (event.target.closest('[data-start-fun="branching-story"]')) startStory()
    if (event.target.closest('[data-start-fun="memory"]')) openMemory()
    if (event.target.closest('[data-restart-story]')) startStory()
    if (event.target.closest('[data-start-fun="detective"], [data-restart-detective]')) startDetective()
    if (event.target.closest('[data-begin-detective]')) beginDetective()
    if (event.target.closest('[data-submit-detective]')) submitDetectiveAnswer()
    if (event.target.closest('[data-start-memory-round]')) startMemoryRound()
    if (event.target.closest('[data-submit-memory]')) submitMemoryAttempt()
    if (event.target.closest('[data-configure-memory]')) {
      memorySession = null
      memoryTypedValue = ''
      render()
    }
    const memoryTypeButton = event.target.closest('[data-memory-type]')
    if (memoryTypeButton) {
      memoryType = memoryTypeButton.dataset.memoryType
      render()
    }
    const memoryDifficultyButton = event.target.closest('[data-memory-difficulty]')
    if (memoryDifficultyButton) {
      memoryDifficulty = memoryDifficultyButton.dataset.memoryDifficulty
      render()
    }
    if (event.target.closest('[data-open-fun-hub]')) {
      activeView = 'fun'
      render()
    }
    if (event.target.closest('.story-shell, .detective-shell')) qs('#funTypingInput', el.funContent)?.focus({ preventScroll: true })
  })
  el.historyTab.addEventListener('click', () => {
    activeView = 'history'
    render()
    closeMobileSidebar()
  })
  el.weakReviewTab.addEventListener('click', startWeakReview)
  el.practiceMode.addEventListener('change', () => {
    practiceMode = el.practiceMode.value
    localStorage.setItem(MODE_KEY, practiceMode)
    const activeMode = PRACTICE_MODES.find(mode => mode.id === practiceMode)
    el.practiceMode.title = activeMode ? activeMode.description : ''
    activeView = 'practice'
    typing.reset()
    resetTextScroll()
    render()
    focusTypingInput(true)
  })
  el.sidebarToggle.addEventListener('click', () => {
    const collapsed = el.appShell.classList.toggle('sidebar-collapsed')
    if (collapsed) {
      expandedSectionsBeforeCollapse = new Set(
        [...document.querySelectorAll('.side-section[data-side-section][open]')]
          .map(section => section.dataset.sideSection)
      )
      document.querySelectorAll('.side-section[data-side-section]').forEach(section => {
        section.open = true
      })
    } else if (expandedSectionsBeforeCollapse) {
      document.querySelectorAll('.side-section[data-side-section]').forEach(section => {
        section.open = expandedSectionsBeforeCollapse.has(section.dataset.sideSection)
      })
      expandedSectionsBeforeCollapse = null
    }
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
    focusTypingInput(true)
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
    restartCurrentPractice()
  })
  el.nextButton.addEventListener('click', startNextPractice)
  el.reviewMistakesButton.addEventListener('click', createMistakeReview)
}

Object.assign(window.OhMyType, { renderFunKeyboard, toggleFunKeyboard })

bindEvents()
render()
durationTimer = window.setInterval(() => {
  if (activeView === 'memory' && ['reveal', 'input'].includes(memorySession?.getState().phase)) {
    const state = memorySession.getState()
    const countdown = qs('#memoryCountdown', el.funContent)
    if (countdown) countdown.textContent = String(state.remainingSeconds)
    syncMemoryCountdownSound(state)
    if (state.remainingMilliseconds <= 0) {
      if (state.phase === 'reveal') beginMemoryInput()
      else submitMemoryAttempt(true)
    }
    return
  }
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
