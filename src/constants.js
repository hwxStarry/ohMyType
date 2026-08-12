(() => {
window.OhMyType = window.OhMyType || {}

const CUSTOM_KEY = 'ohmytype_custom_contents'
const ACTIVE_KEY = 'ohmytype_active_content'
const SIDEBAR_KEY = 'ohmytype_sidebar_collapsed'
const HISTORY_KEY = 'typestart_history'
const MISTAKE_KEY = 'typestart_mistakes'
const CATEGORY_KEY = 'ohmytype_open_categories'

const MAX_CUSTOM_LENGTH = 745
const CATEGORIES = ['拼音', '诗词', '文章', '文言文', '单词', '英语']

const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
]

const homeKeys = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'])
const dotKeys = new Set(['f', 'j'])

Object.assign(window.OhMyType, {
  ACTIVE_KEY,
  CATEGORIES,
  CATEGORY_KEY,
  CUSTOM_KEY,
  HISTORY_KEY,
  MAX_CUSTOM_LENGTH,
  MISTAKE_KEY,
  SIDEBAR_KEY,
  dotKeys,
  homeKeys,
  keyboardRows
})

})()
