(() => {
window.OhMyType = window.OhMyType || {}

const CUSTOM_KEY = 'ohmytype_custom_contents'
const ACTIVE_KEY = 'ohmytype_active_content'
const SIDEBAR_KEY = 'ohmytype_sidebar_collapsed'
const HISTORY_KEY = 'typestart_history'
const MISTAKE_KEY = 'typestart_mistakes'
const CATEGORY_KEY = 'ohmytype_open_categories'
const MODE_KEY = 'ohmytype_practice_mode'

const MAX_CUSTOM_LENGTH = 745
const CATEGORIES = ['拼音', '诗词', '文章', '文言文', '单词', '英语', '对话·工作管理', '对话·客户沟通', '对话·面试问答', '对话·日常聊天', '对话·客服售后']
const PRACTICE_MODES = [
  { id: 'free', title: '不限时不限字', description: '按当前内容完整练完，不限制时间和字数。' },
  { id: 'time-30', title: '30 秒限时', description: '输入开始后 30 秒自动结束。' },
  { id: 'time-60', title: '60 秒限时', description: '输入开始后 60 秒自动结束。' },
  { id: 'count-20', title: '20 字练习', description: '只练当前内容的前 20 个字符。' },
  { id: 'count-50', title: '50 字练习', description: '只练当前内容的前 50 个字符。' },
  { id: 'strict', title: '错字阻止', description: '敲错时不会录入错误字符。' }
]

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
  MODE_KEY,
  PRACTICE_MODES,
  SIDEBAR_KEY,
  dotKeys,
  homeKeys,
  keyboardRows
})

})()
